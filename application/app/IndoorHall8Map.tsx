import React from "react";
import { StyleSheet } from "react-native";
import Svg, { G, Circle, Text as SvgText } from "react-native-svg";
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

  // Updated nodes with correct 8th floor IDs and labels
  const nodes = [
    { id: "H1-H2", type: "hallway", x: 555, y: 227 }, // Central hallway intersection 1 with H2
    { id: "H1-U", type: "hallway", x: 555, y: 120  }, // Upper main hallway
    { id: "H1-M", type: "hallway", x: 555, y: 500 }, // Middle main hallway
    { id: "H1-I2", type: "hallway", x: 555, y: 800 }, // Bottom main hallway intersection 2
    { id: "H2-LC", type: "hallway", x: 185, y: 227 }, // Halway 2 Left Corner
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
          <Svg viewBox="0 0 1050 600" preserveAspectRatio="xMidYMid meet">
            <G>
              <Hall8 />
              {/* Render nodes as circles with labels */}
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
                    x={node.x} // Center the text on the node's x-coordinate
                    y={node.y - 15} // Position above the circle (circle radius is 10, so -15 moves it just above)
                    fill="black"
                    fontSize={25}
                    textAnchor="middle" // Center the text horizontally
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