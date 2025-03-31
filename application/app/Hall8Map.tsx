// Hall8Map.tsx
import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Polyline, G, Circle, Text as SvgText } from "react-native-svg";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import Hall8 from "../assets/indoorMaps/Hall-8.svg"; // Your Hall 8 SVG

type Node = {
  id: string;
  type: string;
  x: number;
  y: number;
  floor?: string;
  adjacent?: string[];
};

type Hall8MapProps = {
  path: string[];
};

const Hall8Map = ({ path }: Hall8MapProps) => {
  const scale = useSharedValue(0.55);
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

  const nodes: Node[] = [
    //HALL 8th Floor
    //Middle Hallway top to bottom
        { id: "H1-U", type: "hallway", x: 555, y: 120, floor: "8", adjacent: ["H1-H2"]},
        { id: "H1-H2", type: "hallway", x: 555, y: 227, floor: "8", adjacent: ["811","807","H8-Bathroom-M","H2-MR","H2-ML","H1-MU","H1-U"]},
        { id: "H1-MU", type: "hallway", x: 555, y: 320, floor: "8", adjacent: ["H1-H2","H1-HE","806-01","806-02","806-03"]},
        { id: "H1-HE", type: "hallway", x: 555, y: 400, floor: "8", adjacent: ["HE-3","H1-MU","H1-M"]},
        { id: "H1-M", type: "hallway", x: 555, y: 520, floor: "8", adjacent: ["H1-HE","H1-ML","H8-escalators"]},
        { id: "H1-ML", type: "hallway", x: 555, y: 650, floor: "8", adjacent: ["H1-M","H1-H2.1"]},
        { id: "H1-H2.1", type: "hallway", x: 555, y: 800, floor: "8", adjacent: ["H1-ML","H2.1-ML2","H2.1-MR2","H1-L","841","838","837","832"]},
        { id: "H1-L", type: "hallway", x: 555, y: 900, floor: "8", adjacent: ["H1-H2.1"]},

        //Upper Hallway left to right
        { id: "H2-LC", type: "hallway", x: 185, y: 227, floor: "8", adjacent: ["H2-ML","H3-MU","863","801","865","867"]},
        { id: "H2-ML", type: "hallway", x: 380, y: 227, floor: "8", adjacent: ["H1-H2","H2-LC","805","803","H8-Bathroom-F"]},
        { id: "H2-MR", type: "hallway", x: 710, y: 227, floor: "8", adjacent: ["H1-H2","813","stairs-H1","H2-CR"]},
        { id: "H2-CR", type: "hallway", x: 835, y: 227, floor: "8", adjacent: ["H4-MU","H2-MR","819","817","815"]},

        //Lower Hallway left to right
        { id: "H2.1-LC2", type: "hallway", x: 185, y: 800, floor: "8", adjacent: ["H3-ML","851-01","851-02","851-03","849","847","H2.1-ML2"]},
        { id: "H2.1-ML2", type: "hallway", x: 380, y: 800, floor: "8", adjacent: ["H2.1-LC2","stairs-H2.1-1","845","843","881","842","H1-H2.1"]},
        { id: "H2.1-MR2", type: "hallway", x: 710, y: 800, floor: "8", adjacent: ["H1-H2.1","stairs-H2.1-2","H2.1-CR2","835"]},
        { id: "H2.1-CR2", type: "hallway", x: 835, y: 800, floor: "8", adjacent: ["H2.1-MR2","833","837","829","H4-ML"]},

        //Left hallway top to bottom
        { id: "H3-MU", type: "hallway", x: 185, y: 320, floor: "8", adjacent: ["H2-LC","H3-HE","861"]},
        { id: "H3-HE", type: "hallway", x: 185, y: 400, floor: "8", adjacent: ["H3-MU","859","H3-M","HE-1"]},
        { id: "H3-M", type: "hallway", x: 185, y: 500, floor: "8", adjacent: ["H3-HE","H3-ML","857"]},
        { id: "H3-ML", type: "hallway", x: 185, y: 650, floor: "8", adjacent: ["H3-M","H2.1-LC2","855","853","852","854"]},

        //Right hallway top to bottom
        { id: "H4-MU", type: "hallway", x: 835, y: 350, floor: "8", adjacent: ["H4-M","H2-CR","889","821","823","820-1"]},
        { id: "H4-M", type: "hallway", x: 835, y: 500, floor: "8", adjacent: ["H4-ML","H4-MU","820-2","825"]},
        { id: "H4-ML", type: "hallway", x: 835, y: 650, floor: "8", adjacent: ["H2.1-CR2","H3-M","829","827","822"]},

        //Elevator and stairs hallway
        { id: "HE-1", type: "hallway", x: 260, y: 400, floor: "8", adjacent: ["H3-HE","stairs-HE", "HE-2", "860"]},
        { id: "HE-2", type: "hallway", x: 360, y: 400, floor: "8", adjacent: ["HE-1", "H8-elevators", "HE-3", "862", "892"]},
        { id: "HE-3", type: "hallway", x: 480, y: 400, floor: "8", adjacent: ["HE-2", "H1-HE","840"]},

        { id: "806-01", type: "classroom", x: 490, y: 280, floor: "8", adjacent: ["H1-MU"]},
        { id: "806-02", type: "classroom", x: 490, y: 318, floor: "8", adjacent: ["H1-MU"]},
        { id: "806-03", type: "classroom", x: 490, y: 355, floor: "8", adjacent: ["H1-MU"]},

        //Left column
        { id: "867", type: "classroom", x: 135, y: 140, floor: "8", adjacent: ["H2-LC"]},
        { id: "865", type: "classroom", x: 110, y: 175, floor: "8", adjacent: ["H2-LC"]},
        { id: "863", type: "classroom", x: 135, y: 230, floor: "8", adjacent: ["H2-LC"]},
        { id: "861", type: "classroom", x: 135, y: 330, floor: "8", adjacent: ["H3-MU"]},
        { id: "859", type: "classroom", x: 135, y: 420, floor: "8", adjacent: ["H3-HE"]},
        { id: "857", type: "classroom", x: 135, y: 510, floor: "8", adjacent: ["H3-M"]},
        { id: "855", type: "classroom", x: 135, y: 600, floor: "8", adjacent: ["H3-ML"]},
        { id: "853", type: "classroom", x: 135, y: 700, floor: "8", adjacent: ["H3-ML"]},
        { id: "851-01", type: "classroom", x: 135, y: 780, floor: "8", adjacent: ["H2.1-LC2"]},
        { id: "851-02", type: "classroom", x: 90, y: 770, floor: "8", adjacent: ["H2.1-LC2"]},
        { id: "851-03", type: "classroom", x: 70, y: 810, floor: "8", adjacent: ["H2.1-LC2"]},
        { id: "849", type: "classroom", x: 120, y: 840, floor: "8", adjacent: ["H2.1-LC2"]},

        //Top Row
        { id: "801", type: "classroom", x: 190, y: 170, floor: "8", adjacent: ["H2-LC"]},
        { id: "803", type: "classroom", x: 290, y: 170, floor: "8", adjacent: ["H2-ML"]},
        { id: "805", type: "classroom", x: 350, y: 170, floor: "8", adjacent: ["H2-ML"]},
        { id: "807", type: "classroom", x: 470, y: 170, floor: "8", adjacent: ["H1-H2"]},
        { id: "811", type: "classroom", x: 640, y: 170, floor: "8", adjacent: ["H1-H2"]},
        { id: "813", type: "classroom", x: 740, y: 170, floor: "8", adjacent: ["H2-MR"]},
        { id: "815", type: "classroom", x: 835, y: 170, floor: "8", adjacent: ["H2-CR"]},
        { id: "817", type: "classroom", x: 890, y: 170, floor: "8", adjacent: ["H2-CR"]},

        //Right Column
        { id: "819", type: "classroom", x: 890, y: 240, floor: "8", adjacent: ["H2-CR"]},
        { id: "821", type: "classroom", x: 890, y: 335, floor: "8", adjacent: ["H4-MU"]},
        { id: "823", type: "classroom", x: 890, y: 430, floor: "8", adjacent: ["H4-MU"]},
        { id: "825", type: "classroom", x: 890, y: 520, floor: "8", adjacent: ["H4-M"]},
        { id: "827", type: "classroom", x: 890, y: 610, floor: "8", adjacent: ["H4-ML"]},
        { id: "829", type: "classroom", x: 890, y: 700, floor: "8", adjacent: ["H4-ML"]},
        { id: "831", type: "classroom", x: 890, y: 840, floor: "8", adjacent: ["H2.1-CR2"]},

        //Bottom Row
        { id: "833", type: "classroom", x: 830, y: 840, floor: "8", adjacent: ["H2.1-CR2"]},
        { id: "835", type: "classroom", x: 740, y: 840, floor: "8", adjacent: ["H2.1-MR2"]},
        { id: "837", type: "classroom", x: 640, y: 840, floor: "8", adjacent: ["H1-H2.1"]},
        { id: "841", type: "classroom", x: 470, y: 840, floor: "8", adjacent: ["H1-H2.1"]},
        { id: "843", type: "classroom", x: 380, y: 840, floor: "8", adjacent: ["H2.1-ML2"]},
        { id: "845", type: "classroom", x: 290, y: 840, floor: "8", adjacent: ["H2.1-ML2"]},
        { id: "847", type: "classroom", x: 200, y: 840, floor: "8", adjacent: ["H2.1-LC2"]},

        { id: "860", type: "classroom", x: 270, y: 440, floor: "8", adjacent: ["HE-1"]},
        { id: "862", type: "classroom", x: 380, y: 440, floor: "8", adjacent: ["HE-2"]},
        { id: "840", type: "classroom", x: 440, y: 440, floor: "8", adjacent: ["HE-3"]},
        { id: "854", type: "classroom", x: 230, y: 600, floor: "8", adjacent: ["H3-ML"]},
        { id: "852", type: "classroom", x: 230, y: 660, floor: "8", adjacent: ["870","H3-ML"]},
        { id: "870", type: "classroom", x: 300, y: 660, floor: "8", adjacent: ["852"]},
        { id: "842", type: "classroom", x: 400, y: 660, floor: "8", adjacent: ["H2.1-ML2"]},
        { id: "881", type: "classroom", x: 380, y: 760, floor: "8", adjacent: ["H2.1-ML2"]},
        { id: "838", type: "classroom", x: 500, y: 750, floor: "8", adjacent: ["H1-H2.1"]},

        { id: "892", type: "classroom", x: 420, y: 360, floor: "8", adjacent: ["HE-2"]},

        { id: "832", type: "classroom", x: 640, y: 760, floor: "8", adjacent: ["H1-H2.1"]},
        { id: "822", type: "classroom", x: 800, y: 610, floor: "8", adjacent: ["H4-ML"]},
        { id: "820-1", type: "classroom", x: 770, y: 410, floor: "8", adjacent: ["H4-MU"]},
        { id: "820-2", type: "classroom", x: 770, y: 530, floor: "8", adjacent: ["H4-M"]},
        { id: "886", type: "classroom", x: 800, y: 360, floor: "8", adjacent: ["H4-MU"]},

        //Stairs & Escalators
        { id: "stairs-HE", type: "stairs", x: 260, y: 350, floor: "8", adjacent: ["HE-1"]},
        { id: "stairs-H2.1-1", type: "stairs", x: 300, y: 760, floor: "8", adjacent: ["H2.1-ML2"]},
        { id: "stairs-H2.1-2", type: "stairs", x: 720, y: 760, floor: "8", adjacent: ["H2.1-MR2"]},
        { id: "stairs-H1", type: "stairs", x: 720, y: 260, floor: "8", adjacent: ["H2-MR"]},
        { id: "H8-elevators", type: "elevators", x: 350, y: 350, floor: "8", adjacent: ["HE-2"]},
        { id: "H8-escalators", type: "escalators", x: 480, y: 520, floor: "8", adjacent: ["H1-ML"]},

    //Bathrooms (8th Floor)
    { id: "H8-Bathroom-M", type: "Bathroom", x: 620, y: 260, floor: "8", adjacent: ["H1-H2"]},
    { id: "H8-Bathroom-F", type: "Bathroom", x: 350, y: 260, floor: "8", adjacent: ["H2-ML"]},
  ];

// Filter path to only include nodes on the 8th floor
  const hall8Path = path.filter((nodeId) => nodes.some((n) => n.id === nodeId && n.floor === "8"));

  const drawPath = (nodeIds: string[]) => {
    if (nodeIds.length < 2) return null;

    const pathData = nodeIds
      .map((id) => {
        const node = nodes.find((n) => n.id === id);
        if (!node) return null;
        return `${node.x},${node.y}`;
      })
      .filter(Boolean)
      .join(" ");

    return <Polyline points={pathData} stroke="black" strokeWidth={6} fill="none" />;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, panGesture)}>
        <Animated.View style={[styles.mapContainer, animatedStyle]}>
          <Svg viewBox="0 0 1050 1050" preserveAspectRatio="xMidYMid meet">
            <G>
              <Hall8 />
              {drawPath(hall8Path)}
              {nodes.map((node) => (
                <G key={node.id}>
                  <Circle
                    cx={node.x}
                    cy={node.y}
                    r={node.type === "hallway" ? 6 : 12}
                    fill={
                      node.type === "classroom"
                        ? "orange"
                        : node.type === "hallway"
                        ? "green"
                        : node.type === "Bathroom"
                        ? "pink"
                        : "blue"
                    }
                    stroke="black"
                    strokeWidth={2}
                  />
                  {node.type !== "hallway" && (
                    <SvgText x={node.x} y={node.y - 15} fill="black" fontSize={25} textAnchor="middle">
                      {node.type === "stairs" ? node.type : node.id}
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

export default Hall8Map;