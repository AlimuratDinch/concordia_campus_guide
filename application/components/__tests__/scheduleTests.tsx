import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import Schedule from "../../app/schedule";
import { Alert } from "react-native";

jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: {
    signInSilently: jest.fn().mockResolvedValue({}),
    getTokens: jest.fn().mockResolvedValue({ accessToken: "mock_access_token" }),
  },
}));

// Calculate a date within the current week to match the component's filter
const today = new Date();
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
const eventDate = new Date(startOfWeek); // Use Monday of the current week

const mockEvents = {
  items: [
    {
      id: "1",
      summary: "Test Event",
      start: { dateTime: eventDate.toISOString() },
      end: { dateTime: new Date(eventDate.getTime() + 30 * 60 * 1000).toISOString() }, // 30 minutes later
    },
  ],
};

// Mock fetch to return data for any URL
global.fetch = jest.fn((url) => {
  console.log("Mock fetch called with URL:", url);
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockEvents),
  });
}) as jest.Mock;

jest.spyOn(Alert, "alert");

describe("Schedule Component", () => {
  it("fetches and displays event data", async () => {
    const { findByText } = render(<Schedule />);
    const eventText = await waitFor(() => findByText("Test Event"), { timeout: 5000 });
    expect(eventText).toBeTruthy();
  });

  it("handles event click to show alert", async () => {
    const { findByText } = render(<Schedule />);
    const eventElement = await waitFor(() => findByText("Test Event"), { timeout: 5000 });
    fireEvent.press(eventElement);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Event Details",
      "Test Event\nNo location"
    );
  });
});