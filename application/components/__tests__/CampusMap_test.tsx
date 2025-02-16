import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import CampusMap from "../../app/CampusMap";

jest.mock("../../app/lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  },
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock("react-native-maps", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: View,
    PROVIDER_GOOGLE: "google",
    Polygon: View,
    Marker: View,
    Circle: View,
    animateToRegion: jest.fn(),
  };
});

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: "granted" })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({ coords: { latitude: 45.5, longitude: -73.6 } })),
}));

describe("CampusMap Component", () => {
  test("renders correctly", async () => {
    const { findByText } = render(<CampusMap />);
    await waitFor(() => expect(findByText("SGW")).resolves.toBeTruthy());
    await waitFor(() => expect(findByText("LOY")).resolves.toBeTruthy());
  });

  test("initial state values are set correctly", async () => {
    const { findByText } = render(<CampusMap />);
    await waitFor(() => expect(findByText("Hide My Location")).resolves.toBeTruthy());
  });

  test("toggle user location button updates state", async () => {
    const { findByText } = render(<CampusMap />);
    const button = await findByText("Hide My Location");

    await act(async () => {
      fireEvent.press(button);
    });

    expect(await findByText("Show My Location")).toBeTruthy();
  });
});
