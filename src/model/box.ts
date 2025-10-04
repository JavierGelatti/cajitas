import {vector, Vector2D} from "./vector2D.ts";
import {Line} from "./line.ts";
import {TRANSLATION_EVENT_NAME, TranslationEvent} from "./events/translationEvent.ts";
import {Anchor} from "./anchor.ts";
import {DiagramElement} from "./diagramElement.ts";
import {StraightConnector} from "./connector.ts";
import {LineSegment} from "./lineSegment.ts";
import type {Fraction} from "./basics/fraction.ts";

export type Edge = "top" | "bottom" | "left" | "right";
export const Edge = {
    top: "top" as Edge,
    bottom: "bottom" as Edge,
    left: "left" as Edge,
    right: "right" as Edge,
};
type BoxEventsMap = {
    [TRANSLATION_EVENT_NAME]: TranslationEvent
}

export class Box extends DiagramElement<BoxEventsMap> {
    public readonly width: number;
    public readonly height: number;

    constructor(width: number, height: number, position: Vector2D) {
        super();
        this.width = width;
        this.height = height;
        this._position = position;
    }

    private _position: Vector2D;

    get position(): Vector2D {
        return this.topLeft;
    }

    get size(): Vector2D {
        return vector(this.width, this.height);
    }

    get top() {
        return this._position.y;
    }

    get bottom() {
        return this._position.y + this.height;
    }

    get left() {
        return this._position.x;
    }

    get right() {
        return this._position.x + this.width;
    }

    get topLeft() {
        return this._position;
    }

    get topCenter() {
        return vector(this._position.x + this.width / 2, this._position.y);
    }

    get topRight() {
        return vector(this._position.x + this.width, this._position.y);
    }

    get bottomLeft() {
        return vector(this._position.x, this._position.y + this.height);
    }

    get bottomCenter() {
        return vector(this._position.x + this.width / 2, this._position.y + this.height);
    }

    get bottomRight() {
        return vector(this._position.x + this.width, this._position.y + this.height);
    }

    get leftCenter() {
        return vector(
            this._position.x,
            this._position.y + this.height / 2,
        );
    }

    get rightCenter() {
        return vector(
            this._position.x + this.width,
            this._position.y + this.height / 2,
        );
    }

    get center() {
        return vector(
            this._position.x + this.width / 2,
            this._position.y + this.height / 2,
        );
    }

    edgeHeading(aPoint: Vector2D): Edge {
        const firstDiagonal = Line.between(this.topLeft, this.bottomRight);
        const secondDiagonal = Line.between(this.bottomLeft, this.topRight);
        const belowFirstDiagonal = firstDiagonal.yFor(aPoint.x) < aPoint.y;
        const belowSecondDiagonal = secondDiagonal.yFor(aPoint.x) < aPoint.y;

        if (belowFirstDiagonal && belowSecondDiagonal) return "bottom";
        if (belowFirstDiagonal && !belowSecondDiagonal) return "left";
        if (!belowFirstDiagonal && belowSecondDiagonal) return "right";
        if (!belowFirstDiagonal && !belowSecondDiagonal) return "top";

        throw new Error("The impossible happened");
    }

    edgeLine(edge: Edge) {
        switch (edge) {
            case "top":
                return Line.horizontal(this.top);
            case "bottom":
                return Line.horizontal(this.bottom);
            case "left":
                return Line.vertical(this.left);
            case "right":
                return Line.vertical(this.right);
        }
    }

    moveBy(delta: Vector2D) {
        this.moveTo(this._position.plus(delta));
    }

    moveTo(newPosition: Vector2D) {
        const oldPosition = this._position;
        if (oldPosition.equals(newPosition)) return;

        this._position = newPosition;
        this.dispatchEvent(new TranslationEvent(oldPosition, newPosition));
    }

    straightConnectorTo(anotherBox: Box, startAnchor: Anchor, endAnchor: Anchor) {
        return new StraightConnector(this, startAnchor, anotherBox, endAnchor);
    }

    topEdgeAnchorAtFraction(aFraction: number) {
        return Anchor.pointAtEdge(Edge.top, aFraction);
    }

    bottomEdgeAnchorAtFraction(aFraction: number) {
        return Anchor.pointAtEdge(Edge.bottom, aFraction);
    }

    rightEdgeAnchorAtFraction(aFraction: number) {
        return Anchor.pointAtEdge(Edge.right, aFraction);
    }

    leftEdgeAnchorAtFraction(aFraction: number) {
        return Anchor.pointAtEdge(Edge.left, aFraction);
    }

    pointAtEdgeFraction(edge: Edge, fraction: Fraction) {
        return this.segmentForEdge(edge).pointAtFraction(fraction);
    }

    segmentForEdge(edge: Edge) {
        switch (edge) {
            case "top":
                return new LineSegment(this.topLeft, this.topRight);
            case "right":
                return new LineSegment(this.topRight, this.bottomRight);
            case "bottom":
                return new LineSegment(this.bottomRight, this.bottomLeft);
            case "left":
                return new LineSegment(this.bottomLeft, this.topLeft);
        }
    }

    nearestFixedAnchor() {
        return Anchor.nearestFrom(this.allAnchors());
    }

    allAnchors() {
        return [0.20, 0.5, 0.80].flatMap(fractionValue =>
            [Edge.top, Edge.right, Edge.bottom, Edge.left].map(edge =>
                Anchor.pointAtEdge(edge, fractionValue),
            ),
        );
    }

    hitDelta(anotherBox: Box): Vector2D {
        const overlapX = Math.min(this.right - anotherBox.left, anotherBox.right - this.left);
        const overlapY = Math.min(this.bottom - anotherBox.top, anotherBox.bottom - this.top);

        if (overlapX <= 0 || overlapY <= 0) {
            return vector(0, 0);
        }

        let deltaX = 0;
        let deltaY = 0;

        if (overlapX < overlapY) {
            const rect1CenterX = this.center.x;
            const rect2CenterX = anotherBox.center.x;

            if (rect1CenterX < rect2CenterX) {
                deltaX = -overlapX;
            } else {
                deltaX = overlapX;
            }
        } else {
            const rect1CenterY = this.center.y;
            const rect2CenterY = anotherBox.center.y;

            if (rect1CenterY < rect2CenterY) {
                deltaY = -overlapY;
            } else {
                deltaY = overlapY;
            }
        }

        return vector(deltaX, deltaY);
    }
}

