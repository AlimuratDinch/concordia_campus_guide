import React from 'react';
import { render } from '@testing-library/react-native';
import CampusMap from '../../app/CampusMap';

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const MockMapView = (props: any) => React.createElement('MockMapView', { testID: 'map', ...props }, props.children);
  const MockMarker = (props: any) => React.createElement('MockMarker', { testID: 'marker', ...props });
  const MockPolygon = (props: any) => React.createElement('MockPolygon', { testID: 'polygon', ...props });
  
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Polygon: MockPolygon,
    PROVIDER_GOOGLE: 'PROVIDER_GOOGLE',
  };
});

// Mock building data
jest.mock('../../app/utils/useBuildings', () => ({
  useBuildings: jest.fn(() => [
    {
      BuildingName: 'Hall Building',
      'Building Long Name': 'Henry F. Hall Building',
      Address: '1455 De Maisonneuve Blvd. W.',
      Latitude_Longitude_Points: '45.497,-73.578;45.498,-73.578;45.498,-73.579;45.497,-73.579',
      color: 'red',
      strokeColor: 'black',
    }
  ]),
}));

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(),
  LocationObject: {},
  LocationAccuracy: {
    Balanced: 3
  },
}));

describe('Set Current Building as Start Feature', () => {
  it('renders the "Set Current Building as Start" button', () => {
    const { getByText } = render(<CampusMap />);
    const button = getByText('Set Current Building as Start');
    expect(button).toBeTruthy();
  });
});
