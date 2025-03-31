import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import IndoorSearch, { GraphNode } from "../../app/IndoorSearch";

describe("IndoorSearch Component", () => {
  const mockOnSearch = jest.fn();
  const mockNodes: GraphNode[] = [
    { id: "801", type: "classroom", floor: "8", adjacent: ["802"] },
    { id: "802", type: "classroom", floor: "8", adjacent: ["801"] },
    { id: "901", type: "classroom", floor: "9", adjacent: ["902"] },
    { id: "902", type: "classroom", floor: "9", adjacent: ["901"] },
  ];

  it("renders correctly", () => {
    const { getByText } = render(<IndoorSearch nodes={mockNodes} onSearch={mockOnSearch} />);
    expect(getByText("Start Floor:")).toBeTruthy();
    expect(getByText("End Floor:")).toBeTruthy();
    expect(getByText("Start Location:")).toBeTruthy();
    expect(getByText("End Location:")).toBeTruthy();
    expect(getByText("Travel Type:")).toBeTruthy();
    expect(getByText("Search")).toBeTruthy();
  });

  it("calls onSearch with selected values when Search is pressed", () => {
    const { getByText, getByTestId } = render(<IndoorSearch nodes={mockNodes} onSearch={mockOnSearch} />);

    // Simulate selecting values (replace getByTestId if needed)
    fireEvent.changeText(getByTestId("picker-start-floor"), "8");
    fireEvent.changeText(getByTestId("picker-end-floor"), "9");
    fireEvent.changeText(getByTestId("picker-start-node"), "801");
    fireEvent.changeText(getByTestId("picker-end-node"), "902");
    fireEvent.press(getByText("Search"));

    expect(mockOnSearch).toHaveBeenCalledWith("801", "902", "standard");
  });
});
