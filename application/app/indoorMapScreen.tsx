import React, { useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from "react-native";
import Hall8Map from "./Hall8Map";
import Hall9Map from "./Hall9Map";
import { PathFinder } from "./PathAlgorithmDev";
import IndoorSearch from "./IndoorSearch";
import { Rawnodes as nodes } from "./nodesData";

const IndoorMapScreen: React.FC = () => {
  const [showHall8, setShowHall8] = useState(true);
  const [path, setPath] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(false);

  const toggleHall = () => {
    setShowHall8((prev) => !prev);
  };

  const handleSearch = (startNode: string, endNode: string, travelType: string) => {
    const computedPath = PathFinder(startNode, endNode, travelType);
    if (computedPath) {
      setPath(computedPath);
      setShowMap(true);
      console.log("Computed Path:", computedPath);
    } else {
      setPath([]);
      setShowMap(false);
      console.log("No path found between", startNode, "and", endNode);
    }
  };

  const handleReturn = () => {
    setShowMap(false);
    setPath([]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {showMap ? (
          <>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonPrimary} onPress={toggleHall}>
                <Text style={styles.buttonText}>
                  Switch to Hall {showHall8 ? "9" : "8"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSecondary} onPress={handleReturn}>
                <Text style={styles.buttonText}>Return</Text>
              </TouchableOpacity>
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
    gap: 10,
  },
  buttonPrimary: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonSecondary: {
    backgroundColor: "#8A1538",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  map: {
    width: "100%",
    height: "80%",
  },
});

export default IndoorMapScreen;