import { buildGraph, filteredGraph, PathFinder } from "../../app/PathAlgorithmDev";

describe("Graph Utilities", () => {
  const sampleNodes = [
    { id: "A", type: "hallway", adjacent: ["B", "C"] },
    { id: "B", type: "classroom", adjacent: ["A", "D"] },
    { id: "C", type: "stairs", adjacent: ["A", "D"] },
    { id: "D", type: "escalators", adjacent: ["B", "C"] },
  ];

  test("buildGraph should create a correct graph structure", () => {
    const graph = buildGraph(sampleNodes);
    expect(graph).toEqual({
      A: { type: "hallway", adjacent: ["B", "C"] },
      B: { type: "classroom", adjacent: ["A", "D"] },
      C: { type: "stairs", adjacent: ["A", "D"] },
      D: { type: "escalators", adjacent: ["B", "C"] },
    });
  });

  test("filteredGraph should correctly filter based on accessibility", () => {
    const graph = buildGraph(sampleNodes);
    const standardGraph = filteredGraph(graph, "standard");
    const accessibleGraph = filteredGraph(graph, "accessible");

    expect(standardGraph).toEqual({
      A: { type: "hallway", adjacent: ["B", "C"] },
      B: { type: "classroom", adjacent: ["A", "D"] },
      C: { type: "stairs", adjacent: ["A"] },
      D: { type: "escalators", adjacent: ["B"] },
    });

    expect(accessibleGraph).toEqual({
      A: { type: "hallway", adjacent: ["B"] },
      B: { type: "classroom", adjacent: ["A"] },
      C: { type: "stairs", adjacent: [] },
      D: { type: "escalators", adjacent: [] },
    });
  });

  test("PathFinder should find the correct path", () => {
    const path = PathFinder("A", "D", "standard");
    expect(path).toEqual(["A", "B", "D"]);
  });

  test("PathFinder should return null for unreachable nodes", () => {
    const path = PathFinder("A", "X", "standard");
    expect(path).toBeNull();
  });
});
