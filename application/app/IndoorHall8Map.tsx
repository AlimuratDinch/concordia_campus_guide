import React from "react";
import { StyleSheet } from "react-native";
import Svg, { G, Circle } from "react-native-svg";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import Hall8 from "../assets/indoorMaps/Hall-8.svg";

const MapScreen = () => {
  const scale = useSharedValue(1);
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

  // Define nodes for hallways and classrooms
  const nodes = [
    { id: "H1", type: "hallway", x: 525, y: 300 }, // Central hallway intersection
    { id: "H2", type: "hallway", x: 525, y: 50 }, // Top of main hallway
    { id: "H3", type: "hallway", x: 525, y: 550 }, // Bottom of main hallway
    { id: "H4", type: "hallway", x: 200, y: 300 }, // Left hallway intersection
    { id: "B01", type: "classroom", x: 50, y: 550 }, // Classroom B01 entrance
    { id: "B42", type: "classroom", x: 525, y: 350 }, // Classroom B42 entrance
    { id: "B80", type: "classroom", x: 400, y: 300 }, // Classroom B80 entrance (left side)
    { id: "B94", type: "classroom", x: 650, y: 300 }, // Classroom B94 entrance (right side)
  ];
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, panGesture)}>
        <Animated.View style={[styles.mapContainer, animatedStyle]}>
          <Svg viewBox="0 0 1050 600" preserveAspectRatio="xMidYMid meet">
            <G>
              <Hall8 />
              {/* Render nodes as circles */}
              {nodes.map((node) => (
                <Circle
                  key={node.id}
                  cx={node.x}
                  cy={node.y}
                  r={10} // Radius of the circle
                  fill={node.type === "hallway" ? "blue" : "green"} // Blue for hallway, green for classroom
                  stroke="black"
                  strokeWidth={2}
                />
              ))}
            </G>
          </Svg>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default MapScreen;

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
    justifyContent: "center",
    alignItems: "center",
  },
});