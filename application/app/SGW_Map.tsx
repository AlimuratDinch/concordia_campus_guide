import React, { useState, useEffect } from "react";
import {StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Alert, Linking,} from "react-native";
import MapView, { Polygon, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { supabase } from "./lib/supabase";
import * as Location from "expo-location";

/** Define a coordinate interface */
interface Coordinate {
  latitude: number;
  longitude: number;
}

/** Building interface (customize as needed) */
interface Building {
  BuildingName: string;
  "Building Long Name": string;
  Address: string;
  Latitude_Longitude_Points: string;
  color: string;
  strokeColor: string;
}

export default function SGW_Map() {
  // State
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showUserLocation, setShowUserLocation] = useState<boolean>(true);

  // Start & Destination
  const [startBuilding, setStartBuilding] = useState<Building | null>(null);
  const [destinationBuilding, setDestinationBuilding] = useState<Building | null>(
    null
  );

  useEffect(() => {
    const fetchBuildings = async () => {
      console.log("Fetching buildings...");
      const { data, error } = await supabase.from("buildings").select("*");
      if (error) {
        Alert.alert("Error fetching data", error.message);
        return;
      }
      console.log("Buildings fetched:", data);
      setBuildings((data as Building[]) ?? []);
    };

    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "We need location permissions to show your location."
        );
        return;
      }
      const userLocation = await Location.getCurrentPositionAsync({});
      console.log("User location:", userLocation);
    };

    fetchBuildings();
    getLocationPermission();
  }, []);

  /**
   * Convert a building's coordinate string to an array of Coordinate.
   */
  const parseCoordinates = (building: Building): Coordinate[] => {
    try {
      return JSON.parse(
        building.Latitude_Longitude_Points.replace(/\(/g, "[").replace(/\)/g, "]")
      ).map(([latitude, longitude]: [number, number]) => ({
        latitude,
        longitude,
      }));
    } catch (error) {
      console.error("Error parsing coords for", building.BuildingName, error);
      return [];
    }
  };

  /**
   * Approximate building center by averaging the polygon's points.
   * Fix the reduce call by explicitly typing the accumulator as 'number'.
   */
  const getBuildingCenter = (building: Building | null) => {
    if (!building) return null;
    const coords = parseCoordinates(building);
    if (!coords.length) return null;

    const latSum = coords.reduce<number>((acc, c) => acc + c.latitude, 0);
    const lngSum = coords.reduce<number>((acc, c) => acc + c.longitude, 0);

    return {
      latitude: latSum / coords.length,
      longitude: lngSum / coords.length,
    };
  };

  // When user taps a polygon, show popup
  const handlePolygonPress = (building: Building) => {
    setSelectedBuilding(building);
    setShowPopup(true);
  };

  // Toggle user location on the map
  const toggleUserLocation = () => {
    setShowUserLocation(!showUserLocation);
  };

  // Assign building as start/destination
  const handleSetStart = () => {
    if (!selectedBuilding) return;
    setStartBuilding(selectedBuilding);
    setShowPopup(false);
  };

  const handleSetDestination = () => {
    if (!selectedBuilding) return;
    setDestinationBuilding(selectedBuilding);
    setShowPopup(false);
  };

  /**
   * Opens Google Maps externally for directions.
   */
  const handleNavigate = () => {
    if (!startBuilding || !destinationBuilding) return;

    const origin = getBuildingCenter(startBuilding);
    const destination = getBuildingCenter(destinationBuilding);

    if (!origin || !destination) {
      Alert.alert("Error", "Missing coordinates for navigation");
      return;
    }

    // Launch Google Maps in a browser/app
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;

    Linking.openURL(url).catch((err) =>
      Alert.alert("Error launching Google Maps", err.message)
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 45.4978,
          longitude: -73.5795,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={showUserLocation}
      >
        {buildings.map((building, index) => {
          const coords = parseCoordinates(building);
          if (!coords.length) return null;

          return (
            <Polygon
              key={index}
              coordinates={coords}
              fillColor={building.color}
              strokeColor={building.strokeColor}
              strokeWidth={2}
              tappable={true}
              onPress={() => handlePolygonPress(building)}
            />
          );
        })}

        {/* Marker for Start Building */}
        {startBuilding && (
          <Marker
            coordinate={getBuildingCenter(startBuilding)!}
            pinColor="green"
            title="Start"
          />
        )}

        {/* Marker for Destination Building */}
        {destinationBuilding && (
          <Marker
            coordinate={getBuildingCenter(destinationBuilding)!}
            pinColor="red"
            title="Destination"
          />
        )}
      </MapView>

      {/* Building Popup */}
      {showPopup && selectedBuilding && (
        <TouchableWithoutFeedback onPress={() => setShowPopup(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.popupContainer}>
                <Text style={styles.popupTitle}>{selectedBuilding.BuildingName}</Text>
                <Text style={styles.popupText}>
                  {selectedBuilding["Building Long Name"]}
                </Text>
                <Text style={styles.popupText}>{selectedBuilding.Address}</Text>

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.button} onPress={handleSetStart}>
                    <Text style={styles.buttonText}>Set as Start</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSetDestination}
                  >
                    <Text style={styles.buttonText}>Set as Destination</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Toggle user location */}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleUserLocation}>
        <Text style={styles.toggleButtonText}>
          {showUserLocation ? "Hide My Location" : "Show My Location"}
        </Text>
      </TouchableOpacity>

      {/* "Navigate" button if both start & destination selected */}
      {startBuilding && destinationBuilding && (
        <TouchableOpacity style={styles.navigateButton} onPress={handleNavigate}>
          <Text style={styles.navigateButtonText}>Navigate</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    alignItems: 'center',
    justifyContent: 'center',

  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  toggleButton: {
    position: "absolute",
    bottom: 80,
    left: "50%",
    transform: [{ translateX: -75 }],
    backgroundColor: "#912338",
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  toggleButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  navigateButton: {
    position: "absolute",
    bottom: 20,
    left: "42.5%",
    transform: [{ translateX: -45 }],
    backgroundColor: "#912338",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
    zIndex: 1,
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  navigateButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
