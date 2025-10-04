import {vector, Vector2D} from "../../model/vector2D.ts";

export type PointerEventType
    = "pointerover"
    | "pointerenter"
    | "pointerdown"
    | "pointermove"
    | "pointerup"
    | "pointercancel"
    | "pointerout"
    | "pointerleave"

export type ClientLocation = { clientX: number, clientY: number };

export function createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K, properties: Partial<Omit<HTMLElementTagNameMap[K], "style"> & {
        style: Partial<CSSStyleDeclaration>
    }> = {}, children: (Node | string)[] = [],
) {
    const newElement = document.createElement(tagName);
    const {style, ...propertiesWithoutStyle} = properties;
    Object.assign(newElement, propertiesWithoutStyle);
    if (style) Object.assign(newElement.style, style);
    newElement.append(...children);
    return newElement;
}

export function createFragment(children: (Node | string)[] = []) {
    const fragment = document.createDocumentFragment();
    fragment.append(...children);
    return fragment;
}

type SVGAttributesMap = {
    "path": {
        d: string,
        stroke: string,
        fill: string,
        pathLength: number,
    },
    "svg": {
        width: number,
        height: number,
    },
    "g": {
        transform: string,
    },
    "rect": {
        x: number,
        y: number,
        width: number,
        height: number,
        stroke: string,
        fill: string,
        transform: string
    },
    "text": {
        x: number,
        y: number,
    },
    "foreignObject": {
        width: number,
        height: number,
        x: number,
        y: number,
    },
    "line": {
        x1: number,
        y1: number,
        x2: number,
        y2: number,
    }
};


type SVGAttributes<K extends keyof SVGElementTagNameMap> = K extends keyof SVGAttributesMap
    ? SVGAttributesMap[K] & { class: string }
    : `UNKNOWN TAG: ${K}`;

export function createSvgElement<K extends keyof SVGElementTagNameMap>(
    tagName: K, attributes: Partial<SVGAttributes<K>> = {}, children: (Node | string)[] = [],
) {
    const newElement = document.createElementNS("http://www.w3.org/2000/svg", tagName);
    for (const [attributeName, attributeValue] of Object.entries(attributes)) {
        newElement.setAttribute(attributeName, String(attributeValue));
    }
    newElement.append(...children);
    return newElement;
}

function addEventListener<E extends HTMLElement | SVGElement, K extends keyof (HTMLElementEventMap & SVGElementEventMap)>(
    element: E, type: K,
    listener: (this: E, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void {
    element.addEventListener(type, listener as any, options);
}

export type DragHandler = {
    grabbedElement: HTMLElement | SVGElement,
    onDrag?: (cursorPosition: Vector2D, delta: Vector2D) => void,
    onDrop?: (cursorPosition: Vector2D) => void,
    onCancel?: () => void,
};

export function makeDraggable(
    draggableElement: HTMLElement | SVGElement,
    onStart: (pageGrabPosition: Vector2D) => DragHandler,
) {
    draggableElement.classList.add("draggable");

    function grab(pointerId: number, pageGrabPosition: Vector2D) {
        const {grabbedElement, onDrag, onDrop, onCancel} = onStart(pageGrabPosition);
        const dragEnd = new AbortController();

        grabbedElement.classList.add("dragging");

        let lastPosition: Vector2D = pageGrabPosition;

        addEventListener(grabbedElement, "pointermove", (event: PointerEvent) => {
            if (event.pointerId !== pointerId) return;

            const newPosition = pagePositionOf(event);
            const delta = lastPosition.deltaToReach(newPosition);

            onDrag?.(newPosition, delta);

            lastPosition = newPosition;
            event.preventDefault();
        }, {signal: dragEnd.signal});

        const endDragRunning = (callback?: (cursorPosition: Vector2D) => void) => (event: PointerEvent) => {
            if (event.pointerId !== pointerId) return;

            callback?.(pagePositionOf(event));
            grabbedElement.classList.remove("dragging");
            draggableElement.classList.remove("dragging");
            dragEnd.abort();
        };

        addEventListener(grabbedElement, "pointerup", endDragRunning(onDrop), {signal: dragEnd.signal});
        addEventListener(grabbedElement, "pointercancel", endDragRunning(onCancel), {signal: dragEnd.signal});
        addEventListener(grabbedElement, "pointerdown", () => dragEnd.abort(), {signal: dragEnd.signal});

        if (draggableElement !== grabbedElement) {
            draggableElement.classList.add("dragging");

            // Avoid implicit pointer capture on touch
            draggableElement.releasePointerCapture(pointerId);

            addEventListener(draggableElement, "pointerout", (event: PointerEvent) => {
                if (event.pointerId !== pointerId) return;

                grabbedElement.setPointerCapture(pointerId);
            }, {signal: dragEnd.signal});

            addEventListener(draggableElement, "pointerup", endDragRunning(onDrop), {signal: dragEnd.signal});
            addEventListener(draggableElement, "pointercancel", endDragRunning(onCancel), {signal: dragEnd.signal});
            addEventListener(draggableElement, "pointerdown", () => {
                dragEnd.abort();
            }, {signal: dragEnd.signal});
        } else {
            grabbedElement.setPointerCapture(pointerId);
        }
    }

    addEventListener(draggableElement, "pointerdown", (event: PointerEvent) => {
        if (event.target !== draggableElement) return;

        event.preventDefault();
        event.stopPropagation();

        grab(event.pointerId, pagePositionOf(event));
    });

    return grab;
}

export function scrollPosition() {
    return vector(window.scrollX, window.scrollY);
}

export function clientPositionOf(event: MouseEvent): Vector2D {
    return vector(event.clientX, event.clientY);
}

export function pagePositionOf(event: MouseEvent): Vector2D {
    return clientPositionOf(event).plus(scrollPosition());
}

export function asClientLocation(position: Vector2D): ClientLocation {
    return {clientX: position.x, clientY: position.y};
}

export function asPosition(clientLocation: ClientLocation): Vector2D {
    return vector(clientLocation.clientX, clientLocation.clientY);
}

export function elementsAt(pagePosition: Vector2D): Element[] {
    const clientPosition = pagePosition.minus(scrollPosition());
    return document.elementsFromPoint(clientPosition.x, clientPosition.y);
}

export class PageBox {
    public readonly x: number;

    public readonly y: number;

    public readonly width: number;

    public readonly height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.height = height;
        this.width = width;
        this.y = y;
        this.x = x;
    }

    get position() {
        return vector(this.x, this.y);
    }

    get size() {
        return vector(this.width, this.height);
    }

    get top() {
        return this.y;
    }

    get bottom() {
        return this.y + this.height;
    }

    get left() {
        return this.x;
    }

    get right() {
        return this.x + this.width;
    }

    center() {
        return vector(this.x + this.width / 2, this.y + this.height / 2);
    }

    origin() {
        return vector(this.x, this.y);
    }

    extent() {
        return vector(this.width, this.height);
    }

    centerOffset() {
        return this.extent().map(c => c / 2);
    }

    contains(position: Vector2D) {
        return this._areOrdered(this.left, position.x, this.right) &&
            this._areOrdered(this.top, position.y, this.bottom);
    }

    private _areOrdered(a: number, b: number, c: number) {
        return a <= b && b <= c;
    }
}

export function positionOfDomElement(element: Element) {
    return boundingPageBoxOf(element).position;
}

export function clientPositionOfDomElement(element: Element) {
    const clientRect = element.getBoundingClientRect();
    return vector(clientRect.x, clientRect.y);
}

export function sizeOfDomElement(element: Element) {
    return boundingPageBoxOf(element).size;
}

export function getElementAt(position: Vector2D) {
    return document.elementFromPoint(position.x, position.y);
}

export function boundingPageBoxOf(controlEnd: Element) {
    const clientRect = controlEnd.getBoundingClientRect();
    return new PageBox(
        clientRect.x + window.scrollX,
        clientRect.y + window.scrollY,
        clientRect.width,
        clientRect.height,
    );
}

export function nodeFromHtmlSource(html: string) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
}
