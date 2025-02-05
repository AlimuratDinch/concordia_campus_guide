import MapComponent from "@/components/MapComponent";
//import React from "react";
//import { StyleSheet, View } from "react-native";
import { Region } from "react-native-maps";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Alert } from "react-native";
import MapView, { Polygon, PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { supabase } from "./lib/supabase";


export default function Loyola_Map() {
  const [showPopup, setShowPopup] = useState(false);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      console.log("Fetching...");

      let { data, error } = await supabase.from("buildings").select("*");

      if (error) {
        Alert.alert("Error fetching data");
        return;
      }

      console.log(data);
      setBuildings(data ?? []);
    };

    fetchBuildings();
  }, []);

  const handlePolygonPress = (building: any) => {
    setSelectedBuilding(building);
    setShowPopup(true);
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 45.45789,
          longitude: -73.63996,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {buildings.map((building, index) => {
          let polygonCoordinates = [];

          try {
            polygonCoordinates = JSON.parse(
              building.Latitude_Longitude_Points.replace(/\(/g, "[").replace(/\)/g, "]")
            ).map(([latitude, longitude]: [number, number]) => ({
              latitude,
              longitude,
            }));
          } catch (error) {
            console.error("Error parsing coordinates for", building.BuildingName, error);
            return null;
          }

          return (
            <Polygon
              key={index}
              coordinates={polygonCoordinates}
              fillColor={building.color} // Dynamic fill color
              strokeColor={building.strokeColor} // Dynamic stroke color
              strokeWidth={2}
              tappable={true}
              onPress={() => handlePolygonPress(building)}
            />
          );
        })}
      </MapView>

      {/* Floating Popup Card */}
      {showPopup && selectedBuilding && (
        <TouchableWithoutFeedback onPress={() => setShowPopup(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.popupContainer}>
                <Text style={styles.popupTitle}>{selectedBuilding.BuildingName}</Text>
                <Text style={styles.popupText}>{selectedBuilding["Building Long Name"]}</Text>
                <Text style={styles.popupText}>{selectedBuilding.Address}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

///
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },//new 
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0,0,0,0.2)", // Optional dim effect
  justifyContent: "center",
  alignItems: "center",
},
  popupContainer: {
    position: "absolute",
    top: "30%",
    left: "10%",
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
  closeButton: {
    marginTop: 10,
    backgroundColor: "#f16c38",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },//new
});