import {Vector2D} from "../vector2D.ts";
import {Box} from "../box.ts";
import {DiagramElementEvent} from "../diagramElement.ts";

export const TRANSLATION_EVENT_NAME = "translate" as const;

export class TranslationEvent extends DiagramElementEvent<Box> {
    public readonly oldPosition: Vector2D;
    public readonly newPosition: Vector2D;

    constructor(oldPosition: Vector2D, newPosition: Vector2D) {
        super(TRANSLATION_EVENT_NAME);
        this.oldPosition = oldPosition;
        this.newPosition = newPosition;
    }
}
