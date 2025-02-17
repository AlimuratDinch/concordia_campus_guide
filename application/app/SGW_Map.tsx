import React, { useState, useEffect, useRef } from "react";
import {StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Alert, Linking,} from "react-native";
import MapView, { Polygon, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import SearchBar from './components/SearchBar';
import BuildingPopup from "./components/BuildingPopup";
import { parseCoordinates, getCenterFromCoordinates, mapCoordinates, Coordinate } from "./utils/coordinateHelpers";
import { useBuildings } from './utils/useBuildings';

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
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showUserLocation, setShowUserLocation] = useState<boolean>(true);

  // Start & Destination
  const [startBuilding, setStartBuilding] = useState<Building | null>(null);
  const [destinationBuilding, setDestinationBuilding] = useState<Building | null>(
    null
  );

  // function to retreive the building
  const buildings = useBuildings();

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

  // Handle polygon press
  const handlePolygonPress = (building: Building) => {
    setSelectedBuilding(building);
    setShowPopup(true);
  };

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (startBuilding) {
      centerMapOnBuilding(startBuilding);
    }
  }, [startBuilding]);

 
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

    const origin = getCenterFromCoordinates(parseCoordinates(startBuilding.Latitude_Longitude_Points));
    const destination = getCenterFromCoordinates(parseCoordinates(destinationBuilding.Latitude_Longitude_Points));


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

  const renderBuilding = (building: Building, index: number) => {
    const coords = parseCoordinates(building.Latitude_Longitude_Points);
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
        testID={`polygon-${index}`}// for the test
      />
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 45.497222,
          longitude: -73.579056,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={showUserLocation}
      >
        {buildings.map((building, index) => renderBuilding(building, index))}

        {/* Marker for Start Building */}
        {startBuilding && (
          <Marker
            coordinate={getCenterFromCoordinates(mapCoordinates(startBuilding.Latitude_Longitude_Points))!}
            pinColor="green"
            title="Start"
          />
        )}

        {/* Marker for Destination Building */}
        {destinationBuilding && (
          <Marker
            coordinate={getCenterFromCoordinates(mapCoordinates(destinationBuilding.Latitude_Longitude_Points))!}
            pinColor="red"
            title="Destination"
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

      {/* Building Popup */}
      {showPopup && selectedBuilding && (
        <BuildingPopup
          building={selectedBuilding}
          onClose={() => setShowPopup(false)}
          onSetStart={handleSetStart}
          onSetDestination={handleSetDestination}
        />
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
  searchContainer: {
    position: 'absolute',
    top: 12,
    left: 10,
    right: 10,
    // zIndex: 1,
    width: '80%',
  },
  searchBar: {
    shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    shadowRadius: 8,
    borderRadius: 8,
    elevation: 5,
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
