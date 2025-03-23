import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Svg, { G, Circle, Text as SvgText } from "react-native-svg";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import Hall8 from "../assets/indoorMaps/Hall-8.svg";

const Hall8Map = () => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedScale = useSharedValue(1); 

  // Reset scale on mount
  useEffect(() => {
    scale.value = 1;
    savedScale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
  }, []);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      // Multiply the current scale by the event scale to get the new cumulative scale
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      // Save the final scale value after the pinch ends
      savedScale.value = scale.value;
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
    { id: "H1-H2", type: "hallway", x: 555, y: 227 },
    { id: "H1-U", type: "hallway", x: 555, y: 120 },
    { id: "H1-M", type: "hallway", x: 555, y: 500 },
    { id: "H1-I2", type: "hallway", x: 555, y: 800 },
    { id: "H2-LC", type: "hallway", x: 185, y: 227 },
    { id: "H2-ML", type: "hallway", x: 380, y: 227 },
    { id: "H2-MR", type: "hallway", x: 710, y: 227 },
    { id: "H2-CR", type: "hallway", x: 835, y: 227 },
    { id: "806-01", type: "classroom", x: 490, y: 280 },
    { id: "806-02", type: "classroom", x: 490, y: 318 },
    { id: "806-03", type: "classroom", x: 490, y: 355 },
    { id: "801", type: "classroom", x: 190, y: 170 },
    { id: "803", type: "classroom", x: 290, y: 170 },
    { id: "807", type: "classroom", x: 470, y: 170 },
    { id: "811", type: "classroom", x: 640, y: 170 },
    { id: "813", type: "classroom", x: 740, y: 170 },
    { id: "815", type: "classroom", x: 835, y: 170 },
    { id: "817", type: "classroom", x: 890, y: 170 },
    { id: "857", type: "classroom", x: 150, y: 550 },
  ];

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, panGesture)}>
        <Animated.View style={[styles.mapContainer, animatedStyle]}>
          <Svg viewBox="0 0 1050 1050" preserveAspectRatio="xMidYMid meet">
            <G>
              <Hall8 />
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

export default Hall8Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  mapContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
});