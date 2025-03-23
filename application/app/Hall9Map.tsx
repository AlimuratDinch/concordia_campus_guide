import React from "react";
import { StyleSheet } from "react-native";
import Svg, { G, Circle, Text as SvgText } from "react-native-svg";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import Hall9 from "../assets/indoorMaps/Hall-9.svg";

const Hall9Map = () => {
  const scale = useSharedValue(1); // Starts at 1, ensuring no initial zoom
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch().onUpdate((event) => {
    scale.value = event.scale;
  });

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

  const nodes = [
    { id: "9-MAIN", type: "hallway", x: 525, y: 300 },
    { id: "9-NORTH", type: "hallway", x: 525, y: 150 },
    { id: "9-SOUTH", type: "hallway", x: 525, y: 450 },
    { id: "901", type: "classroom", x: 300, y: 200 },
    { id: "902", type: "classroom", x: 300, y: 300 },
    { id: "903", type: "classroom", x: 300, y: 400 },
    { id: "904", type: "classroom", x: 750, y: 200 },
    { id: "905", type: "classroom", x: 750, y: 300 },
  ];

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, panGesture)}>
        <Animated.View style={[styles.mapContainer, animatedStyle]}>
          <Svg viewBox="0 0 1050 1050" preserveAspectRatio="xMidYMid meet">
            <G>
              <Hall9 />
              {nodes.map((node) => (
                <G key={node.id}>
                  <Circle
                    cx={node.x}
                    cy={node.y}
                    r={12}
                    fill={node.type === "hallway" ? "blue" : "green"}
                    stroke="black"
                    strokeWidth={2}
                  />
                  <SvgText
                    x={node.x}
                    y={node.y - 15}
                    fill="black"
                    fontSize={25}
                    textAnchor="middle"
                  >
                    {node.id}
                  </SvgText>
                </G>
              ))}
            </G>
          </Svg>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default Hall9Map;

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