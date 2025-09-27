import {Box, type Edge} from "./box.ts";
import type {Position} from "./position.ts";
import {Line} from "./line.ts";
import {assertIsFraction, type Fraction} from "./basics/fraction.ts";

export abstract class Anchor {
    static nearest() {
        return new NearestAnchor();
    }

    static pointAtEdge(edge: Edge, aFraction: number) {
        assertIsFraction(aFraction);

        return new PointAtEdgeAnchor(edge, aFraction);
    }

    static nearestFrom(anchors: Anchor[]) {
        return new NearestAnchorFrom(anchors);
    }

    abstract referencePointFor(aBox: Box): Position

    abstract pointFromTo(aBox: Box, targetPoint: Position): Position;
}

class NearestAnchor extends Anchor {
    referencePointFor(aBox: Box) {
        return aBox.center;
    }

    pointFromTo(aBox: Box, targetPoint: Position) {
        const lineBetweenCenters =
            Line.between(aBox.center, targetPoint);

        return aBox.edgeLine(aBox.edgeHeading(targetPoint))
            .intersectionWith(lineBetweenCenters);
    }
}

class PointAtEdgeAnchor extends Anchor {
    private readonly _edge: Edge;
    private readonly _fraction: Fraction;

    constructor(edge: Edge, fraction: Fraction) {
        super();
        this._edge = edge;
        this._fraction = fraction;
    }

    pointFromTo(aBox: Box, _targetPoint: Position): Position {
        return this.referencePointFor(aBox);
    }

    referencePointFor(aBox: Box): Position {
        return aBox.pointAtEdgeFraction(this._edge, this._fraction);
    }
}

class NearestAnchorFrom extends Anchor {
    private _anchors: Anchor[];

    constructor(anchors: Anchor[]) {
        super();
        this._anchors = anchors;
    }

    referencePointFor(aBox: Box): Position {
        return aBox.center;
    }

    pointFromTo(aBox: Box, targetPoint: Position): Position {
        const referencePoint = Anchor.nearest().pointFromTo(aBox, targetPoint);

        const possiblePoints = this._anchors.map(anchor => anchor.pointFromTo(aBox, targetPoint));
        possiblePoints.sort((p1, p2) => {
            return p1.distanceTo(referencePoint) - p2.distanceTo(referencePoint);
        });
        return possiblePoints[0];
    }
}

