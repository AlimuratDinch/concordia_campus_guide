import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import Schedule from "../../app/schedule";

jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: {
    signInSilently: jest.fn().mockResolvedValue({}),
    getTokens: jest.fn().mockResolvedValue({ accessToken: "mock_access_token" }),
  },
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        items: [
          {
            id: "1",
            summary: "Test Event",
            start: { dateTime: new Date().toISOString() },
            end: { dateTime: new Date().toISOString() },
          },
        ],
      }),
  })
) as jest.Mock;

describe("Schedule Component", () => {
  it("fetches and displays event data", async () => {
    const { findByText } = render(<Schedule />);

    const eventText = await waitFor(() => findByText("Test Event"));

    expect(eventText).toBeTruthy();
  });

  it("handles event click to show alert", async () => {
    const { findByText } = render(<Schedule />);

    const eventElement = await waitFor(() => findByText("Test Event"));
    fireEvent.press(eventElement);
  });
});
