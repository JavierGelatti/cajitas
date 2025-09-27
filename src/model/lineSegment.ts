import {Position} from "./position.ts";

import type {Fraction} from "./basics/fraction.ts";

export class LineSegment {
    private readonly _from: Position;
    private readonly _to: Position;

    constructor(from: Position, to: Position) {
        this._from = from;
        this._to = to;
    }

    pointAtFraction(fraction: Fraction) {
        return this._to.minus(this._from).times(fraction).plus(this._from);
    }
}