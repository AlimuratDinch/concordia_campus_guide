import React from 'react';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

interface Props {
  initialRegion: Region;
}

const MapComponent: React.FC<Props> = ({ initialRegion }) => {
  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsPointsOfInterest={true}
        showsUserLocation={true}
        showsMyLocationButton={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapComponent;
