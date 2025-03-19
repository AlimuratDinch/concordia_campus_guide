import React from "react";
import { render } from "@testing-library/react-native";
import RootLayout from "../RootLayout"; // Adjust path if needed
import { Stack } from "expo-router";

jest.mock("expo-router", () => ({
  Stack: jest.fn(({ children }) => <>{children}</>),
  StackScreen: jest.fn(({ children }) => <>{children}</>),
}));

describe("RootLayout", () => {
  it("renders the Stack with two screens", () => {
    const { getByText } = render(<RootLayout />);

    // Verify screen headers (titles)
    expect(getByText("Campus map")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
  });
});