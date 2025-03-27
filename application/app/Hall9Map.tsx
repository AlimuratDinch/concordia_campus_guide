import React from "react";
import { StyleSheet } from "react-native";
import Svg, { G, Circle, Text as SvgText } from "react-native-svg";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import Hall9 from "../assets/indoorMaps/Hall-9.svg";

const Hall9Map = () => {
  const scale = useSharedValue(0.6); // Starts at 1, ensuring no initial zoom
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
    
     { id: "Bathroom-F", type: "Bathroom", x: 350, y: 265 },
     { id: "Bathroom-M", type: "Bathroom", x: 650, y: 265 },

     { id: "967", type: "classroom", x: 70, y: 170 },
     { id: "965", type: "classroom", x: 70, y: 350 },
     { id: "963", type: "classroom", x: 70, y: 450 },
     { id: "903", type: "classroom", x: 200, y: 135 },
     { id: "907", type: "classroom", x: 375, y: 135 },
     { id: "909", type: "classroom", x: 550, y: 135 },
     { id: "911", type: "classroom", x: 650, y: 135 },
     { id: "913", type: "classroom", x: 725, y: 135 },
     { id: "915", type: "classroom", x: 825, y: 135 },
     { id: "917", type: "classroom", x: 930, y: 135 },
     { id: "908", type: "classroom", x: 485, y: 350 },
     { id: "980", type: "classroom", x: 570, y: 390 },
     { id: "992", type: "classroom", x: 425, y: 360 },
     { id: "919", type: "classroom", x: 930, y: 235 },
     { id: "921", type: "classroom", x: 930, y: 345 },
     { id: "923", type: "classroom", x: 930, y: 450 },
     { id: "990", type: "classroom", x: 720, y: 350 },
     { id: "986", type: "classroom", x: 775, y: 350 },
     { id: "920", type: "classroom", x: 700, y: 470 },
     { id: "925", type: "classroom", x: 930, y: 565 },
     { id: "927", type: "classroom", x: 930, y: 700 },
     { id: "929", type: "classroom", x: 930, y: 850 },
     { id: "933", type: "classroom", x: 750, y: 900 },
     { id: "932", type: "classroom", x: 740, y: 810 },
     { id: "928", type: "classroom", x: 790, y: 810 },
     { id: "985", type: "classroom", x: 715, y: 740 },
     { id: "937", type: "classroom", x: 560, y: 810 },
     { id: "906", type: "classroom", x: 485, y: 260 },

     { id: "961-1", type: "classroom", x: 35, y: 520 },
     { id: "961-3", type: "classroom", x: 35, y: 580 },
     { id: "961-7", type: "classroom", x: 35, y: 650 },
     { id: "961-9", type: "classroom", x: 35, y: 700 },
     { id: "961-11", type: "classroom", x: 35, y: 735 },
     { id: "961-13", type: "classroom", x: 35, y: 780 },
     { id: "961-15", type: "classroom", x: 35, y: 830 },
     { id: "961-17", type: "classroom", x: 35, y: 875 },
     { id: "961-19", type: "classroom", x: 35, y: 950 },

     { id: "961-2", type: "classroom", x: 120, y: 520 },
     { id: "961-4", type: "classroom", x: 120, y: 550 },
     { id: "961-5", type: "classroom", x: 120, y: 600 },
     { id: "961-97", type: "classroom", x: 120, y: 640 },

     { id: "961-10", type: "classroom", x: 120, y: 700 },
     { id: "961-12", type: "classroom", x: 120, y: 730 },
     { id: "961-14", type: "classroom", x: 120, y: 780 },
     { id: "961-26", type: "classroom", x: 120, y: 860 },

     { id: "961-21", type: "classroom", x: 80, y: 950 },
     { id: "961-23", type: "classroom", x: 125, y: 950 },
     { id: "961-25", type: "classroom", x: 170, y: 950 },
     { id: "961-27", type: "classroom", x: 215, y: 950 },
     { id: "961-29", type: "classroom", x: 260, y: 950 },
     { id: "961-31", type: "classroom", x: 305, y: 950 },
     { id: "961-33", type: "classroom", x: 350, y: 950 },

     { id: "941", type: "classroom", x: 420, y: 950 },
     { id: "960", type: "classroom", x: 440, y: 470 },
     { id: "962", type: "classroom", x: 370, y: 470 },
     { id: "964", type: "classroom", x: 270, y: 470 },

     { id: "968", type: "classroom", x: 230, y: 610 },
     { id: "966", type: "classroom", x: 370, y: 610 },

     { id: "975", type: "classroom", x: 300, y: 730 },
     { id: "981", type: "classroom", x: 360, y: 760 },
     { id: "945", type: "classroom", x: 300, y: 800 },
     { id: "943", type: "classroom", x: 330, y: 860 },

      { id: "stairs", type: "stairs", x: 260, y: 350 },
      { id: "elevators", type: "elevators", x: 350, y: 350 },
       { id: "escalators", type: "escalators", x: 480, y: 550 },


        { id: "1", type: "hallway", x: 260, y: 400, adjacent: [] },
        { id: "2", type: "hallway", x: 350, y: 400, adjacent: [] },
        { id: "3", type: "hallway", x: 425, y: 400, adjacent: [] },
        { id: "4", type: "hallway", x: 520, y: 400, adjacent: [] },
        { id: "5", type: "hallway", x: 520, y: 470, adjacent: [] },
        { id: "6", type: "hallway", x: 520, y: 550, adjacent: [] },
        { id: "7", type: "hallway", x: 520, y: 640, adjacent: [] },
        { id: "8", type: "hallway", x: 520, y: 640, adjacent: [] },
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
                    r={node.type === "hallway" ? 6 : 12} // Smaller radius for hallway nodes
                    fill={node.type === "classroom" ? "orange" : node.type === "hallway" ? "green" :  node.type === "Bathroom" ? "pink" : "blue"} // Set different colors for hallways
                    stroke="black"
                    strokeWidth={2}
                  />
                  {/* Conditionally render the label only for non-hallway nodes */}
                  {node.type !== "hallway" && (
                    <SvgText
                      x={node.x}
                      y={node.y - 15}
                      fill="black"
                      fontSize={25}
                      textAnchor="middle"
                    >
                      {node.id}
                    </SvgText>
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