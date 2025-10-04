import {Vector2D} from "./vector2D.ts";

import type {Fraction} from "./basics/fraction.ts";

export class LineSegment {
    private readonly _from: Vector2D;
    private readonly _to: Vector2D;

    constructor(from: Vector2D, to: Vector2D) {
        this._from = from;
        this._to = to;
    }

    pointAtFraction(fraction: Fraction) {
        return this._to.minus(this._from).times(fraction).plus(this._from);
    }
}