import {describe, expect, test} from "vitest";
import {vector} from "../../src/model/vector2D.ts";
import {Box} from "../../src/model/box";

describe("box hit detection", () => {
    describe("non-overlapping boxes", () => {
        test("returns null when boxes are completely separated horizontally", () => {
            const box1 = new Box(2, 2, vector(0, 0));
            const box2 = new Box(2, 2, vector(3, 0));

            const delta = box1.hitDelta(box2);

            expect(delta).toBeNull();
        });

        test("returns null when boxes are completely separated vertically", () => {
            const box1 = new Box(2, 2, vector(0, 0));
            const box2 = new Box(2, 2, vector(0, 3));

            const delta = box1.hitDelta(box2);

            expect(delta).toBeNull();
        });

        test("returns null when boxes are diagonally separated", () => {
            const box1 = new Box(2, 2, vector(0, 0));
            const box2 = new Box(2, 2, vector(3, 3));

            const delta = box1.hitDelta(box2);

            expect(delta).toBeNull();
        });
    });

    describe("touching boxes (edge cases)", () => {
        test("returns null when boxes are exactly touching on the right edge", () => {
            const box1 = new Box(2, 2, vector(0, 0));
            const box2 = new Box(2, 2, vector(box1.right, 0));

            const delta = box1.hitDelta(box2);

            expect(delta).toBeNull();
        });

        test("returns null when boxes are exactly touching on the bottom edge", () => {
            const box1 = new Box(2, 2, vector(0, 0));
            const box2 = new Box(2, 2, vector(0, box1.bottom));

            const delta = box1.hitDelta(box2);

            expect(delta).toBeNull();
        });

        test("returns null when boxes are exactly touching on the left edge", () => {
            const box1 = new Box(2, 2, vector(2, 0));
            const box2 = new Box(2, 2, vector(box1.left - 2, 0));

            const delta = box1.hitDelta(box2);

            expect(delta).toBeNull();
        });

        test("returns null when boxes are exactly touching on the top edge", () => {
            const box1 = new Box(2, 2, vector(0, 2));
            const box2 = new Box(2, 2, vector(0, box1.top - 2));

            const delta = box1.hitDelta(box2);

            expect(delta).toBeNull();
        });
    });

    describe("overlapping boxes with horizontal separation", () => {
        test("moves box1 left when its center is left of box2 and only overlaps horizontally", () => {
            const box1 = new Box(2, 2, vector(0, 0));
            const box2 = new Box(2, 2, vector(1, 0));

            const delta = box1.hitDelta(box2);

            expect(delta).toEqual(vector(-1, 0));
        });

        test("moves box1 left when its center is left of box2 and horizontal overlap is smaller than vertical overlap", () => {
            const box1 = new Box(4, 4, vector(0, 0));
            const box2 = new Box(4, 4, vector(3, 1));

            const delta = box1.hitDelta(box2);

            expect(delta).toEqual(vector(-1, 0));
        });

        test("moves box1 right when its center is right of box2 and only overlaps horizontally", () => {
            const box1 = new Box(2, 2, vector(1, 0));
            const box2 = new Box(2, 2, vector(0, 0));

            const delta = box1.hitDelta(box2);

            expect(delta).toEqual(vector(1, 0));
        });

        test("moves box1 right when its center is right of box2 and horizontal overlap is smaller than vertical overlap", () => {
            const box1 = new Box(4, 4, vector(3, 1));
            const box2 = new Box(4, 4, vector(0, 0));

            const delta = box1.hitDelta(box2);

            expect(delta).toEqual(vector(1, 0));
        });
    });

    describe("overlapping boxes with vertical separation", () => {
        test("moves box1 up when its center is above box2 and only overlaps vertically", () => {
            const box1 = new Box(2, 2, vector(0, 0));
            const box2 = new Box(2, 2, vector(0, 1));

            const delta = box1.hitDelta(box2);

            expect(delta).toEqual(vector(0, -1));
        });

        test("moves box1 up when its center is above box2 and vertical overlap is smaller", () => {
            const box1 = new Box(4, 4, vector(0, 0));
            const box2 = new Box(4, 4, vector(1, 3));

            const delta = box1.hitDelta(box2);

            expect(delta).toEqual(vector(0, -1));
        });

        test("moves box1 down when its center is below box2 and only overlaps vertically", () => {
            const box1 = new Box(2, 2, vector(0, 1));
            const box2 = new Box(2, 2, vector(0, 0));

            const delta = box1.hitDelta(box2);

            expect(delta).toEqual(vector(0, 1));
        });

        test("moves box1 down when its center is below box2 and vertical overlap is smaller", () => {
            const box1 = new Box(4, 4, vector(1, 3));
            const box2 = new Box(4, 4, vector(0, 0));

            const delta = box1.hitDelta(box2);

            expect(delta).toEqual(vector(0, 1));
        });
    });

    describe("completely overlapping boxes", () => {
        test("when boxes have the same size and center, it (arbitrarily) prefers moving vertically", () => {
            const largeBox = new Box(2, 2, vector(0, 0));
            const smallBox = new Box(2, 2, vector(0, 0));

            const delta = largeBox.hitDelta(smallBox);

            expect(delta).toEqual(vector(0, 2));
        });

        test("when boxes have the same center and are similar, it (arbitrarily) prefers moving vertically", () => {
            const largeBox = new Box(6, 6, vector(0, 0));
            const smallBox = new Box(2, 2, vector(2, 2));

            const delta = largeBox.hitDelta(smallBox);

            expect(delta).toEqual(vector(0, 4));
        });

        test("when boxes have the same center but are not similar, it prefers moving on the direction of that requires less movement", () => {
            const box1 = new Box(4, 6, vector(0, 0));
            const box2 = new Box(2, 2, vector(1, 2));

            const delta = box1.hitDelta(box2);

            expect(delta).toEqual(vector(3, 0));
        });
    });

    test("handles different sized boxes with asymmetric overlap", () => {
        const box1 = new Box(5, 2, vector(0, 0));
        const box2 = new Box(2, 5, vector(4, -1));

        const delta = box1.hitDelta(box2);

        expect(delta).toEqual(vector(-1, 0));
    });

    test("hitDelta is anti-commutative (results are opposite)", () => {
        const box1 = new Box(4, 5, vector(0, 0));
        const box2 = new Box(3, 4, vector(2, 1));

        const delta1 = box1.hitDelta(box2)!;
        const delta2 = box2.hitDelta(box1)!;

        expect(delta1.plus(delta2)).toEqual(vector(0, 0));
    });

    test("after moving by the corresponding delta, the boxes no longer overlap", () => {
        const box1 = new Box(4, 5, vector(0, 0));
        const box2 = new Box(3, 4, vector(2, 1));

        box1.moveBy(box1.hitDelta(box2)!);

        expect(box1.hitDelta(box2)).toBeNull();
        expect(box2.hitDelta(box1)).toBeNull();
    });
});