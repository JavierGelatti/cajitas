import {point, Position} from "./position.ts";

export abstract class Line {
    static between(p1: Position, p2: Position): Line {
        if (p1.x == p2.x && p1.y == p2.y) throw new Error("Cannot create line with single point");

        if (p1.x == p2.x) return Line.vertical(p1.x);
        if (p1.y == p2.y) return Line.horizontal(p1.y);
        return new LineBetweenPoints(p1, p2);
    }

    static vertical(x: number) {
        return new VerticalLine(x);
    }

    static horizontal(y: number) {
        return new HorizontalLine(y);
    }

    isParallelTo(anotherLine: Line) {
        return this.slope == anotherLine.slope;
    }

    abstract yFor(x: number): number

    abstract xFor(y: number): number

    intersectionWith(anotherLine: Line): Position {
        if (this.isParallelTo(anotherLine)) throw new Error("Cannot intersect parallel lines");

        return this._intersectionWithNonParallelLine(anotherLine);
    }

    protected abstract _intersectionWithNonParallelLine(anotherLine: Line): Position

    abstract intersectionWithLineBetweenPoints(anotherLine: LineBetweenPoints): Position

    abstract get slope(): number
}

class LineBetweenPoints extends Line {
    private readonly _p: Position;
    private readonly _dx: number;
    private readonly _dy: number;

    constructor(p1: Position, p2: Position) {
        super();
        this._dy = p2.y - p1.y;
        this._dx = p2.x - p1.x;
        this._p = p1;
    }

    get slope() {
        return this._dy / this._dx;
    }

    yFor(x: number) {
        return this._dy / this._dx * (x - this._p.x) + this._p.y;
    }

    xFor(y: number) {
        return (y - this._p.y) * this._dx / this._dy + this._p.x;
    }

    protected _intersectionWithNonParallelLine(anotherLine: Line): Position {
        return anotherLine.intersectionWithLineBetweenPoints(this);
    }

    intersectionWithLineBetweenPoints(anotherLine: LineBetweenPoints): Position {
        const intersectionX = (this.slope * this._p.x - anotherLine.slope * anotherLine._p.x + anotherLine._p.y - this._p.y) / (this.slope - anotherLine.slope);
        return point(intersectionX, this.yFor(intersectionX));
    }
}

class HorizontalLine extends Line {
    private readonly _y: number;

    constructor(y: number) {
        super();
        this._y = y;
    }

    get slope(): number {
        return 0;
    }

    yFor(_x: number) {
        return this._y;
    }

    xFor(_y: number): never {
        throw new Error("Cannot get x coordinate from horizontal line");
    }

    protected _intersectionWithNonParallelLine(anotherLine: Line): Position {
        return point(anotherLine.xFor(this._y), this._y);
    }

    intersectionWithLineBetweenPoints(anotherLine: LineBetweenPoints): Position {
        return this.intersectionWith(anotherLine);
    }
}

class VerticalLine extends Line {
    private readonly _x: number;

    constructor(x: number) {
        super();
        this._x = x;
    }

    get slope(): number {
        return Infinity;
    }

    yFor(_x: number): never {
        throw new Error("Cannot get y coordinate from vertical line");
    }

    xFor(_y: number) {
        return this._x;
    }

    protected _intersectionWithNonParallelLine(anotherLine: Line): Position {
        return point(this._x, anotherLine.yFor(this._x));
    }

    intersectionWithLineBetweenPoints(anotherLine: LineBetweenPoints): Position {
        return this.intersectionWith(anotherLine);
    }
}
