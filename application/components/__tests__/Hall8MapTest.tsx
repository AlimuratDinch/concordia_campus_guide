import React from "react";
import { render } from "@testing-library/react-native";
import Hall8Map from "../../app/Hall8Map"; // Adjust path as needed
import { filterNodesByFloor } from "../../app/utils"; // Adjust path
import { StyleProp, ViewStyle } from "react-native";
import { GraphNode } from "../../app/nodesData"; // Import GraphNode type

// Mock the SVG component
jest.mock("../../assets/indoorMaps/Hall-8.svg", () => "Hall8Svg");

// Mock filterNodesByFloor
jest.mock("../../app/utils", () => ({
  filterNodesByFloor: jest.fn(),
}));

// Define props interface for the mocked FloorMap
interface MockFloorMapProps {
  floor: string;
  nodes: GraphNode[];
  path: string[];
  BackgroundSvg: React.FC;
  style?: StyleProp<ViewStyle>;
}

// Mock FloorMap with testID, importing View inside the factory
jest.mock("../../app/FloorMap", () => {
  const { View } = require("react-native");
  return {
    FloorMap: ({ floor, nodes, path, BackgroundSvg, style }: MockFloorMapProps) => {
      return (
        <View
          testID="mock-FloorMap"
          {...{ floor, nodes, path, BackgroundSvg, style }}
        />
      );
    },
  };
});

describe("Hall8Map", () => {
  it("renders FloorMap with correct props", () => {
    const mockNodes = [
      { id: "X", x: 100, y: 100, type: "classroom", floor: "8" },
    ];
    (filterNodesByFloor as jest.Mock).mockReturnValue(mockNodes);

    const path = ["X", "Y"];
    const style = { flex: 1 };

    const { getByTestId } = render(<Hall8Map path={path} style={style} />);

    const floorMap = getByTestId("mock-FloorMap");

    expect(filterNodesByFloor).toHaveBeenCalledWith("8");
    expect(floorMap.props.floor).toBe("8");
    expect(floorMap.props.nodes).toBe(mockNodes);
    expect(floorMap.props.path).toBe(path);
    expect(floorMap.props.BackgroundSvg).toBe("Hall8Svg");
    expect(floorMap.props.style).toBe(style);
  });
});