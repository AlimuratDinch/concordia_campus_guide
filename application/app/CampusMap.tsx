
import React, { useState, useEffect, useRef } from "react";

import {API_KEY} from '@env';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView,
} from "react-native";
import MapView, {
  Polygon,
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
} from "react-native-maps";

import SearchBar from "./components/SearchBar";
import BuildingPopup from "./components/BuildingPopup";
import {
  parseCoordinates,
  getCenterFromCoordinates,
  mapCoordinates,
  Coordinate,
} from "./utils/coordinateHelpers";
import { useBuildings } from "./utils/useBuildings";

interface Building {
  BuildingName: string;
  "Building Long Name": string;
  Address: string;
  Latitude_Longitude_Points: string;
  color: string;
  strokeColor: string;
}

export default function CampusMap() {
  // Basic state
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showUserLocation, setShowUserLocation] = useState<boolean>(true);

  // Start & Destination
  const [startBuilding, setStartBuilding] = useState<Building | null>(null);
  const [destinationBuilding, setDestinationBuilding] = useState<Building | null>(
    null
  );

  // Route & Directions states
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [navigationSteps, setNavigationSteps] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Retrieve building data
  const buildings = useBuildings();
  const buildingNames = buildings.map((b) => b.BuildingName);

  // Map reference
  const mapRef = useRef<MapView>(null);

  // Campus switching
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
  };

  // Center map on a building
  const centerMapOnBuilding = (building: Building) => {
    try {
      const points = building.Latitude_Longitude_Points.split(";");
      if (points.length > 0) {
        const [lat, lng] = points[0].split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
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
      console.error("Error centering map:", error);
    }
  };

  useEffect(() => {
    if (startBuilding) {
      centerMapOnBuilding(startBuilding);
    }
  }, [startBuilding]);

  // Toggle user location
  const toggleUserLocation = () => {
    setShowUserLocation(!showUserLocation);
  };

  // SearchBar selection
  const handleSearchSelect = (selectedName: string) => {
    const building = buildings.find((b) => b.BuildingName === selectedName);
    if (building) {
      setSelectedBuilding(building);
      setShowPopup(true);
    }
  };

  // Polygon press
  const handlePolygonPress = (building: Building) => {
    setSelectedBuilding(building);
    setShowPopup(true);
  };

  // Set building as start/destination
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
   * "Navigate" button - opens Google Maps externally
   */
  const handleNavigate = () => {
    if (!startBuilding || !destinationBuilding) return;

    const origin = getCenterFromCoordinates(
      parseCoordinates(startBuilding.Latitude_Longitude_Points)
    );
    const destination = getCenterFromCoordinates(
      parseCoordinates(destinationBuilding.Latitude_Longitude_Points)
    );

    if (!origin || !destination) {
      Alert.alert("Error", "Missing coordinates for navigation");
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;

    Linking.openURL(url).catch((err) =>
      Alert.alert("Error launching Google Maps", err.message)
    );
  };

  /**
   * "Directions" button - fetch in-app route & show dotted lines + steps
   */
  const handleDirections = async () => {
    if (!startBuilding || !destinationBuilding) {
      Alert.alert("Error", "Set both Start and Destination first");
      return;
    }

    const origin = getCenterFromCoordinates(
      parseCoordinates(startBuilding.Latitude_Longitude_Points)
    );
    const destination = getCenterFromCoordinates(
      parseCoordinates(destinationBuilding.Latitude_Longitude_Points)
    );

    if (!origin || !destination) {
      Alert.alert("Error", "Missing coordinates for route");
      return;
    }

    
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=walking&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        // Decode polyline
        const encodedPolyline = data.routes[0].overview_polyline.points;
        const decodedCoords = decodePolyline(encodedPolyline);
        setRouteCoordinates(decodedCoords);

        // Extract step-by-step instructions
      const steps = data.routes[0].legs[0].steps.map((step: any) =>
          step.html_instructions.replace(/<[^<>]*>/g, "")
      );
        setNavigationSteps(steps);
        setErrorMsg("");
      } else {
        setErrorMsg("Directions not available");
        Alert.alert("Error", "Directions not available");
      }
    } catch (error) {
      setErrorMsg("Error retrieving directions");
      Alert.alert("Error", "Error retrieving directions");
    }
  };

  // cancel my directions to navigate in my map
  const handleCancelNavigation = () => {
    setRouteCoordinates([]);
    setNavigationSteps([]);
    setErrorMsg("");
  };

  // Decode polyline from Google Directions response
  const decodePolyline = (encoded: string): Coordinate[] => {
    let points: Coordinate[] = [];
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  // Render each building polygon
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
        testID={`polygon-${index}`}
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
        {/* Render all buildings */}
        {buildings.map((building, index) => renderBuilding(building, index))}

        {/* Start Marker */}
        {startBuilding && (
          <Marker
            coordinate={getCenterFromCoordinates(
              mapCoordinates(startBuilding.Latitude_Longitude_Points)
            )!}
            pinColor="green"
            title="Start"
          />
        )}

        {/* Destination Marker */}
        {destinationBuilding && (
          <Marker
            coordinate={getCenterFromCoordinates(
              mapCoordinates(destinationBuilding.Latitude_Longitude_Points)
            )!}
            pinColor="red"
            title="Destination"
          />
        )}

        {/* Dotted polyline for in-app directions */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="blue"
            strokeWidth={3}
            lineDashPattern={[4, 4]}
          />
        )}
      </MapView>

      {/* SearchBar */}
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

      {/* Buttons at bottom */}
      <View style={stylesButtons.container}>
        <TouchableOpacity
          style={stylesButtons.hideLocationButton}
          onPress={toggleUserLocation}
        >
          <Text style={stylesButtons.hideLocationButtonText}>
            {showUserLocation ? "Hide My Location" : "Show My Location"}
          </Text>
        </TouchableOpacity>

        {/* Only show the Navigate + Directions buttons if we have both Start and Destination */}
        {startBuilding && destinationBuilding && (
          <View style={stylesButtons.buttonRow}>
            {/* Existing "Navigate" button (external Google Maps) */}
            <TouchableOpacity
              style={stylesButtons.navigateButton}
              onPress={handleNavigate}
            >
              <Text style={stylesButtons.navigateButtonText}>Navigate</Text>
            </TouchableOpacity>

            {/* New "Directions" button (in-app route) */}
            <TouchableOpacity
              style={stylesButtons.navigateButton}
              onPress={handleDirections}
            >
              <Text style={stylesButtons.navigateButtonText}>Directions</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Campus toggle */}
        <View style={stylesButtons.footer}>
          <TouchableOpacity
            style={[
              stylesButtons.toggleButton,
              selectedCampus === "SGW" && stylesButtons.selectedCampus,
            ]}
            onPress={() => switchCampuses("SGW")}
          >
            <Text
              style={[
                stylesButtons.toggleButtonText,
                selectedCampus === "SGW" && stylesButtons.selectedButtonText,
              ]}
            >
              SGW
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              stylesButtons.toggleButton,
              selectedCampus === "LOY" && stylesButtons.selectedCampus,
            ]}
            onPress={() => switchCampuses("LOY")}
          >
            <Text
              style={[
                stylesButtons.toggleButtonText,
                selectedCampus === "LOY" && stylesButtons.selectedButtonText,
              ]}
            >
              LOY
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Turn-by-turn instructions if we have steps */}
      {navigationSteps.length > 0 && (
        <View style={styles.navigationPanel}>
          {/* Cancel Navigation Button */}
          <TouchableOpacity
            style={styles.cancelNavigationButton}
            onPress={handleCancelNavigation}
          >
            <Text style={styles.cancelNavigationText}>Cancel Navigation</Text>
          </TouchableOpacity>

          <ScrollView>
            {navigationSteps.map((instruction, index) => (
              <Text key={index} style={styles.navigationStep}>
                {index + 1}. {instruction}
              </Text>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Display error message if any */}
      {errorMsg !== "" && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );
}

/**
 * STYLES
 */
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    position: "absolute",
    zIndex: 1,
    top: 12,
    left: 10,
    right: 10,
    width: "80%",
  },
  searchBar: {
    shadowColor: "#000",
    shadowRadius: 8,
    borderRadius: 8,
    elevation: 5,
    borderWidth: 1,
  },
  navigationPanel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    maxHeight: 200,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
  },
  navigationStep: {
    fontSize: 14,
    marginVertical: 2,
  },
  errorContainer: {
    position: "absolute",
    top: 70,
    alignSelf: "center",
    backgroundColor: "rgba(255,0,0,0.7)",
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  cancelNavigationButton: {
    alignSelf: "flex-end",
    backgroundColor: "#912338",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelNavigationText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
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
  buttonRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  navigateButton: {
    backgroundColor: "#912338",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 5,
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
