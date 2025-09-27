import {describe, expect, test} from "vitest";
import {point} from "../../src/model/position";
import {Box} from "../../src/model/box";
import {TRANSLATION_EVENT_NAME, TranslationEvent} from "../../src/model/events/translationEvent";

describe("box translation", () => {
    test("when a box is moved by a delta, its position changes by that amount", () => {
        const box = new Box(4, 5, point(2, 3));

        box.moveBy(point(1, 2));

        expect(box.position).toEqual(point(3, 5));
    });

    test("when a box is moved to a specific position, its position changes to the received one", () => {
        const box = new Box(4, 5, point(2, 3));

        box.moveTo(point(1, 2));

        expect(box.position).toEqual(point(1, 2));
    });

    test("when a box is moved and it changes position, it emits a translate event", () => {
        const box = new Box(4, 5, point(2, 3));
        let receivedEvent: TranslationEvent | undefined;
        box.addEventListener("translate", (event) => receivedEvent = event);

        box.moveBy(point(1, 2));

        expect(receivedEvent).not.toBeUndefined();
        expect(receivedEvent!.type).toEqual(TRANSLATION_EVENT_NAME);
        expect(receivedEvent!.target).toEqual(box);
        expect(receivedEvent!.bubbles).toEqual(false);
        expect(receivedEvent!.oldPosition).toEqual(point(2, 3));
        expect(receivedEvent!.newPosition).toEqual(point(3, 5));
    });

    test("when a box is moved but it did not change position, it does not emit a translate event", () => {
        const box = new Box(4, 5, point(2, 3));
        let receivedEvent: TranslationEvent | undefined;
        box.addEventListener("translate", (event) => receivedEvent = event);

        box.moveBy(point(0, 0));
        box.moveTo(point(2, 3));

        expect(receivedEvent).toBeUndefined();
    });

    test("when a box is moved but it did not change position, it does not emit a translate event", () => {
        const box = new Box(4, 5, point(2, 3));
        let receivedEvent: TranslationEvent | undefined;
        box.addEventListener("translate", (event) => receivedEvent = event);

        box.moveBy(point(0, 0));
        box.moveTo(point(2, 3));

        expect(receivedEvent).toBeUndefined();
    });

    test("the event listeners can be removed", () => {
        const box = new Box(4, 5, point(2, 3));
        let receivedEvent: Event | undefined;
        const callback = (event: Event) => receivedEvent = event;
        box.addEventListener("translate", callback);

        box.removeEventListener("translate", callback);
        box.moveBy(point(1, 2));

        expect(receivedEvent).toBeUndefined();
    });
});
