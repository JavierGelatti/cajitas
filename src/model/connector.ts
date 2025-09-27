import {CHANGE_EVENT_NAME, ChangeEvent} from "./events/changeEvent.ts";
import {DiagramElement} from "./diagramElement.ts";
import type {Anchor} from "./anchor.ts";
import {Box} from "./box.ts";

type ConnectorEventsMap = {
    [CHANGE_EVENT_NAME]: ChangeEvent
}

export class StraightConnector extends DiagramElement<ConnectorEventsMap> {
    private _startBox: Box;
    private _startAnchor: Anchor;
    private _endBox: Box;
    private _endAnchor: Anchor;

    constructor(startBox: Box, startAnchor: Anchor, endBox: Box, endAnchor: Anchor) {
        super();

        this._startBox = startBox;
        this._startAnchor = startAnchor;
        this._endBox = endBox;
        this._endAnchor = endAnchor;

        this._endBox.addEventListener("translate", () => {
            this.dispatchEvent(new ChangeEvent());
        });

        this._startBox.addEventListener("translate", () => {
            this.dispatchEvent(new ChangeEvent());
        });
    }

    get startPoint() {
        return this._startAnchor.pointFromTo(this._startBox, this._endAnchor.referencePointFor(this._endBox));
    }

    get endPoint() {
        return this._endAnchor.pointFromTo(this._endBox, this._startAnchor.referencePointFor(this._startBox));
    }
}