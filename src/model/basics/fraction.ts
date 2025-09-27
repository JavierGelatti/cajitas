import type {Brand} from "./branded_types.ts";

export type Fraction = number & Brand<"fraction">;

export function assertIsFraction(value: number): asserts value is Fraction {
    if (value < 0 || value > 1) throw new Error("Fraction must be between 0 and 1");
}
