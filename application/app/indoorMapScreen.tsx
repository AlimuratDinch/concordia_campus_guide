import React, { useState } from "react";
import { StyleSheet, Button, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Hall8Map from "./Hall8Map";
import Hall9Map from "./Hall9Map";

const IndoorMapScreen = () => {
  const [showHall8, setShowHall8] = useState(true);

  const toggleMap = () => {
    setShowHall8(!showHall8);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
            title={`Switch to Hall ${showHall8 ? '9' : '8'}`.toUpperCase()} // Switches between Hall 8 and Hall 9
            onPress={toggleMap}
          />
        </View>
        {showHall8 ? <Hall8Map /> : <Hall9Map />}
      </View>
    </SafeAreaView>
  );
};

export default IndoorMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60, // Increased padding to ensure button doesn't overlap map
  },
  buttonContainer: {
    position: "absolute",
    top: 20,
    zIndex: 1,
  },
});