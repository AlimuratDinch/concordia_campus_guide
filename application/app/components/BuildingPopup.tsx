// components/BuildingPopup.tsx

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";

// Define the Building interface (adjust properties as needed)
interface Building {
  BuildingName: string;
  "Building Long Name": string;
  Address: string;
}

// Define the props for the popup component
interface BuildingPopupProps {
  building: Building;
  onClose: () => void;
  onSetStart: () => void;
  onSetDestination: () => void;
}

const BuildingPopup: React.FC<BuildingPopupProps> = ({
  building,
  onClose,
  onSetStart,
  onSetDestination,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>{building.BuildingName}</Text>
            <Text style={styles.popupText}>
              {building["Building Long Name"]}
            </Text>
            <Text style={styles.popupText}>{building.Address}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={onSetStart}>
                <Text style={styles.buttonText}>Set as Start</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={onSetDestination}>
                <Text style={styles.buttonText}>Set as Destination</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#a33",
    marginBottom: 10,
  },
  popupText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#a33",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    width: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default BuildingPopup;
