import {StraightConnector} from "../connector.ts";
import {DiagramElementEvent} from "../diagramElement.ts";

export const CHANGE_EVENT_NAME = "change" as const;

export class ChangeEvent extends DiagramElementEvent<StraightConnector> {
    constructor() {
        super(CHANGE_EVENT_NAME);
    }
}
