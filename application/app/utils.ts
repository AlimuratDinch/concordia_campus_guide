// utils.ts
import { GraphNode, Rawnodes } from "./nodesData"; // Adjust path

export const filterNodesByFloor = (floor: string): GraphNode[] => {
  return Rawnodes.filter((node) => node.floor === floor && node.x !== undefined && node.y !== undefined);
};