import React, { useState, useMemo } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { GraphNode, Rawnodes as nodes } from "./nodesData";

interface IndoorSearchProps {
  nodes?: GraphNode[];
  onSearch: (start: string, target: string, accessibility: TravelType) => void;
}

enum TravelType {
  Standard = "standard",
  Active = "active",
  Accessible = "accessible",
}

const TRAVEL_OPTIONS = [
  { label: "Standard", value: TravelType.Standard },
  { label: "Active", value: TravelType.Active },
  { label: "Accessible", value: TravelType.Accessible },
];

// Reusable Picker Components
const FloorPicker: React.FC<{
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  floors: string[];
}> = ({ label, value, onChange, floors }) => (
  <View style={styles.pickerContainer}>
    <Text style={styles.label}>{label}</Text>
    <Picker
      selectedValue={value}
      onValueChange={onChange}
      style={styles.picker}
      itemStyle={styles.pickerItem}
    >
      <Picker.Item label="Select Floor" value={null} />
      {floors.map((floor) => (
        <Picker.Item key={floor} label={`Floor ${floor}`} value={floor} />
      ))}
    </Picker>
  </View>
);

const NodePicker: React.FC<{
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  nodes: GraphNode[];
}> = ({ label, value, onChange, nodes }) => (
  <View style={styles.pickerContainer}>
    <Text style={styles.label}>{label}</Text>
    <Picker
      selectedValue={value}
      onValueChange={onChange}
      style={styles.picker}
      itemStyle={styles.pickerItem}
    >
      <Picker.Item label={`Select ${label.split(" ")[1]}`} value={null} />
      {nodes.map((node) => (
        <Picker.Item key={node.id} label={node.id} value={node.id} />
      ))}
    </Picker>
  </View>
);

const TravelTypePicker: React.FC<{
  value: TravelType;
  onChange: (value: TravelType) => void;
}> = ({ value, onChange }) => (
  <View style={styles.pickerContainer}>
    <Text style={styles.label}>Travel Type</Text>
    <Picker
      selectedValue={value}
      onValueChange={onChange}
      style={styles.picker}
      itemStyle={styles.pickerItem}
    >
      {TRAVEL_OPTIONS.map((option) => (
        <Picker.Item key={option.value} label={option.label} value={option.value} />
      ))}
    </Picker>
  </View>
);

const IndoorSearch: React.FC<IndoorSearchProps> = ({ nodes: propNodes = nodes, onSearch }) => {
  const [startFloor, setStartFloor] = useState<string | null>(null);
  const [endFloor, setEndFloor] = useState<string | null>(null);
  const [startNode, setStartNode] = useState<string | null>(null);
  const [endNode, setEndNode] = useState<string | null>(null);
  const [travelType, setTravelType] = useState<TravelType>(TravelType.Standard);

  const filteredNodes = useMemo(
    () => propNodes.filter((node: GraphNode) => node.type !== "hallway"),
    [propNodes]
  );

  const floors = useMemo(
    () =>
      [...new Set(filteredNodes.map((node: GraphNode) => node.floor).filter((floor): floor is string => floor !== undefined))],
    [filteredNodes]
  );

  const filteredStartNodes = useMemo(
    () => filteredNodes.filter((node: GraphNode) => node.floor === startFloor),
    [filteredNodes, startFloor]
  );

  const filteredEndNodes = useMemo(
    () => filteredNodes.filter((node: GraphNode) => node.floor === endFloor),
    [filteredNodes, endFloor]
  );

  const handleSearch = () => {
    if (startNode && endNode) {
      onSearch(startNode, endNode, travelType);
    } else {
      console.warn("Missing start or end node");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Indoor Navigation</Text>

      <FloorPicker label="Start Floor" value={startFloor} onChange={setStartFloor} floors={floors} />
      <NodePicker label="Start Location" value={startNode} onChange={setStartNode} nodes={filteredStartNodes} />

      <FloorPicker label="End Floor" value={endFloor} onChange={setEndFloor} floors={floors} />
      <NodePicker label="End Location" value={endNode} onChange={setEndNode} nodes={filteredEndNodes} />

      <TravelTypePicker value={travelType} onChange={setTravelType} />

      <View style={styles.buttonWrapper}>
        <Button title="Find Path" onPress={handleSearch} color="#8A1538" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8A1538",
    marginBottom: 10,
    textAlign: "center",
  },
  pickerContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  picker: {
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
  },
  pickerItem: {
    height: 50,
    fontSize: 14,
  },
  buttonWrapper: {
    marginTop: 15,
  },
});

export default IndoorSearch;