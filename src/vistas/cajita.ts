import {Box} from "../model/box.ts";
import type {TranslationEvent} from "../model/events/translationEvent.ts";
import {Position} from "../model/position.ts";
import {createSvgElement, makeDraggable} from "./basics/dom.ts";

export class Cajita {
    private readonly _elemento: SVGRectElement;
    private readonly _box: Box;

    constructor(ancho: number, alto: number, posicion: Position) {
        this._box = new Box(ancho, alto, posicion);
        this._elemento = createSvgElement("rect", {
            width: this._box.width,
            height: this._box.height,
            transform: this._transformString(),
            stroke: "black",
            fill: "white",
        });
        this._box.addEventListener("translate", () => this._actualizarPosicion());

        makeDraggable(this._elemento, _pageGrabPosition => ({
            grabbedElement: this._elemento,
            onDrag: (_cursorPosition, delta) => this._box.moveBy(delta),
        }));
    }

    get box() {
        return this._box;
    }

    elemento() {
        return this._elemento;
    }

    alMoverse(listener: (event: TranslationEvent) => void) {
        this._box.addEventListener("translate", listener);
    }

    moverseSiChocóCon(unaCaja: Box) {
        if (this._box === unaCaja) return;

        const hitDelta = this._box.hitDelta(unaCaja);

        if (hitDelta === null) return;

        this._box.moveBy(hitDelta);
    }

    private _actualizarPosicion() {
        this._elemento.setAttribute("transform", this._transformString());
    }

    private _transformString() {
        const posición = this._box.position;
        return `translate(${(posición.x)}, ${(posición.y)})`;
    }
}