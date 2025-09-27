import {Position} from "../position.ts";
import {Box} from "../box.ts";
import {DiagramElementEvent} from "../diagramElement.ts";

export const TRANSLATION_EVENT_NAME = "translate" as const;

export class TranslationEvent extends DiagramElementEvent<Box> {
    public readonly oldPosition: Position;
    public readonly newPosition: Position;

    constructor(oldPosition: Position, newPosition: Position) {
        super(TRANSLATION_EVENT_NAME);
        this.oldPosition = oldPosition;
        this.newPosition = newPosition;
    }
}
