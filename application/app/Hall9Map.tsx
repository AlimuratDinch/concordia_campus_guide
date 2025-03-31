// Hall9Map.tsx
import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Polyline, G, Circle, Text as SvgText } from "react-native-svg";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import Hall9 from "../assets/indoorMaps/Hall-9.svg";

type Node = {
  id: string;
  type: string;
  x: number;
  y: number;
  floor?: string;
  adjacent?: string[];
};

type Hall9MapProps = {
  path: string[];
};

const Hall9Map = ({ path }: Hall9MapProps) => {
  const scale = useSharedValue(1.1);
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
    //Bathrooms
   // HALL 9th Floor
       //Bathrooms
       { id: "Bathroom-F", type: "Bathroom", x: 350, y: 265, floor: "9" },
       { id: "Bathroom-M", type: "Bathroom", x: 650, y: 265, floor: "9" },

       //Classrooms top left
       { id: "967", type: "classroom", x: 70, y: 170, floor: "9" },
       { id: "965", type: "classroom", x: 70, y: 350, floor: "9" },
       { id: "963", type: "classroom", x: 70, y: 450, floor: "9" },
       { id: "903", type: "classroom", x: 200, y: 135, floor: "9" },
       { id: "907", type: "classroom", x: 375, y: 135, floor: "9" },
       { id: "909", type: "classroom", x: 550, y: 135, floor: "9" },
       { id: "911", type: "classroom", x: 650, y: 135, floor: "9" },
       { id: "913", type: "classroom", x: 725, y: 135, floor: "9" },
       { id: "915", type: "classroom", x: 825, y: 135, floor: "9" },

       //Classrooms right side
       { id: "917", type: "classroom", x: 930, y: 135, floor: "9" },
       { id: "908", type: "classroom", x: 485, y: 350, floor: "9" },
       { id: "980", type: "classroom", x: 570, y: 390, floor: "9" },
       { id: "992", type: "classroom", x: 425, y: 360, floor: "9" },
       { id: "919", type: "classroom", x: 930, y: 235, floor: "9" },
       { id: "921", type: "classroom", x: 930, y: 345, floor: "9" },
       { id: "923", type: "classroom", x: 930, y: 450, floor: "9" },
       { id: "990", type: "classroom", x: 720, y: 350, floor: "9" },
       { id: "986", type: "classroom", x: 775, y: 350, floor: "9" },
       { id: "920", type: "classroom", x: 700, y: 470, floor: "9" },
       { id: "925", type: "classroom", x: 930, y: 565, floor: "9" },
       { id: "927", type: "classroom", x: 930, y: 700, floor: "9" },
       { id: "929", type: "classroom", x: 930, y: 850, floor: "9" },
       { id: "933", type: "classroom", x: 750, y: 900, floor: "9" },
       { id: "932", type: "classroom", x: 740, y: 810, floor: "9" },
       { id: "928", type: "classroom", x: 790, y: 810, floor: "9" },
       { id: "937", type: "classroom", x: 560, y: 810, floor: "9" },
       { id: "906", type: "classroom", x: 485, y: 260, floor: "9" },

       //Classrooms center left
       { id: "941", type: "classroom", x: 420, y: 950, floor: "9" },
       { id: "960", type: "classroom", x: 440, y: 470, floor: "9" },
       { id: "962", type: "classroom", x: 370, y: 470, floor: "9" },
       { id: "964", type: "classroom", x: 270, y: 470, floor: "9" },

       { id: "968", type: "classroom", x: 230, y: 610, floor: "9" },
       { id: "966", type: "classroom", x: 370, y: 610, floor: "9" },

       { id: "981", type: "classroom", x: 360, y: 760, floor: "9" },
       { id: "945", type: "classroom", x: 300, y: 800, floor: "9" },
       { id: "943", type: "classroom", x: 330, y: 860, floor: "9" },

       { id: "H9-stairs-0", type: "stairs", x: 260, y: 350, floor: "9", adjacent: ['stairs-HE'] },
       { id: "H9-stairs-1", type: "stairs", x: 300, y: 730, floor: "9" },
       { id: "H9-stairs-2", type: "stairs", x: 715, y: 740, floor: "9" },
       { id: "H9-elevators", type: "elevators", x: 350, y: 350, floor: "9", adjacent: ["H8-elevators"] },
       { id: "H9-escalators", type: "escalators", x: 480, y: 550, floor: "9", adjacent: ["H8-escalators"] },

       //Hallways
       { id: "1", type: "hallway", x: 260, y: 400, floor: "9", adjacent: ['2',"H9-stairs-0","964"] },
       { id: "2", type: "hallway", x: 350, y: 400, floor: "9", adjacent: ['1','H9-elevators',"962"] },
       { id: "3", type: "hallway", x: 425, y: 400, floor: "9", adjacent: ['2','4','992','960'] },
       { id: "4", type: "hallway", x: 520, y: 400, floor: "9", adjacent: ['3','5','908','980'] },
       { id: "5", type: "hallway", x: 520, y: 470, floor: "9", adjacent: ['4','6','960'] },
       { id: "6", type: "hallway", x: 520, y: 550, floor: "9", adjacent: ['5','7','H9-escalators'] },
       { id: "7", type: "hallway", x: 520, y: 640, floor: "9", adjacent: ['6','8','937'] },
       { id: "8", type: "hallway", x: 620, y: 640, floor: "9", adjacent: ['7','9'] },
       { id: "9", type: "hallway", x: 720, y: 640, floor: "9", adjacent: ['8','10',"H9-stairs-2"] },
       { id: "10", type: "hallway", x:800, y: 640, floor: "9", adjacent: ['9','26','927'] },

       //right side
       { id: "26", type: "hallway", x:810, y: 550, floor: "9", adjacent: ['10','27','925'] },
       { id: "27", type: "hallway", x:840, y: 470, floor: "9", adjacent: ['26','28','920','923'] },
       { id: "28", type: "hallway", x:840, y: 370, floor: "9", adjacent: ['27','29','921','986'] },
       { id: "29", type: "hallway", x:840, y: 290, floor: "9", adjacent: ['28','30','986'] },
       { id: "30", type: "hallway", x:840, y: 230, floor: "9", adjacent: ['29','919','917','915'] },

       { id: "31", type: "hallway", x:740, y: 230, floor: "9", adjacent: ['30','32','913','990'] },
       { id: "32", type: "hallway", x:640, y: 230, floor: "9", adjacent: ['31','33','Bathroom-M','911'] },
       { id: "33", type: "hallway", x:540, y: 230, floor: "9", adjacent: ['32','34','906','909'] },
       { id: "34", type: "hallway", x:440, y: 230, floor: "9", adjacent: ['33','35'] },
       { id: "35", type: "hallway", x:340, y: 230, floor: "9", adjacent: ['34','36','Bathroom-F'] },
       { id: "36", type: "hallway", x:240, y: 230, floor: "9", adjacent: ['35','37'] },
       { id: "37", type: "hallway", x:180, y: 230, floor: "9", adjacent: ['36','38','903','967'] },

       { id: "38", type: "hallway", x:180, y: 330, floor: "9", adjacent: ['37','39','965'] },
       { id: "39", type: "hallway", x:180, y: 400, floor: "9", adjacent: ['38','1','963'] },

       { id: "40", type: "hallway", x: 530, y: 300, floor: "9", adjacent: ['4','33'] },

  ];

// Filter path to only include nodes on the 9th floor
  const hall9Path = path.filter((nodeId) => nodes.some((n) => n.id === nodeId && n.floor === "9"));

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
              <Hall9 />
              {drawPath(hall9Path)}
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

export default Hall9Map;