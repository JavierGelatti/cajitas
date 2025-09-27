import {describe, expect, test} from "vitest";
import {point} from "../../src/model/position";
import {Box} from "../../src/model/box";

describe("box basic characteristics", () => {
    test("boxes have position and size", () => {
        const box = new Box(4, 5, point(2, 3));

        expect(box.position).toEqual(point(2, 3));
        expect(box.size).toEqual(point(4, 5));
    });

    test("boxes know their edges, center and corners", () => {
        const box = new Box(4, 5, point(2, 3));

        expect(box.top).toEqual(3);
        expect(box.bottom).toEqual(8);
        expect(box.left).toEqual(2);
        expect(box.right).toEqual(6);

        expect(box.center).toEqual(point(4, 5.5));

        expect(box.topLeft).toEqual(point(box.left, box.top));
        expect(box.topCenter).toEqual(point(box.center.x, box.top));
        expect(box.topRight).toEqual(point(box.right, box.top));

        expect(box.bottomLeft).toEqual(point(box.left, box.bottom));
        expect(box.bottomCenter).toEqual(point(box.center.x, box.bottom));
        expect(box.bottomRight).toEqual(point(box.right, box.bottom));

        expect(box.leftCenter).toEqual(point(box.left, box.center.y));
        expect(box.rightCenter).toEqual(point(box.right, box.center.y));
    });
});
