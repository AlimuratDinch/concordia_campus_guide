import React from "react";
import { StyleSheet, StyleProp, ViewStyle } from "react-native";
import Svg, { Polyline, G, Circle, Text as SvgText } from "react-native-svg";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import { GraphNode } from "./nodesData"; // Adjust path

interface FloorMapProps {
  floor: string;
  nodes: GraphNode[];
  path: string[];
  BackgroundSvg: React.FC; // SVG component for the floor
  style?: StyleProp<ViewStyle>;
}

export const FloorMap = ({ floor, nodes, path, BackgroundSvg, style }: FloorMapProps) => {
  const scale = useSharedValue(0.55);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

//Component to refactor
  const pinchGesture = Gesture.Pinch().onUpdate((event) => {

    scale.value = event.scale;
  });

  const getNodeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case "classroom":
        return "orange";
      case "hallway":
        return "green";
      case "bathroom":
        return "pink";
      default:
        return "blue";
    }
  };
  

  const panGesture = Gesture.Pan().onUpdate((event) => {

    translateX.value = event.translationX;
    translateY.value = event.translationY;
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  // Filter path to only include nodes on this floor
  const floorPath = path.filter((nodeId) => nodes.some((n) => n.id === nodeId && n.floor === floor));

  const drawPath = (nodeIds: string[]) => {
    if (nodeIds.length < 2) return null;

    const pathData = nodeIds
      .map((id) => {
        const node = nodes.find((n) => n.id === id);
        if (!node || node.x === undefined || node.y === undefined) return null;
        return `${node.x},${node.y}`;
      })
      .filter((point): point is string => point !== null)
      .join(" ");

    return <Polyline points={pathData} stroke="black" strokeWidth={6} fill="none" />;
  };

  return (
    <GestureHandlerRootView style={[styles.container, style]}>
      <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, panGesture)}>
        <Animated.View style={[styles.mapContainer, animatedStyle]}>
          <Svg viewBox="0 0 1050 1050" preserveAspectRatio="xMidYMid meet">
            <G>
              <BackgroundSvg />
              {drawPath(floorPath)}
              {nodes.map((node) => (
                <G key={node.id}>
                  {node.x !== undefined && node.y !== undefined && (
                    <>
                      <Circle
                        cx={node.x}
                        cy={node.y}
                        r={node.type === "hallway" ? 6 : 12}
                        fill={getNodeColor(node.type)}
                        stroke="black"
                        strokeWidth={2}
                      />
                      {node.type !== "hallway" && (
                        <SvgText
                          x={node.x}
                          y={node.y - 15}
                          fill="black"
                          fontSize={25}
                          textAnchor="middle"
                        >
                          {node.type === "stairs" ? node.type : node.id}
                        </SvgText>
                      )}
                    </>
                  )}
                </G>
              ))}
            </G>
          </Svg>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  mapContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});