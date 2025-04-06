// Hall8Map.tsx
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { FloorMap } from "./FloorMap"; // Adjust path
import { filterNodesByFloor } from "./utils"; // Adjust path
import Hall8 from "../assets/indoorMaps/Hall-8.svg"; // Adjust path

interface Hall8MapProps {
  path: string[];
  style?: StyleProp<ViewStyle>;
}

const Hall8Map = ({ path, style }: Hall8MapProps) => {
  const hall8Nodes = filterNodesByFloor("8");
  return <FloorMap floor="8" nodes={hall8Nodes} path={path} BackgroundSvg={Hall8} style={style} />;
};

export default Hall8Map;