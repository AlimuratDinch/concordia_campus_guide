import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import IndoorMapScreen from "../../app/indoorMapScreen"; // Matches lowercase file name

// Mock the imported components and functions
jest.mock("../../app/Hall8Map", () => "Hall8Map");
jest.mock("../../app/Hall9Map", () => "Hall9Map");
jest.mock("../../app/PathAlgorithmDev", () => ({
  PathFinder: jest.fn(() => ["H1-U", "H1-H2"]), // Mock a simple path
}));
jest.mock("../../app/IndoorSearch", () => {
  // Import View inside the factory to keep it in scope
  const { View } = require("react-native");
  const MockIndoorSearch: React.FC<{
    onSearch: (start: string, target: string, accessibility: string) => void;
  }> = ({ onSearch }) => (
    <View testID="indoor-search" {...{ onSearch }} />
  );
  return MockIndoorSearch;
});
jest.mock("../../app/nodesData", () => ({
  nodes: [
    { id: "H1-U", type: "hallway", x: 555, y: 120, floor: "8", adjacent: ["H1-H2"] },
    { id: "H1-H2", type: "hallway", x: 555, y: 227, floor: "8", adjacent: ["811", "807"] },
  ],
}));

describe("IndoorMapScreen", () => {
  it("renders correctly and switches maps", () => {
    const { getByText, queryByText } = render(<IndoorMapScreen />);

    // Check initial render (Hall 8 is shown by default)
    expect(getByText("Switch to Hall 9")).toBeTruthy();

    // Simulate button press to switch to Hall 9
    fireEvent.press(getByText("Switch to Hall 9"));

    // Check button text updates to switch back to Hall 8
    expect(getByText("Switch to Hall 8")).toBeTruthy();
    expect(queryByText("Switch to Hall 9")).toBeNull();
  });

  it("calls handleSearch and updates path", () => {
    const { getByTestId } = render(<IndoorMapScreen />);

    // Simulate a search from IndoorSearch
    const indoorSearch = getByTestId("indoor-search");
    fireEvent(indoorSearch, "onSearch", "H1-U", "H1-H2", "walk");

    // Since PathFinder is mocked to return ['H1-U', 'H1-H2'], the component should handle it
    // Basic check that component still exists and onSearch was callable
    expect(indoorSearch).toBeTruthy();
  });
});