// IndoorMapScreen.tsx
import React, { useState } from "react";
import { StyleSheet, Button, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Hall8Map from "./Hall8Map";
import Hall9Map from "./Hall9Map";
import { PathFinder } from "./PathAlgorithmDev";
import IndoorSearch from "./IndoorSearch";
import { Rawnodes as nodes } from "./nodesData";

const IndoorMapScreen: React.FC = () => {
  const [showHall8, setShowHall8] = useState(true);
  const [path, setPath] = useState<string[]>([]);

  const toggleMap = () => {
    setShowHall8(prev => !prev);
  };

  const handleSearch = (startNode: string, endNode: string, travelType: string) => {
    const computedPath = PathFinder(startNode, endNode, travelType);
    if (computedPath) {
      setPath(computedPath);
      console.log("Computed Path:", computedPath);
    } else {
      setPath([]);
      console.log("No path found between", startNode, "and", endNode);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
            title={`Switch to Hall ${showHall8 ? "9" : "8"}`}
            onPress={toggleMap}
            color="#007AFF"
          />
        </View>
        <IndoorSearch nodes={nodes} onSearch={handleSearch} />
        {showHall8 ? (
          <Hall8Map path={path} style={styles.map} />
        ) : (
          <Hall9Map path={path} style={styles.map} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  buttonContainer: {
    position: "absolute",
    top: 20,
    zIndex: 1,
  },
  map: {
    width: "100%",
    height: "80%",
  },
});

export default IndoorMapScreen;