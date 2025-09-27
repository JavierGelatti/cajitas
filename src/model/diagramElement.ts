import {Box} from "./box.ts";

export abstract class DiagramElement<EventsMap extends object> extends EventTarget {
    addEventListener<K extends keyof EventsMap>(
        type: K,
        callback: (this: Box, ev: EventsMap[K]) => void,
        options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
        type: string,
        callback: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
        type: string,
        callback: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): void {
        super.addEventListener(type, callback, options);
    }

    removeEventListener<K extends keyof EventsMap>(
        type: K,
        listener: (this: Box, ev: EventsMap[K]) => any,
        options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions,
    ): void {
        super.removeEventListener(type, listener, options);
    }
}

export class DiagramElementEvent<T extends DiagramElement<any>> extends Event {
    declare target: T;

    constructor(type: string, eventInitDict?: EventInit) {
        super(type, {bubbles: false, composed: false, ...eventInitDict});
    }
}
