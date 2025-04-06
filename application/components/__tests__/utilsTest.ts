import { filterNodesByFloor } from "../../app/utils"; // Adjust path

// Mock Rawnodes to be an empty array
jest.mock("../../app/nodesData", () => ({
  Rawnodes: [],
}));

describe("filterNodesByFloor", () => {
  it("returns an empty array when no nodes match", () => {
    const result = filterNodesByFloor("1");
    expect(result).toEqual([]);
  });
});