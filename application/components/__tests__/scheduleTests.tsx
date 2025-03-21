import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import Schedule from "../../app/schedule";
import { Alert } from "react-native";

jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: {
    signInSilently: jest.fn(() =>
      Promise.resolve({ user: { email: "testuser@gmail.com" } })
    ),
    getTokens: jest.fn(() =>
      Promise.resolve({ accessToken: "mock-access-token" })
    ),
  },
}));

// Mock global fetch for API call
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({
        items: [
          {
            id: "1",
            summary: "Test Event",
            start: { dateTime: "2025-03-17T10:00:00Z" },
            end: { dateTime: "2025-03-17T11:00:00Z" },
            location: "Online",
          },
        ],
      }),
  })
) as jest.Mock;

describe("Schedule Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", async () => {
    const { getByText } = render(<Schedule />);
    
    await waitFor(() => {
      expect(
        getByText(new Date().toLocaleDateString("en-US", { month: "long" }))
      ).toBeTruthy();
    });
  });

  it("fetches and displays event data", async () => {
    const { findByText } = render(<Schedule />);
    
    await waitFor(() => {
      expect(findByText("Test Event")).toBeTruthy();
    });
  });

  it("handles event click to show alert", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    const { findByText } = render(<Schedule />);
    
    const eventElement = await waitFor(() => findByText("Test Event"));

    fireEvent.press(eventElement);
    
    expect(alertSpy).toHaveBeenCalledWith("Event Details", expect.stringContaining("Test Event"));
  });

  it("displays time slots", async () => {
    const { getByText } = render(<Schedule />);
    
    await waitFor(() => {
      ["8:00", "8:30", "9:00", "9:30", "10:00"].forEach((time) => {
        expect(getByText(time)).toBeTruthy();
      });
    });
  });
});
