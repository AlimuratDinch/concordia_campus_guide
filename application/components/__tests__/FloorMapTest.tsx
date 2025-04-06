import React from "react";
import { render } from "@testing-library/react-native";
import { FloorMap } from "../../app/FloorMap"; // Adjust as needed
import { GraphNode } from "../../app/nodesData"; // Adjust as needed
import { Circle, Polyline, Text } from "react-native-svg";

// Mock react-native-reanimated with named functions to avoid JSX confusion
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.useSharedValue = function useSharedValue<T>(v: T): { value: T } {
    return { value: v };
  };
  Reanimated.useAnimatedStyle = function useAnimatedStyle(fn: () => Record<string, any>): Record<string, any> {
    return fn();
  };
  Reanimated.withTiming = function withTiming<T>(v: T): T {
    return v;
  };
  return Reanimated;
});

// Mock react-native-gesture-handler
jest.mock("react-native-gesture-handler", () => {
  const View = require("react-native").View;
  return {
    GestureHandlerRootView: View,
    GestureDetector: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
    Gesture: {
      Pinch: () => ({ onUpdate: () => ({}) }),
      Pan: () => ({ onUpdate: () => ({}) }),
      Simultaneous: jest.fn(),
    },
  };
});

const DummyBackground = () => <></>;

const mockNodes: GraphNode[] = [
  { id: "A", x: 100, y: 100, type: "classroom", floor: "1" },
  { id: "B", x: 200, y: 200, type: "hallway", floor: "1" },
  { id: "C", x: 300, y: 300, type: "Bathroom", floor: "2" },
  { id: "D", x: 400, y: 400, type: "stairs", floor: "1" },
];

describe("FloorMap", () => {
  it("renders correctly with nodes and path on the same floor", () => {
    const { UNSAFE_getAllByType } = render(
      <FloorMap
        floor="1"
        nodes={mockNodes}
        path={["A", "B", "D"]}
        BackgroundSvg={DummyBackground}
      />
    );

    const circles = UNSAFE_getAllByType(Circle);
    const texts = UNSAFE_getAllByType(Text);
    const polylines = UNSAFE_getAllByType(Polyline);

    expect(circles.length).toBeGreaterThan(0);
    expect(texts.length).toBeGreaterThan(0);
    expect(polylines.length).toBe(1); // Should pass with a valid path
  });

  it("does not draw a path if fewer than 2 valid nodes on the floor", () => {
    const { UNSAFE_queryAllByType } = render(
      <FloorMap
        floor="2"
        nodes={mockNodes}
        path={["A", "B", "C", "D"]}
        BackgroundSvg={DummyBackground}
      />
    );

    const polylines = UNSAFE_queryAllByType(Polyline);
    expect(polylines.length).toBe(0); // No path drawn for floor "2" with only one valid node
  });
});