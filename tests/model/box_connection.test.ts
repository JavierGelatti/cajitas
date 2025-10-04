import {describe, expect, test} from "vitest";
import {vector} from "../../src/model/vector2D.ts";
import {Box} from "../../src/model/box";
import {Anchor} from "../../src/model/anchor";
import {CHANGE_EVENT_NAME, ChangeEvent} from "../../src/model/events/changeEvent";

describe("box connections", () => {
    describe("updating", () => {
        test("the connector position is updated whenever the target box position changes", () => {
            const sourceBox = new Box(2, 2, vector(6, 4));
            const targetBox = new Box(4, 2, vector(5, 1));
            const connector = sourceBox.straightConnectorTo(targetBox, Anchor.nearest(), Anchor.nearest());

            targetBox.moveTo(vector(9, 4));

            expect(connector.startPoint).toEqual(sourceBox.rightCenter);
            expect(connector.endPoint).toEqual(targetBox.leftCenter);
        });

        test("a change event is fired when the target box moves", () => {
            const sourceBox = new Box(2, 2, vector(6, 4));
            const targetBox = new Box(4, 2, vector(5, 1));
            const connector = sourceBox.straightConnectorTo(targetBox, Anchor.nearest(), Anchor.nearest());
            let receivedEvent: ChangeEvent | undefined;
            connector.addEventListener("change", event => receivedEvent = event);

            targetBox.moveTo(vector(9, 4));

            expect(receivedEvent).not.toBeUndefined();
            expect(receivedEvent!.type).toEqual(CHANGE_EVENT_NAME);
            expect(receivedEvent!.target).toEqual(connector);
            expect(receivedEvent!.bubbles).toEqual(false);
        });

        test("the connector position is updated whenever the source box position changes", () => {
            const sourceBox = new Box(2, 2, vector(0, 0));
            const targetBox = new Box(4, 2, vector(9, 4));
            const connector = sourceBox.straightConnectorTo(targetBox, Anchor.nearest(), Anchor.nearest());

            sourceBox.moveTo(vector(6, 4));

            expect(connector.startPoint).toEqual(sourceBox.rightCenter);
            expect(connector.endPoint).toEqual(targetBox.leftCenter);
        });

        test("a change event is fired when the source box moves", () => {
            const sourceBox = new Box(2, 2, vector(0, 0));
            const targetBox = new Box(4, 2, vector(6, 4));
            const connector = sourceBox.straightConnectorTo(targetBox, Anchor.nearest(), Anchor.nearest());
            let receivedEvent: ChangeEvent | undefined;
            connector.addEventListener("change", event => receivedEvent = event);

            sourceBox.moveTo(vector(6, 4));

            expect(receivedEvent).not.toBeUndefined();
            expect(receivedEvent!.type).toEqual(CHANGE_EVENT_NAME);
            expect(receivedEvent!.target).toEqual(connector);
            expect(receivedEvent!.bubbles).toEqual(false);
        });
    });

    describe("straight line to nearest point", () => {
        test("when the boxes are vertically aligned", () => {
            const sourceBox = new Box(2, 2, vector(6, 4));
            const targetBox = new Box(4, 2, vector(5, 1));

            const connector = sourceBox.straightConnectorTo(targetBox, Anchor.nearest(), Anchor.nearest());

            expect(connector.startPoint).toEqual(sourceBox.topCenter);
            expect(connector.endPoint).toEqual(targetBox.bottomCenter);
        });

        test("when the boxes are horizontally aligned", () => {
            const sourceBox = new Box(2, 2, vector(6, 4));
            const targetBox = new Box(4, 2, vector(9, 4));

            const connector = sourceBox.straightConnectorTo(targetBox, Anchor.nearest(), Anchor.nearest());

            expect(connector.startPoint).toEqual(sourceBox.rightCenter);
            expect(connector.endPoint).toEqual(targetBox.leftCenter);
        });

        test("when the line hits exactly to the top-left or bottom-right corners of the boxes", () => {
            const sourceBox = new Box(4, 2, vector(4, 4));
            const targetBox = new Box(4, 2, vector(10, 7));

            const connector = sourceBox.straightConnectorTo(targetBox, Anchor.nearest(), Anchor.nearest());

            expect(connector.startPoint).toEqual(sourceBox.bottomRight);
            expect(connector.endPoint).toEqual(targetBox.topLeft);
        });

        test("when the line hits exactly to the bottom-left or top-right corners of the boxes", () => {
            const sourceBox = new Box(4, 2, vector(4, 4));
            const targetBox = new Box(4, 2, vector(10, 1));

            const connector = sourceBox.straightConnectorTo(targetBox, Anchor.nearest(), Anchor.nearest());

            expect(connector.startPoint).toEqual(sourceBox.topRight);
            expect(connector.endPoint).toEqual(targetBox.bottomLeft);
        });

        test("connects both boxes when the heading sides are not aligned", () => {
            const box1 = new Box(4, 5, vector(2, 1));
            const box2 = new Box(3, 2, vector(7, 7));

            const connector = box1.straightConnectorTo(box2, Anchor.nearest(), Anchor.nearest());

            expect(connector.startPoint).toEqual(vector(6, 5.5));
            expect(connector.endPoint).toEqual(vector(7.5, 7));
        });
    });

    describe("straight line to specific edge point", () => {
        test("when the boxes are vertically aligned", () => {
            const sourceBox = new Box(2, 2, vector(6, 4));
            const targetBox = new Box(4, 2, vector(5, 1));

            const connector = sourceBox.straightConnectorTo(
                targetBox,
                sourceBox.topEdgeAnchorAtFraction(0),
                targetBox.bottomEdgeAnchorAtFraction(1 / 2),
            );

            expect(connector.startPoint).toEqual(sourceBox.topLeft);
            expect(connector.endPoint).toEqual(targetBox.bottomCenter);
        });

        test("when the boxes are horizontally aligned", () => {
            const sourceBox = new Box(2, 2, vector(6, 4));
            const targetBox = new Box(4, 2, vector(9, 4));

            const connector = sourceBox.straightConnectorTo(
                targetBox,
                sourceBox.rightEdgeAnchorAtFraction(1 / 2),
                targetBox.leftEdgeAnchorAtFraction(1),
            );

            expect(connector.startPoint).toEqual(sourceBox.rightCenter);
            expect(connector.endPoint).toEqual(targetBox.topLeft);
        });

        test("cannot create anchors if fraction is not between 0 and 1", () => {
            const aBox = new Box(2, 2, vector(1, 1));

            expect(() => {
                aBox.topEdgeAnchorAtFraction(-0.01);
            }).toThrowError("Fraction must be between 0 and 1");
            expect(() => {
                aBox.topEdgeAnchorAtFraction(1.01);
            }).toThrowError("Fraction must be between 0 and 1");
        });

    });

    describe("straight line to nearest anchor point", () => {
        test("connects both boxes rounding to the nearest anchor point", () => {
            const box1 = new Box(4, 5, vector(2, 1));
            const box2 = new Box(3, 2, vector(7, 7));

            const connector = box1.straightConnectorTo(
                box2,
                Anchor.nearestFrom([
                    box1.rightEdgeAnchorAtFraction(4 / 5),
                    box1.rightEdgeAnchorAtFraction(1 / 5),
                ]),
                Anchor.nearestFrom([
                    box2.leftEdgeAnchorAtFraction(1 / 2),
                    box2.topEdgeAnchorAtFraction(1 / 3),
                    box2.topEdgeAnchorAtFraction(2 / 3),
                ]),
            );

            expect(connector.startPoint).toEqual(vector(6, 5));
            expect(connector.endPoint).toEqual(vector(8, 7));
        });
    });
});
