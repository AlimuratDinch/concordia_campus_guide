import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Alert } from "react-native";
import MapView, { Polygon, PROVIDER_GOOGLE, Marker, Circle } from "react-native-maps";
import { supabase } from "./lib/supabase";
import * as Location from "expo-location";
import SearchBar from './components/SearchBar';

/** Building interface */
interface Building {
  BuildingName: string;
  "Building Long Name": string;
  Address: string;
  Latitude_Longitude_Points: string;
  color: string;
  strokeColor: string;
}

export default function Loyola_Map() {
  const [showPopup, setShowPopup] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [showUserLocation, setShowUserLocation] = useState<boolean>(true);
  const [startBuilding, setStartBuilding] = useState<Building | null>(null);
  const [destinationBuilding, setDestinationBuilding] = useState<Building | null>(null);

  const mapRef = useRef<MapView>(null);

  // Get building names for search
  const buildingNames = buildings.map(building => building.BuildingName);

  // Function to center map on a building
  const centerMapOnBuilding = (building: Building) => {
    try {
      const points = building.Latitude_Longitude_Points.split(';');
      if (points.length > 0) {
        const [lat, lng] = points[0].split(',').map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          console.log('Centering map on:', lat, lng);
          mapRef.current?.animateToRegion(
            {
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            },
            500
          );
        }
      }
    } catch (error) {
      console.error('Error centering map:', error);
    }
  };

  // Handle search selection
  const handleSearchSelect = (selectedName: string) => {
    const building = buildings.find(b => b.BuildingName === selectedName);
    if (building) {
      setSelectedBuilding(building);
      setShowPopup(true);
    }
  };

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

  const handlePolygonPress = (building: Building) => {
    setSelectedBuilding(building);
    setShowPopup(true);
  };

  const toggleUserLocation = () => {
    setShowUserLocation(!showUserLocation);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 45.458225,
          longitude: -73.640331,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={showUserLocation}
      >
        {buildings.map((building, index) => {
          const coords = building.Latitude_Longitude_Points.split(";").map((point) => {
            const [lat, lng] = point.split(",").map(Number);
            return { latitude: lat, longitude: lng };
          });

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
            coordinate={{
              latitude: parseFloat(startBuilding.Latitude_Longitude_Points.split(';')[0].split(',')[0]),
              longitude: parseFloat(startBuilding.Latitude_Longitude_Points.split(';')[0].split(',')[1]),
            }}
            title="Start"
            pinColor="green"
          />
        )}

        {/* Marker for Destination Building */}
        {destinationBuilding && (
          <Marker
            coordinate={{
              latitude: parseFloat(destinationBuilding.Latitude_Longitude_Points.split(';')[0].split(',')[0]),
              longitude: parseFloat(destinationBuilding.Latitude_Longitude_Points.split(';')[0].split(',')[1]),
            }}
            title="Destination"
            pinColor="red"
          />
        )}
      </MapView>

      <View style={styles.searchContainer}>
        <SearchBar
          data={buildingNames}
          onSelect={handleSearchSelect}
          placeholder="Search buildings..."
          style={styles.searchBar}
        />
      </View>

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

      <TouchableOpacity style={styles.toggleButton} onPress={toggleUserLocation}>
        <Text style={styles.toggleButtonText}>
          {showUserLocation ? "Hide My Location" : "Show My Location"}
        </Text>
      </TouchableOpacity>
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
  searchContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  searchBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  toggleButton: {
    position: "absolute",
    bottom: 20,
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
});
