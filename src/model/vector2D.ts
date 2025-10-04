export class Vector2D {
    static readonly ZERO: Vector2D = new Vector2D(0 ,0);
    static readonly X_AXIS: Vector2D = new Vector2D(1 ,0);
    static readonly Y_AXIS: Vector2D = new Vector2D(0 ,1);

    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number) {
        this.y = y || 0;
        this.x = x || 0;
    }

    deltaToReach(anotherVector: Vector2D) {
        return anotherVector.minus(this);
    }

    plus(anotherVector: Vector2D) {
        return this._zipWith(anotherVector, (a, b) => a + b);
    }

    minus(anotherVector: Vector2D) {
        return this._zipWith(anotherVector, (a, b) => a - b);
    }

    distanceTo(anotherVector: Vector2D) {
        return this.minus(anotherVector).magnitude();
    }

    max(anotherVector: Vector2D) {
        return this._zipWith(anotherVector, Math.max);
    }

    min(anotherVector: Vector2D) {
        return this._zipWith(anotherVector, Math.min);
    }

    dot(anotherVector: Vector2D) {
        return this._zipWith(anotherVector, (a, b) => a * b);
    }

    map(transformation: (coordinate: number) => number) {
        return vector(
            transformation(this.x),
            transformation(this.y),
        );
    }

    normalized() {
        const magnitude = this.magnitude();
        return this.map(coordinate => coordinate / magnitude);
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    times(number: number) {
        return this.map(coordinate => coordinate * number);
    }

    equals(anotherVector: Vector2D) {
        return this.x === anotherVector.x && this.y === anotherVector.y;
    }

    round() {
        return this.map(Math.round);
    }

    private _zipWith(anotherVector: Vector2D, combiner: (leftCoordinate: number, rightCoordinate: number) => number) {
        return vector(
            combiner(this.x, anotherVector.x),
            combiner(this.y, anotherVector.y),
        );
    }

    sign() {
        return this.map(Math.sign);
    }

    isZero() {
        return this.x == 0 && this.y == 0;
    }
}

export function vector(x: number, y: number) {
    return new Vector2D(x, y);
}
