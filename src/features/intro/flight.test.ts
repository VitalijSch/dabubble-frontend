import { describe, expect, it } from "vitest";

import { flightTransform } from "./flight";

describe("flightTransform", () => {
  it("moves the centre of one box onto the other and scales by width", () => {
    const from = { left: 0, top: 0, width: 200, height: 100 };
    const to = { left: 10, top: 20, width: 50, height: 25 };

    expect(flightTransform(from, to)).toBe("translate(-65px, -17.5px) scale(0.25)");
  });

  it("is a no-op for identical boxes", () => {
    const box = { left: 75, top: 75, width: 70, height: 70 };

    expect(flightTransform(box, box)).toBe("translate(0px, 0px) scale(1)");
  });
});
