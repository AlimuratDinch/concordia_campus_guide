import React from "react";
import { render } from "@testing-library/react-native";
import Hall8Map from "../../app/Hall9Map"; // adjust path as needed
import { filterNodesByFloor } from "../../app/utils"; // adjust path

// Mock the SVG component
jest.mock("../../assets/indoorMaps/Hall-9.svg", () => "Hall9Svg");

// Mock filterNodesByFloor
jest.mock("../../app/utils", () => ({
  filterNodesByFloor: jest.fn(),
}));

// Mock FloorMap with testID
jest.mock("../../app/FloorMap", () => {
  return {
    FloorMap: ({ floor, nodes, path, BackgroundSvg, style }) => {
      return (
        <mock-FloorMap
          testID="mock-FloorMap"
          floor={floor}
          nodes={nodes}
          path={path}
          BackgroundSvg={BackgroundSvg}
          style={style}
        />
      );
    },
  };
});

describe("Hall9Map", () => {
  it("renders FloorMap with correct props", () => {
    const mockNodes = [
      { id: "X", x: 100, y: 100, type: "classroom", floor: "9" },
    ];
    (filterNodesByFloor as jest.Mock).mockReturnValue(mockNodes);

    const path = ["X", "Y"];
    const style = { flex: 1 };

    const { getByTestId } = render(<Hall8Map path={path} style={style} />);

    const floorMap = getByTestId("mock-FloorMap");

    expect(filterNodesByFloor).toHaveBeenCalledWith("9");
    expect(floorMap.props.floor).toBe("9");
    expect(floorMap.props.nodes).toBe(mockNodes);
    expect(floorMap.props.path).toBe(path);
    expect(floorMap.props.BackgroundSvg).toBe("Hall9Svg");
    expect(floorMap.props.style).toBe(style);
  });
});
