import React from "react";
import { render } from "@testing-library/react-native";
import { filterNodesByFloor } from "../../app/utils";
import { StyleProp, ViewStyle } from "react-native";
import { GraphNode } from "../../app/nodesData";

// Mocks
jest.mock("../../app/utils", () => ({
  filterNodesByFloor: jest.fn(),
}));

// Mock FloorMap with testID
interface MockFloorMapProps {
  floor: string;
  nodes: GraphNode[];
  path: string[];
  BackgroundSvg: React.FC;
  style?: StyleProp<ViewStyle>;
}

jest.mock("../../app/FloorMap", () => {
  const { View } = require("react-native");
  return {
    FloorMap: ({ floor, nodes, path, BackgroundSvg, style }: MockFloorMapProps) => (
      <View
        testID="mock-FloorMap"
        {...{ floor, nodes, path, BackgroundSvg, style }}
      />
    ),
  };
});

// Reusable test suite
function testHallMapComponent({
  Component,
  floor,
  svgMockPath,
  svgMockName,
  componentName,
}: {
  Component: React.FC<{ path: string[]; style?: StyleProp<ViewStyle> }>;
  floor: string;
  svgMockPath: string;
  svgMockName: string;
  componentName: string;
}) {
  jest.mock(svgMockPath, () => svgMockName);

  describe(`${componentName}`, () => {
    it("renders FloorMap with correct props", () => {
      const mockNodes = [{ id: "X", x: 100, y: 100, type: "classroom", floor }];
      (filterNodesByFloor as jest.Mock).mockReturnValue(mockNodes);

      const path = ["X", "Y"];
      const style = { flex: 1 };

      const { getByTestId } = render(<Component path={path} style={style} />);
      const floorMap = getByTestId("mock-FloorMap");

      expect(filterNodesByFloor).toHaveBeenCalledWith(floor);
      expect(floorMap.props.floor).toBe(floor);
      expect(floorMap.props.nodes).toBe(mockNodes);
      expect(floorMap.props.path).toBe(path);
      expect(floorMap.props.BackgroundSvg).toBe(svgMockName);
      expect(floorMap.props.style).toBe(style);
    });
  });
}

// Run tests
testHallMapComponent({
  Component: require("../../app/Hall8Map").default,
  floor: "8",
  svgMockPath: "../../assets/indoorMaps/Hall-8.svg",
  svgMockName: "Hall8Svg",
  componentName: "Hall8Map",
});

testHallMapComponent({
  Component: require("../../app/Hall9Map").default,
  floor: "9",
  svgMockPath: "../../assets/indoorMaps/Hall-9.svg",
  svgMockName: "Hall9Svg",
  componentName: "Hall9Map",
});
