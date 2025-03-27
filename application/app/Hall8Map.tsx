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
    scale.value = 0.55;
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
    
    //Middle Hallway top to bottom
    { id: "H1-U", type: "hallway", x: 555, y: 120 },
    { id: "H1-H2", type: "hallway", x: 555, y: 227 },
    { id: "H1-MU", type: "hallway", x: 555, y: 320 },
    { id: "H1-HE", type: "hallway", x: 555, y: 400 },
    { id: "H1-M", type: "hallway", x: 555, y: 520 },
    { id: "H1-ML", type: "hallway", x: 555, y: 650 },
    { id: "H1-H2.1", type: "hallway", x: 555, y: 800 },
    { id: "H1-L", type: "hallway", x: 555, y: 900 },

    //Upper Hallway left to right
    { id: "H2-LC", type: "hallway", x: 185, y: 227 },
    { id: "H2-ML", type: "hallway", x: 380, y: 227 },
    { id: "H2-MR", type: "hallway", x: 710, y: 227 },
    { id: "H2-CR", type: "hallway", x: 835, y: 227 },

    //Lower Hallway left to right
    { id: "H2.1-LC2", type: "hallway", x: 185, y: 800 },
    { id: "H2.1-ML2", type: "hallway", x: 380, y: 800 },
    { id: "H2.1-MR2", type: "hallway", x: 710, y: 800 },
    { id: "H2.1-CR2", type: "hallway", x: 835, y: 800 },

    //Left hallway top to bottom
    { id: "H3-MU", type: "hallway", x: 185, y: 320 },
    { id: "H3-HE", type: "hallway", x: 185, y: 400 },
    { id: "H3-M", type: "hallway", x: 185, y: 500 },
    { id: "H3-ML", type: "hallway", x: 185, y: 650 },

    //Right hallway top to bottom
    { id: "H4-MU", type: "hallway", x: 835, y: 350 },
    { id: "H4-M", type: "hallway", x: 835, y: 500 },
    { id: "H4-ML", type: "hallway", x: 835, y: 650 },

    //Elevator and stairs hallway
    { id: "HE-1", type: "hallway", x: 260, y: 400 },
    { id: "HE-2", type: "hallway", x: 360, y: 400 },
    { id: "HE-3", type: "hallway", x: 480, y: 400 },
    
    { id: "806-01", type: "classroom", x: 490, y: 280 },
    { id: "806-02", type: "classroom", x: 490, y: 318 },
    { id: "806-03", type: "classroom", x: 490, y: 355 },

    //Left column
    { id: "867", type: "classroom", x: 135, y: 140 },
    { id: "865", type: "classroom", x: 110, y: 175 },
    { id: "863", type: "classroom", x: 135, y: 230 },
    { id: "861", type: "classroom", x: 135, y: 330 },
    { id: "859", type: "classroom", x: 135, y: 420 },
    { id: "857", type: "classroom", x: 135, y: 510 },
    { id: "855", type: "classroom", x: 135, y: 600 },
    { id: "853", type: "classroom", x: 135, y: 700 },
    { id: "851-01", type: "classroom", x: 135, y: 780 },
    { id: "851-02", type: "classroom", x: 90, y: 770 },
    { id: "851-03", type: "classroom", x: 70, y: 810 },
    { id: "849", type: "classroom", x: 120, y: 840 },

    //Top Row
    { id: "801", type: "classroom", x: 190, y: 170 },
    { id: "803", type: "classroom", x: 290, y: 170 },
    { id: "805-01", type: "classroom", x: 370, y: 170 },
    { id: "805-02", type: "classroom", x: 370, y: 130 },
    { id: "805-03", type: "classroom", x: 355, y: 95 },
    { id: "807", type: "classroom", x: 470, y: 170 },
    { id: "811", type: "classroom", x: 640, y: 170 },
    { id: "813", type: "classroom", x: 740, y: 170 },
    { id: "815", type: "classroom", x: 835, y: 170 },
    { id: "817", type: "classroom", x: 890, y: 170 },

    //Right Column
    { id: "819", type: "classroom", x: 890, y: 240 },
    { id: "821", type: "classroom", x: 890, y: 335 },
    { id: "823", type: "classroom", x: 890, y: 430 },
    { id: "825", type: "classroom", x: 890, y: 520 },
    { id: "827", type: "classroom", x: 890, y: 610 },
    { id: "829", type: "classroom", x: 890, y: 700 },
    { id: "831", type: "classroom", x: 890, y: 840 },

    //Bottom Row
    { id: "833", type: "classroom", x: 830, y: 840 },
    { id: "835", type: "classroom", x: 740, y: 840 },
    { id: "837", type: "classroom", x: 640, y: 840 },
    { id: "841", type: "classroom", x: 470, y: 840 },
    { id: "843", type: "classroom", x: 380, y: 840 },
    { id: "845", type: "classroom", x: 290, y: 840 },
    { id: "847", type: "classroom", x: 200, y: 840 },

    { id: "860", type: "classroom", x: 270, y: 440 },
    { id: "862", type: "classroom", x: 380, y: 440 },
    { id: "840", type: "classroom", x: 440, y: 440 },
    { id: "854", type: "classroom", x: 230, y: 600 },
    { id: "852", type: "classroom", x: 230, y: 660 },
    { id: "870", type: "classroom", x: 300, y: 660 },
    { id: "842", type: "classroom", x: 400, y: 660 },
    { id: "881", type: "classroom", x: 380, y: 760 },
    { id: "838", type: "classroom", x: 500, y: 750 },

    { id: "892", type: "classroom", x: 420, y: 360 },

    { id: "832", type: "classroom", x: 640, y: 760 },
    { id: "822", type: "classroom", x: 800, y: 610 },
    { id: "820-1", type: "classroom", x: 770, y: 410 },
    { id: "820-2", type: "classroom", x: 770, y: 530 },
    { id: "886", type: "classroom", x: 800, y: 360 },

    //Stairs & Escalators
    { id: "stairs-HE", type: "stairs", x: 260, y: 350 },
    { id: "stairs-H2.1-1", type: "stairs", x: 300, y: 760 },
    { id: "stairs-H2.1-2", type: "stairs", x: 720, y: 760 },
    { id: "stairs-H1", type: "stairs", x: 720, y: 260 },
      { id: "elevators", type: "elevators", x: 350, y: 350 },
       { id: "escalators-up", type: "escalators", x: 480, y: 620 },
       { id: "escalators-down", type: "escalators", x: 480, y: 450 },

    //Bathrooms
    { id: "Bathroom-M", type: "Bathroom", x: 620, y: 260 },
    { id: "Bathroom-F", type: "Bathroom", x: 350, y: 260 },

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
                    r={node.type === "hallway" ? 6 : 12} // Smaller radius for hallway nodes
                    fill={node.type === "classroom" ? "orange" : node.type === "hallway" ? "green" : node.type === "Bathroom" ? "pink" : "blue"}
                    stroke="black"
                    strokeWidth={2}
                  />
                  <SvgText
                    x={node.x}
                    y={node.y - 15}
                    fill="black"
                    fontSize={node.type === "hallway" ? 15 : 25 } // Smaller font size for hallway nodes
                    textAnchor="middle"
                  >
                    {node.type === "stairs" ? node.type:node.id && node.type === "hallway" ? "":node.id}
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