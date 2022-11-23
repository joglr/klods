import { calculateLocationFromIndex } from "../util"

describe("calculateLocationFromIndex", () => {
  it("calculates the correct location for index 0", () => {
    const result = calculateLocationFromIndex(0, 8)
    expect(result).toEqual([0, 0])
  })

  it("calculates the correct location for index 63", () => {
    const result = calculateLocationFromIndex(63, 8)
    expect(result).toEqual([7, 7])
  })
})
