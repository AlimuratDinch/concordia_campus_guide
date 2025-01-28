import MapComponent from "@/components/MapComponent";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Region } from "react-native-maps";

export default function SGW_Map() {
  const initialRegion: Region = {
    latitude: 45.496136,
    longitude: -73.577795,
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