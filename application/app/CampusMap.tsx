import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Alert } from "react-native";
import MapView, { Polygon, PROVIDER_GOOGLE, Marker, Circle } from "react-native-maps";
import { supabase } from "./lib/supabase";
import * as Location from "expo-location";


export default function CampusMap() {
  const [showPopup, setShowPopup] = useState(false);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  const [showUserLocation, setShowUserLocation] = useState<boolean>(true);

  useEffect(() => {
    const fetchBuildings = async () => {
      console.log("Fetching buildings...");

      let { data, error } = await supabase.from("buildings").select("*");

      if (error) {
        Alert.alert("Error fetching data");
        return;
      }

      console.log(data);
      setBuildings(data ?? []);
    };

    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "We need location permissions to show your location.");
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      console.log(userLocation); // Just logging the location for now
    };

    fetchBuildings();
    getLocationPermission();
  }, []);

  const handlePolygonPress = (building: any) => {
    setSelectedBuilding(building);
    setShowPopup(true);
  };

  const toggleUserLocation = () => {
    setShowUserLocation(!showUserLocation);
  };

  const mapRef = useRef<MapView>(null);
  const [selectedCampus, setSelectedCampus] = useState("SGW");
  const switchCampuses = (campus: string) => {
    setSelectedCampus(campus);
    const region = 
        campus === "SGW"
            ? {
                latitude: 45.4978,
                longitude: -73.5795,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }
            : {
                latitude: 45.45789,
                longitude: -73.63996,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
    if (mapRef.current) {
        mapRef.current.animateToRegion(region, 1000);
    }
    return () => {};
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
         initialRegion={{
          latitude: 45.4978,
          longitude: -73.5795,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={showUserLocation} // Show user location on map
        followsUserLocation={false} // Don't follow user location (won't center or move)
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
              fillColor={building.color}
              strokeColor={building.strokeColor}
              strokeWidth={2}
              tappable={true}
              onPress={() => handlePolygonPress(building)}
            />
          );
        })}
      </MapView>

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

    <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.toggleButton, selectedCampus === "SGW" && styles.selectedCampus]} onPress={() => switchCampuses("SGW")}>
            <Text style={[
              styles.toggleButtonText,
              selectedCampus === "SGW" && styles.selectedButtonText,
            ]}>SGW</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toggleButton} onPress={toggleUserLocation}>
            <Text style={styles.toggleButtonText}>
            {showUserLocation ? "Hide My Location" : "Show My Location"}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.toggleButton, selectedCampus === "LOY" && styles.selectedCampus]} onPress={() => switchCampuses("LOY")}>
            <Text style={[
              styles.toggleButtonText,
              selectedCampus === "LOY" && styles.selectedButtonText,
            ]}>LOY</Text>
        </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
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
    backgroundColor: "#912338",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonContainer: {
      position: "absolute",
      bottom: 20,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      paddingHorizontal: 20,
  },
  toggleButton: {
      backgroundColor: "#912338",
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
      borderWidth: 4,
      borderColor: "#912338",
  },
  toggleButtonText: {
      color: "white",
      fontSize: 14,
      fontWeight: "bold",
  },
  selectedCampus: {
      backgroundColor: "#FFF",
      borderWidth: 4,
      borderColor: "#912338",
  },
  selectedButtonText: {
      color: "#912338",
  },
});

