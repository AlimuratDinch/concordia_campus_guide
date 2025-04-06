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
  const [showMap, setShowMap] = useState(false); // Controls map visibility and search hiding

  const toggleHall = () => {
    setShowHall8(prev => !prev);
  };

  const handleSearch = (startNode: string, endNode: string, travelType: string) => {
    const computedPath = PathFinder(startNode, endNode, travelType);
    if (computedPath) {
      setPath(computedPath);
      setShowMap(true); // Show map and hide search
      console.log("Computed Path:", computedPath);
    } else {
      setPath([]);
      setShowMap(false); // Keep search visible if no path
      console.log("No path found between", startNode, "and", endNode);
    }
  };

  const handleReturn = () => {
    setShowMap(false); // Hide map and show search again
    setPath([]); // Optional: Clear the path when returning
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {showMap ? (
          <>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to Hall ${showHall8 ? "9" : "8"}`}
                onPress={toggleHall}
                color="#007AFF"
              />
              <Button
                title="Return"
                onPress={handleReturn}
                color="#FF3B30"
              />
            </View>
            {showHall8 ? (
              <Hall8Map path={path} style={styles.map} />
            ) : (
              <Hall9Map path={path} style={styles.map} />
            )}
          </>
        ) : (
          <IndoorSearch nodes={nodes} onSearch={handleSearch} />
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
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  map: {
    width: "100%",
    height: "80%",
  },
});

export default IndoorMapScreen;