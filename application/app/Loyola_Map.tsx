import MapComponent from "@/components/MapComponent";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Region } from "react-native-maps";

export default function Loyola_Map() {
  const initialRegion: Region = {
    latitude: 45.45789,
    longitude: -73.63996,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapComponent initialRegion={initialRegion} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});