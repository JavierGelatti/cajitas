import {describe, expect, test} from "vitest";
import {point} from "../../src/model/position";

describe("position arithmetic operations", () => {
    test("adding two positions returns a new position with summed coordinates", () => {
        const p1 = point(2, 3);
        const p2 = point(4, 5);

        const result = p1.plus(p2);

        expect(result).toEqual(point(6, 8));
    });

    test("subtracting two positions returns a new position with subtracted coordinates", () => {
        const p1 = point(7, 9);
        const p2 = point(3, 4);

        const result = p1.minus(p2);

        expect(result).toEqual(point(4, 5));
    });

    test("multiplying a position by a scalar scales both coordinates", () => {
        const p = point(3, 4);

        const result = p.times(2);

        expect(result).toEqual(point(6, 8));
    });
});

describe("position delta calculations", () => {
    test("deltaToReach calculates the vector from one position to another", () => {
        const from = point(2, 3);
        const to = point(7, 10);

        const delta = from.deltaToReach(to);

        expect(delta).toEqual(point(5, 7));
    });

    test("deltaToReach returns negative values when target is behind", () => {
        const from = point(5, 8);
        const to = point(2, 3);

        const delta = from.deltaToReach(to);

        expect(delta).toEqual(point(-3, -5));
    });

    test("deltaToReach returns zero vector when positions are the same", () => {
        const p = point(4, 5);

        const delta = p.deltaToReach(p);

        expect(delta).toEqual(point(0, 0));
    });
});

describe("position magnitude and normalization", () => {
    test("magnitude of position from origin", () => {
        const p = point(3, 4);

        const mag = p.magnitude();

        expect(mag).toEqual(5);
    });

    test("magnitude of zero position is zero", () => {
        const p = point(0, 0);

        const mag = p.magnitude();

        expect(mag).toEqual(0);
    });

    test("magnitude is always positive", () => {
        const p = point(-3, -4);

        const mag = p.magnitude();

        expect(mag).toEqual(5);
    });

    test("normalized vector has magnitude of 1", () => {
        const p = point(3, 4);

        const normalized = p.normalized();

        expect(normalized.magnitude()).toBeCloseTo(1, 10);
    });

    test("normalized vector maintains direction", () => {
        const p = point(6, 8);

        const normalized = p.normalized();

        expect(normalized.x).toBeCloseTo(0.6, 10);
        expect(normalized.y).toBeCloseTo(0.8, 10);
    });
});

describe("position distance calculations", () => {
    test("distance is the same regardless of direction", () => {
        const p1 = point(2, 3);
        const p2 = point(5, 7);

        const distance1 = p1.distanceTo(p2);
        const distance2 = p2.distanceTo(p1);

        expect(distance1).toEqual(distance2);
    });

    test("distance to itself is zero", () => {
        const p = point(4, 5);

        const distance = p.distanceTo(p);

        expect(distance).toEqual(0);
    });
});

describe("position comparison operations", () => {
    test("max returns position with maximum coordinates from both positions", () => {
        const p1 = point(2, 7);
        const p2 = point(5, 3);

        const maxPos = p1.max(p2);

        expect(maxPos).toEqual(point(5, 7));
    });

    test("min returns position with minimum coordinates from both positions", () => {
        const p1 = point(2, 7);
        const p2 = point(5, 3);

        const minPos = p1.min(p2);

        expect(minPos).toEqual(point(2, 3));
    });

    test("max and min work with negative coordinates", () => {
        const p1 = point(-5, -2);
        const p2 = point(-3, -8);

        const maxPos = p1.max(p2);
        const minPos = p1.min(p2);

        expect(maxPos).toEqual(point(-3, -2));
        expect(minPos).toEqual(point(-5, -8));
    });
});

describe("position equality", () => {
    test("position equals itself", () => {
        const p = point(3, 4);

        expect(p.equals(p)).toBe(true);
    });

    test("positions with same coordinates are equal", () => {
        const p1 = point(3, 4);
        const p2 = point(3, 4);

        expect(p1.equals(p2)).toBe(true);
    });

    test("positions with different x coordinates are not equal", () => {
        const p1 = point(3, 4);
        const p2 = point(5, 4);

        expect(p1.equals(p2)).toBe(false);
    });

    test("positions with different y coordinates are not equal", () => {
        const p1 = point(3, 4);
        const p2 = point(3, 6);

        expect(p1.equals(p2)).toBe(false);
    });
});

describe("position dot product", () => {
    test("dot product of perpendicular vectors is zero", () => {
        const p1 = point(1, 0);
        const p2 = point(0, 1);

        const dotProduct = p1.dot(p2);

        expect(dotProduct.x).toEqual(0);
        expect(dotProduct.y).toEqual(0);
    });

    test("dot product calculation of non-perpendicular vectors", () => {
        const p1 = point(2, 3);
        const p2 = point(4, 5);

        const dotProduct = p1.dot(p2);

        expect(dotProduct.x).toEqual(8);
        expect(dotProduct.y).toEqual(15);
    });
});

describe("position transformations", () => {
    test("map applies transformation to both coordinates", () => {
        const p = point(3, 4);

        const doubled = p.map(coord => coord * 2);

        expect(doubled).toEqual(point(6, 8));
    });

    test("round rounds both coordinates to nearest integer", () => {
        const p = point(3.7, 4.2);

        const rounded = p.round();

        expect(rounded).toEqual(point(4, 4));
    });
});
