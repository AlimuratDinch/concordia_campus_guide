import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Linking } from 'react-native';
import CampusMap from '../../app/CampusMap';

// Mock building data
jest.mock('../../app/utils/useBuildings', () => ({
  useBuildings: jest.fn(() => [
    {
      BuildingName: 'Start Building',
      'Building Long Name': 'Start Building Long',
      Address: '123 Start St.',
      Latitude_Longitude_Points: '[(1,1)]',
      color: 'red',
      strokeColor: 'black',
    },
    {
      BuildingName: 'Destination Building',
      'Building Long Name': 'Destination Building Long',
      Address: '456 Dest Ave.',
      Latitude_Longitude_Points: '[(2,2)]',
      color: 'blue',
      strokeColor: 'black',
    },
  ]),
}));

//Mock for live user location
jest.mock("expo-location", () => ({
    requestForegroundPermissionsAsync: jest.fn(() =>
        Promise.resolve({ status: "granted" })
    ),
}));

// Mock react-native-maps to avoid native module issues in testing
jest.mock('react-native-maps', () => {
  return {
    __esModule: true,
    default: 'MapView',
    Marker: 'Marker',
    Polygon: 'Polygon',
    PROVIDER_GOOGLE: 'PROVIDER_GOOGLE',
  };
});

describe('CampusMap', () => {
  it('renders without crashing (snapshot)', () => {
    const { toJSON } = render(<CampusMap />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('displays the search bar', () => {
    const { getByPlaceholderText } = render(<CampusMap />);
    expect(getByPlaceholderText('Search buildings...')).toBeTruthy();
  });

  it('toggles user location visibility when button is pressed', async () => {
    const { getByText } = render(<CampusMap />);

    // Initially should show "Hide My Location"
    const toggleButton = getByText('Hide My Location');
    expect(toggleButton).toBeTruthy();

    // Press button -> should change to "Show My Location"
    fireEvent.press(toggleButton);

    await waitFor(() => {
      expect(getByText('Show My Location')).toBeTruthy();
    });
  });

  it('opens the popup when the first polygon is pressed', async () => {
    const { getByText, getByTestId } = render(<CampusMap />);

    // Press the first polygon (testID="polygon-0")
    const firstPolygon = getByTestId('polygon-0');
    fireEvent.press(firstPolygon);

    // The popup should show text about the "Start Building"
    await waitFor(() => {
      expect(getByText('Start Building')).toBeTruthy();
    });
  });

  it('sets the selected building as start building', async () => {
    const { getByText, getAllByTestId } = render(<CampusMap />);

    // Tap the first polygon (which is the Start Building)
    const polygons = getAllByTestId(/polygon-/);
    fireEvent.press(polygons[0]);

    // Our popup button text is "Set as Start"
    const setStartButton = getByText('Set as Start');
    fireEvent.press(setStartButton);

    // "Navigate" button should NOT appear yet (destination not set)
    await waitFor(() => {
      expect(() => getByText('Navigate')).toThrow();
    });
  });

  it('shows "Navigate" button once start & destination are set', async () => {
    const { getAllByTestId, getByText } = render(<CampusMap />);

    // Two polygons: polygon-0 (Start), polygon-1 (Destination)
    const polygons = getAllByTestId(/polygon-/);
    const startPolygon = polygons[0];
    const destinationPolygon = polygons[1];

    // Press first polygon => set as Start
    fireEvent.press(startPolygon);
    fireEvent.press(getByText('Set as Start'));

    // Press second polygon => set as Destination
    fireEvent.press(destinationPolygon);
    fireEvent.press(getByText('Set as Destination'));

    // Now we expect "Navigate" to appear
    await waitFor(() => {
      expect(getByText('Navigate')).toBeTruthy();
    });
  });

  it('launches Google Maps with correct URL', async () => {
    const openURLSpy = jest
      .spyOn(Linking, 'openURL')
      .mockImplementation(() => Promise.resolve());

    const { getAllByTestId, getByText } = render(<CampusMap />);

    // Press polygons to set start/destination
    const polygons = getAllByTestId(/polygon-/);
    fireEvent.press(polygons[0]); // Start
    fireEvent.press(getByText('Set as Start'));

    fireEvent.press(polygons[1]); // Destination
    fireEvent.press(getByText('Set as Destination'));

    const navigateButton = getByText('Navigate');
    fireEvent.press(navigateButton);

    await waitFor(() => {
      expect(openURLSpy).toHaveBeenCalled();
      const urlArg = openURLSpy.mock.calls[0][0];
      expect(urlArg).toContain('google.com/maps/dir/?api=1');
      expect(urlArg).toContain('origin=1,1');       // Start Building
      expect(urlArg).toContain('destination=2,2');  // Destination Building
    });

    openURLSpy.mockRestore();
  });
});


// to create new snapshot: npm test -- -u