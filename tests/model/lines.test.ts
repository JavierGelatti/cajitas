import {describe, expect, test} from "vitest";
import {vector} from "../../src/model/vector2D.ts";
import {Line} from "../../src/model/line";

describe("line basic characteristics", () => {
    test("creates a line between two points with different x and y coordinates", () => {
        const p1 = vector(1, 2);
        const p2 = vector(3, 6);

        const line = Line.between(p1, p2);

        expect(line.yFor(1)).toEqual(2);
        expect(line.yFor(3)).toEqual(6);
    });

    test("creates a vertical line when both points have the same x coordinate", () => {
        const p1 = vector(3, 1);
        const p2 = vector(3, 5);

        const line = Line.between(p1, p2);

        expect(line.xFor(2)).toEqual(3);
        expect(line.xFor(4)).toEqual(3);
    });

    test("creates a horizontal line when both points have the same x coordinate", () => {
        const p1 = vector(1, 3);
        const p2 = vector(5, 3);

        const line = Line.between(p1, p2);

        expect(line.yFor(2)).toEqual(3);
        expect(line.yFor(4)).toEqual(3);
    });

    test("cannot create line between same point", () => {
        const p = vector(1, 2);

        expect(() => Line.between(p, p))
            .toThrowError("Cannot create line with single point");
    });

    test("creates a horizontal line directly", () => {
        const line = Line.horizontal(5);

        expect(line.yFor(0)).toEqual(5);
        expect(line.yFor(10)).toEqual(5);
        expect(line.yFor(-5)).toEqual(5);
    });

    test("creates a vertical line directly", () => {
        const line = Line.vertical(3);

        expect(line.xFor(0)).toEqual(3);
        expect(line.xFor(10)).toEqual(3);
        expect(line.xFor(-5)).toEqual(3);
    });
});

describe("line between points calculations", () => {
    test("calculates y for given x on a positive slope line", () => {
        const line = Line.between(vector(0, 0), vector(4, 8));

        expect(line.yFor(2)).toEqual(4);
        expect(line.yFor(1)).toEqual(2);
        expect(line.yFor(3)).toEqual(6);
    });

    test("calculates y for given x on a negative slope line", () => {
        const line = Line.between(vector(0, 8), vector(4, 0));

        expect(line.yFor(2)).toEqual(4);
        expect(line.yFor(1)).toEqual(6);
        expect(line.yFor(3)).toEqual(2);
    });

    test("calculates x for given y on a positive slope line", () => {
        const line = Line.between(vector(0, 0), vector(4, 8));

        expect(line.xFor(4)).toEqual(2);
        expect(line.xFor(2)).toEqual(1);
        expect(line.xFor(6)).toEqual(3);
    });

    test("calculates x for given y on a negative slope line", () => {
        const line = Line.between(vector(0, 8), vector(4, 0));

        expect(line.xFor(4)).toEqual(2);
        expect(line.xFor(6)).toEqual(1);
        expect(line.xFor(2)).toEqual(3);
    });

    test("extrapolates beyond the original points", () => {
        const line = Line.between(vector(1, 2), vector(3, 6));

        expect(line.yFor(0)).toEqual(0);
        expect(line.yFor(5)).toEqual(10);
        expect(line.xFor(0)).toEqual(0);
        expect(line.xFor(10)).toEqual(5);
    });

    test("handles lines with decimal slope correctly", () => {
        const line = Line.between(vector(0, 0), vector(3, 2));

        expect(line.yFor(1.5)).toBeCloseTo(1);
        expect(line.xFor(1)).toBeCloseTo(1.5);
    });
});

describe("horizontal line behavior", () => {
    test("always returns the same y value", () => {
        const line = Line.horizontal(7);

        expect(line.yFor(-100)).toEqual(7);
        expect(line.yFor(0)).toEqual(7);
        expect(line.yFor(100)).toEqual(7);
    });

    test("cannot get the x coordinate for a y-value", () => {
        const line = Line.horizontal(5);

        expect(() => line.xFor(5)).toThrowError("Cannot get x coordinate from horizontal line");
        expect(() => line.xFor(0)).toThrowError("Cannot get x coordinate from horizontal line");
    });
});

describe("vertical line behavior", () => {
    test("always returns the same x value", () => {
        const line = Line.vertical(4);

        expect(line.xFor(-100)).toEqual(4);
        expect(line.xFor(0)).toEqual(4);
        expect(line.xFor(100)).toEqual(4);
    });

    test("cannot get the x coordinate for an x-value", () => {
        const line = Line.vertical(5);

        expect(() => line.yFor(5)).toThrowError("Cannot get y coordinate from vertical line");
        expect(() => line.yFor(0)).toThrowError("Cannot get y coordinate from vertical line");
    });
});

describe("line intersections", () => {
    describe("between two diagonal lines", () => {
        test("intersecting lines with different slopes", () => {
            const line1 = Line.between(vector(0, 0), vector(4, 4));
            const line2 = Line.between(vector(0, 4), vector(4, 0));

            const intersection = line1.intersectionWith(line2);

            expect(intersection).toEqual(vector(2, 2));
        });

        test("intersection is commutative", () => {
            const line1 = Line.between(vector(0, 0), vector(4, 4));
            const line2 = Line.between(vector(0, 4), vector(4, 0));

            const intersection1 = line1.intersectionWith(line2);
            const intersection2 = line2.intersectionWith(line1);

            expect(intersection1).toEqual(intersection2);
        });
    });

    describe("between diagonal and horizontal lines", () => {
        test("horizontal line intersects diagonal line", () => {
            const horizontalLine = Line.horizontal(4);
            const diagonalLine = Line.between(vector(0, 0), vector(4, 8));

            const intersection = horizontalLine.intersectionWith(diagonalLine);

            expect(intersection).toEqual(vector(2, 4));
        });

        test("diagonal line intersects horizontal", () => {
            const diagonalLine = Line.between(vector(0, 8), vector(4, 0));
            const horizontalLine = Line.horizontal(4);

            const intersection = diagonalLine.intersectionWith(horizontalLine);

            expect(intersection).toEqual(vector(2, 4));
        });
    });

    describe("between diagonal and vertical lines", () => {
        test("vertical line intersects diagonal line", () => {
            const verticalLine = Line.vertical(2);
            const diagonalLine = Line.between(vector(0, 0), vector(4, 8));

            const intersection = verticalLine.intersectionWith(diagonalLine);

            expect(intersection).toEqual(vector(2, 4));
        });

        test("diagonal line intersects vertical line", () => {
            const diagonalLine = Line.between(vector(0, 8), vector(4, 0));
            const verticalLine = Line.vertical(2);

            const intersection = diagonalLine.intersectionWith(verticalLine);

            expect(intersection).toEqual(vector(2, 4));
        });
    });

    describe("between horizontal and vertical lines", () => {
        test("horizontal and vertical lines intersect at right angle", () => {
            const horizontalLine = Line.horizontal(3);
            const verticalLine = Line.vertical(5);

            const intersection = horizontalLine.intersectionWith(verticalLine);

            expect(intersection).toEqual(vector(5, 3));
        });
    });

    describe("between parallel lines", () => {
        test("cannot get intersection between parallel diagonal lines", () => {
            const line1 = Line.between(vector(0, 0), vector(2, 2));
            const line2 = Line.between(vector(3, 0), vector(4, 1));

            expect(() => line1.intersectionWith(line2))
                .toThrowError("Cannot intersect parallel lines");
        });

        test("cannot get intersection between horizontal lines", () => {
            const line1 = Line.horizontal(2);
            const line2 = Line.horizontal(3);

            expect(() => line1.intersectionWith(line2))
                .toThrowError("Cannot intersect parallel lines");
        });

        test("cannot get intersection between vertical lines", () => {
            const line1 = Line.vertical(2);
            const line2 = Line.vertical(3);

            expect(() => line1.intersectionWith(line2))
                .toThrowError("Cannot intersect parallel lines");
        });
    });
});
