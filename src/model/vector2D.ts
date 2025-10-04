export class Vector2D {
    static readonly ZERO: Vector2D = new Vector2D(0 ,0);

    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number) {
        this.y = y;
        this.x = x;
    }

    deltaToReach(anotherPosition: Vector2D) {
        return anotherPosition.minus(this);
    }

    plus(anotherPosition: Vector2D) {
        return this._zipWith(anotherPosition, (a, b) => a + b);
    }

    minus(anotherPosition: Vector2D) {
        return this._zipWith(anotherPosition, (a, b) => a - b);
    }

    distanceTo(anotherPosition: Vector2D) {
        return this.minus(anotherPosition).magnitude();
    }

    max(anotherPosition: Vector2D) {
        return this._zipWith(anotherPosition, Math.max);
    }

    min(anotherPosition: Vector2D) {
        return this._zipWith(anotherPosition, Math.min);
    }

    dot(anotherPosition: Vector2D) {
        return this._zipWith(anotherPosition, (a, b) => a * b);
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

    equals(anotherPosition: Vector2D) {
        return this.x === anotherPosition.x && this.y === anotherPosition.y;
    }

    round() {
        return this.map(Math.round);
    }

    private _zipWith(anotherPosition: Vector2D, combiner: (leftCoordinate: number, rightCoordinate: number) => number) {
        return vector(
            combiner(this.x, anotherPosition.x),
            combiner(this.y, anotherPosition.y),
        );
    }
}

export function vector(x: number, y: number) {
    return new Vector2D(x, y);
}
