// Hall9Map.tsx
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { FloorMap } from "./FloorMap"; // Adjust path
import { filterNodesByFloor } from "./utils"; // Adjust path
import Hall9 from "../assets/indoorMaps/Hall-9.svg"; // Adjust path

interface Hall9MapProps {
  path: string[];
  style?: StyleProp<ViewStyle>;
}

const Hall9Map = ({ path, style }: Hall9MapProps) => {
  const hall9Nodes = filterNodesByFloor("9");
  return <FloorMap floor="9" nodes={hall9Nodes} path={path} BackgroundSvg={Hall9} style={style} />;
};

export default Hall9Map;