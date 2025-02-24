// Set up a mock for the @env module
jest.mock('@env', () => ({
  API_KEY: 'DUMMY_API_KEY'
}));

declare global {
  namespace NodeJS {
    interface Global {
      API_KEY: string;
    }
  }
}

global.API_KEY = 'DUMMY_API_KEY';

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CampusMap from '../../app/CampusMap';

// Use the provided building data in our mock for useBuildings.
jest.mock('../../app/utils/useBuildings', () => ({
  useBuildings: jest.fn(() => [
    {
      id: 1,
      Campus: "SGW",
      Building: "B",
      BuildingName: "B Building",
      "Building Long Name": "B Annex",
      Address: "2160 Bishop Street",
      // Repeat the coordinate pair so that the component’s helper works
      Latitude_Longitude_Points: "45.497856,-73.579588;45.497856,-73.579588",
      color: "red",
      strokeColor: "black",
    },
    {
      id: 2,
      Campus: "SGW",
      Building: "H",
      BuildingName: "H Building",
      "Building Long Name": "Henry F. Hall Building",
      Address: "1455 DeMaisonneuve W",
      Latitude_Longitude_Points: "45.497092,-73.5788;45.497092,-73.5788",
      color: "blue",
      strokeColor: "black",
    },
  ]),
}));

// Mock react-native-maps so that native modules do not interfere with tests.
jest.mock('react-native-maps', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: 'MapView',
    Marker: 'Marker',
    Polygon: 'Polygon',
    Polyline: 'Polyline',
    PROVIDER_GOOGLE: 'PROVIDER_GOOGLE',
  };
});

describe('CampusMap Directions Feature', () => {
  it('shows the "Directions" button once both start and destination are set', async () => {
    const { getAllByTestId, getByText } = render(<CampusMap />);
    const polygons = getAllByTestId(/polygon-/);

    // Simulate selecting the first building as the start
    fireEvent.press(polygons[0]);
    fireEvent.press(getByText('Set as Start'));

    // Simulate selecting the second building as the destination
    fireEvent.press(polygons[1]);
    fireEvent.press(getByText('Set as Destination'));

    await waitFor(() => {
      expect(getByText('Directions')).toBeTruthy();
    });
  });

  it('fetches and displays in-app directions when "Directions" is pressed', async () => {
    // Mock a successful response from the Directions API.
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            status: "OK",
            routes: [
              {
                overview_polyline: { points: "a~l~Fjk~uOwHJy@P" },
                legs: [
                  {
                    steps: [
                      { html_instructions: "1. Turn left" },
                      { html_instructions: "Turn right" },
                    ],
                  },
                ],
              },
            ],
          }),
      })
    ) as jest.Mock;

    const { getAllByTestId, getByText } = render(<CampusMap />);
    const polygons = getAllByTestId(/polygon-/);

    // Set start and destination using our provided building data.
    fireEvent.press(polygons[0]);
    fireEvent.press(getByText('Set as Start'));
    fireEvent.press(polygons[1]);
    fireEvent.press(getByText('Set as Destination'));

    // Press the Directions button
    const directionsButton = getByText('Directions');
    expect(directionsButton).toBeTruthy();
    fireEvent.press(directionsButton);

    await waitFor(() => {
      // Check that the in-app instructions are rendered.
      expect(getByText(/1\. Turn left/)).toBeTruthy();
      // And that the "Cancel Navigation" button is rendered.
      expect(getByText('Cancel Navigation')).toBeTruthy();
    });
  });

  it('cancels in-app navigation when "Cancel Navigation" is pressed', async () => {
    // Mock a successful response from the Directions API.
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            status: "OK",
            routes: [
              {
                overview_polyline: { points: "a~l~Fjk~uOwHJy@P" },
                legs: [
                  {
                    steps: [
                      { html_instructions: "1. Turn left" },
                      { html_instructions: "Turn right" },
                    ],
                  },
                ],
              },
            ],
          }),
      })
    ) as jest.Mock;

    const { getAllByTestId, getByText, queryByText } = render(<CampusMap />);
    const polygons = getAllByTestId(/polygon-/);

    // Set start and destination
    fireEvent.press(polygons[0]);
    fireEvent.press(getByText('Set as Start'));
    fireEvent.press(polygons[1]);
    fireEvent.press(getByText('Set as Destination'));

    // Press the Directions button to display the route and instructions.
    fireEvent.press(getByText('Directions'));
    await waitFor(() => {
      expect(getByText(/1\. Turn left/)).toBeTruthy();
      expect(getByText('Cancel Navigation')).toBeTruthy();
    });

    // Press "Cancel Navigation" to clear the route/instructions.
    fireEvent.press(getByText('Cancel Navigation'));
    await waitFor(() => {
      expect(queryByText(/Turn left/)).toBeNull();
      expect(queryByText('Cancel Navigation')).toBeNull();
    });
  });
});
