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

export default function CampusMap() {
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

  useEffect(() => {
    if (startBuilding) {
      centerMapOnBuilding(startBuilding);
      getLocationPermission();
    }

  }, [startBuilding]);



const getLocationPermission = async () => {
    try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (!permission || !permission.status) {
            throw new Error("Location permission request failed");
        }

        if (permission.status !== "granted") {
            Alert.alert("Permission denied", "We need location permissions to show your location.");
            return;
        }
    } catch (error) {
        console.error("Error requesting location permission:", error);
    }
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
          latitude: 45.4978,
          longitude: -73.5795,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={showUserLocation}
        followsUserLocation={false}
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

      <View style={stylesButtons.container}>
        <TouchableOpacity style={stylesButtons.hideLocationButton} onPress={toggleUserLocation}>
          <Text style={stylesButtons.hideLocationButtonText}>
            {showUserLocation ? "Hide My Location" : "Show My Location"}
          </Text>
        </TouchableOpacity>

        { startBuilding && destinationBuilding && (
          <TouchableOpacity style={stylesButtons.navigateButton} onPress={handleNavigate}>
              <Text style={stylesButtons.navigateButtonText}>Navigate</Text>
          </TouchableOpacity>
        )}

        <View style={stylesButtons.footer}>
          <TouchableOpacity style={[stylesButtons.toggleButton, selectedCampus === "SGW" && stylesButtons.selectedCampus]} onPress={() => switchCampuses("SGW")}>
              <Text style={[
                stylesButtons.toggleButtonText,
                selectedCampus === "SGW" && stylesButtons.selectedButtonText,
              ]}>SGW</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[stylesButtons.toggleButton, selectedCampus === "LOY" && stylesButtons.selectedCampus]} onPress={() => switchCampuses("LOY")}>
              <Text style={[
                stylesButtons.toggleButtonText,
                selectedCampus === "LOY" && stylesButtons.selectedButtonText,
              ]}>LOY</Text>
          </TouchableOpacity>
        </View>
      </View>


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
    zIndex: 1,
    top: 12,
    left: 10,
    right: 10,
    width: '80%',
  },
  searchBar: {
    shadowColor: '#000',
    shadowRadius: 8,
    borderRadius: 8,
    elevation: 5,
    borderWidth: 1,
  },
});

const stylesButtons = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  hideLocationButton: {
    position: "absolute",
    top: 70,
    right: 10,
    width: 135,
    backgroundColor: "#912338",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: "center",
    alignItems: "center",
  },
  hideLocationButtonText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  navigateButton: {
    backgroundColor: "#912338",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: "center",
  },
  navigateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    width: "100%",
    borderTopWidth: 3,
    borderColor: "#912338",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#912338",
  },
  selectedCampus: {
    backgroundColor: "#912338",
  },
  selectedButtonText: {
    color: "#fff",
  },
});

