import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import IndoorMapScreen from "../../app/IndoorMapScreen";
import IndoorSearch from "../../app/IndoorSearch";
import Hall8Map from "../../app/Hall8Map";
import Hall9Map from "../Hall9Map";
import { PathFinder } from "../../app/PathAlgorithmDev";

jest.mock("../../app/IndoorSearch", () => jest.fn(() => null));
jest.mock("../../app/Hall8Map", () => jest.fn(() => null));
jest.mock("../../app/Hall9Map", () => jest.fn(() => null));
jest.mock("../../app/PathAlgorithmDev", () => ({ PathFinder: jest.fn() }));

describe("IndoorMapScreen", () => {
  it("renders correctly", () => {
    const { getByText } = render(<IndoorMapScreen />);
    expect(getByText("SWITCH TO HALL 9")).toBeTruthy();
  });

  it("toggles between Hall 8 and Hall 9 maps", () => {
    const { getByText, rerender } = render(<IndoorMapScreen />);

    const toggleButton = getByText("SWITCH TO HALL 9");
    fireEvent.press(toggleButton);
    rerender(<IndoorMapScreen />);

    expect(getByText("SWITCH TO HALL 8")).toBeTruthy();
  });

  it("calls PathFinder when search is performed", async () => {
    const mockPath = ["A", "B", "C"];
    PathFinder.mockReturnValue(mockPath);

    let searchCallback;
    IndoorSearch.mockImplementation(({ onSearch }) => {
      searchCallback = onSearch;
      return null;
    });

    const { rerender } = render(<IndoorMapScreen />);

    searchCallback("A", "C", "walking");
    rerender(<IndoorMapScreen />);

    await waitFor(() => expect(PathFinder).toHaveBeenCalledWith("A", "C", "walking"));
  });

  it("does not call PathFinder if start or end node is missing", async () => {
    const { rerender } = render(<IndoorMapScreen />);
    let searchCallback;
    IndoorSearch.mockImplementation(({ onSearch }) => {
      searchCallback = onSearch;
      return null;
    });

    searchCallback(null, "C", "walking");
    rerender(<IndoorMapScreen />);

    await waitFor(() => expect(PathFinder).not.toHaveBeenCalled());
  });
});
