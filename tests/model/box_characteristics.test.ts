import {describe, expect, test} from "vitest";
import {vector} from "../../src/model/vector2D.ts";
import {Box} from "../../src/model/box";

describe("box basic characteristics", () => {
    test("boxes have position and size", () => {
        const box = new Box(4, 5, vector(2, 3));

        expect(box.position).toEqual(vector(2, 3));
        expect(box.size).toEqual(vector(4, 5));
    });

    test("boxes know their edges, center and corners", () => {
        const box = new Box(4, 5, vector(2, 3));

        expect(box.top).toEqual(3);
        expect(box.bottom).toEqual(8);
        expect(box.left).toEqual(2);
        expect(box.right).toEqual(6);

        expect(box.center).toEqual(vector(4, 5.5));

        expect(box.topLeft).toEqual(vector(box.left, box.top));
        expect(box.topCenter).toEqual(vector(box.center.x, box.top));
        expect(box.topRight).toEqual(vector(box.right, box.top));

        expect(box.bottomLeft).toEqual(vector(box.left, box.bottom));
        expect(box.bottomCenter).toEqual(vector(box.center.x, box.bottom));
        expect(box.bottomRight).toEqual(vector(box.right, box.bottom));

        expect(box.leftCenter).toEqual(vector(box.left, box.center.y));
        expect(box.rightCenter).toEqual(vector(box.right, box.center.y));
    });
});
