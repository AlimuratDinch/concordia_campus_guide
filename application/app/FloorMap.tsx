import React from "react";
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import Svg, { Polyline, G, Text as SvgText } from "react-native-svg";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { GraphNode } from "./nodesData";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

import Icon from "react-native-vector-icons/MaterialIcons";

interface FloorMapProps {
  floor: string;
  nodes: GraphNode[];
  path: string[];
  BackgroundSvg: React.FC;
  style?: StyleProp<ViewStyle>;
}

export const FloorMap = ({
  floor,
  nodes,
  path,
  BackgroundSvg,
  style,
}: FloorMapProps) => {
  const scale = useSharedValue(1); // Initial zoom scale
  const translateX = useSharedValue(0); // Translation in X
  const translateY = useSharedValue(0); // Translation in Y

  // Pinch gesture to control zooming
  const pinchGesture = Gesture.Pinch().onUpdate((event) => {
    scale.value = withSpring(event.scale); // Smooth zoom
  });

  // Pan gesture to move the map around
  const panGesture = Gesture.Pan().onUpdate((event) => {
    translateX.value = withSpring(event.translationX);
    translateY.value = withSpring(event.translationY);
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value }, // Zooming the map
      { translateX: translateX.value }, // Moving map horizontally
      { translateY: translateY.value }, // Moving map vertically
    ],
  }));

  const floorPath = path.filter((nodeId) =>
    nodes.some((n) => n.id === nodeId && n.floor === floor)
  );

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

  const getIconGlyph = (type: string) => {
    const map: { [key: string]: string } = {
      classroom: "▫️",
      hallway: "",
      Bathroom: "🚻",
      stairs: "🪜",
      elevators: "🛗",
      escalators: "📶",
      default: "."
    };
    return map[type] || map.default;
  };

  return (
    <GestureHandlerRootView style={[styles.container, style]}>
      <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, panGesture)}>
        <Animated.View style={[styles.mapContainer, animatedStyle]}>
          <AnimatedSvg
            viewBox="0 0 1050 1050"
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", height: "100%" }}
          >
            <G>
              <BackgroundSvg />
              {drawPath(floorPath)}
              {nodes.map((node) => {
                if (
                  node.x === undefined ||
                  node.y === undefined ||
                  node.floor !== floor
                )
                  return null;

                return (
                  <G key={node.id}>
                    <SvgText
                      x={node.x}
                      y={node.y}
                      fontSize={40}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                    >
                      {getIconGlyph(node.type)}
                    </SvgText>
                    {node.type !== "hallway" && (
                      <SvgText
                        x={node.x}
                        y={node.y + 40}
                        fontSize={20}
                        fill="black"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        {node.type === "stairs" ? "stairs" : node.id}
                      </SvgText>
                    )}
                  </G>
                );
              })}
            </G>
          </AnimatedSvg>
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
    width: "100%",
    height: "100%",
  },
});
