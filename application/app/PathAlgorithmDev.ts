// PathAlgorithmDev.ts
import { GraphNode, Rawnodes } from "./nodesData"; // Adjust path based on your file structure

// Define Graph type for adjacency list
export type Graph = Record<string, { type: string; adjacent: string[] }>;

// Build the graph from nodes
export const buildGraph = (nodes: GraphNode[]): Graph => {
  const graph: Graph = {};

  nodes.forEach((node) => {
    graph[node.id] = {
      type: node.type,
      adjacent: node.adjacent ? [...node.adjacent] : [], // Copy adjacent array or default to empty
    };

    if (node.adjacent) {
      node.adjacent.forEach((neighbor) => {
        if (!graph[neighbor]) {
          const neighborNode = nodes.find((n) => n.id === neighbor);
          graph[neighbor] = {
            type: neighborNode ? neighborNode.type : "unknown",
            adjacent: [],
          };
        }
        // Ensure bidirectional adjacency (only if not already present)
        if (!graph[neighbor].adjacent.includes(node.id)) {
          graph[neighbor].adjacent.push(node.id);
        }
      });
    }
  });

  return graph;
};

// Export the pre-built graph using Rawnodes
export const graph = buildGraph(Rawnodes);

export const filteredGraph = (graph: Graph, accessibility: string): Graph => {
  const filteredGraph: Graph = {};

  for (const nodeId in graph) {
    const node = graph[nodeId];

    const filteredAdjacent = node.adjacent.filter((neighborId) => {
      const neighborType = graph[neighborId]?.type;

      // Always allow hallways, classrooms, and bathrooms
      if (neighborType === "hallway" || neighborType === "classroom" || neighborType === "Bathroom") {
        return true;
      }

      // Accessibility-specific rules for vertical movement
      if (accessibility === "standard") {
        return neighborType === "escalators";
      } else if (accessibility === "active") {
        return neighborType === "stairs";
      } else if (accessibility === "accessible") {
        return neighborType === "elevators";
      }

      return false; // Exclude other types
    });

    filteredGraph[nodeId] = {
      type: node.type,
      adjacent: filteredAdjacent,
    };
  }

  return filteredGraph;
};

export const bfs = (graph: Graph, start: string, target: string, accessibility: string): string[] | null => {
  const filtered = filteredGraph(graph, accessibility);

  const queue: string[][] = [[start]];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const path = queue.shift()!;
    const node = path[path.length - 1];

    if (visited.has(node)) continue;

    visited.add(node);

    if (node === target) {
      return path;
    }

    const neighbors = filtered[node]?.adjacent || [];
    console.log(`Exploring ${node} with neighbors:`, neighbors);

    for (const neighbor of neighbors) {
      queue.push([...path, neighbor]);
    }
  }

  console.log("No path found.");
  return null;
};

// Export PathFinder with pre-inserted graph
export const PathFinder = (start: string, target: string, accessibility: string): string[] | null => {
  return bfs(graph, start, target, accessibility);
};