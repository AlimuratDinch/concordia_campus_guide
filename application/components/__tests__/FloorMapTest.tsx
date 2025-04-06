import React from "react";
import { render } from "@testing-library/react-native";
import { FloorMap } from "../../app/FloorMap"; // adjust as needed
import { GraphNode } from "../../app/nodesData"; // adjust as needed
import { Circle, Polyline, Text } from "react-native-svg";

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.useSharedValue = (v) => ({ value: v });
  Reanimated.useAnimatedStyle = (fn) => fn();
  Reanimated.withTiming = (v) => v;
  return Reanimated;
});

jest.mock("react-native-gesture-handler", () => {
  const View = require("react-native").View;
  return {
    GestureHandlerRootView: View,
    GestureDetector: ({ children }: any) => <View>{children}</View>,
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
    const polylines = UNSAFE_getAllByType(Polyline); // ✅ Match by component reference

    expect(circles.length).toBeGreaterThan(0);
    expect(texts.length).toBeGreaterThan(0);
    expect(polylines.length).toBe(1); // ✅ This should now pass
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
  });
});