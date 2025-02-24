import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SignUpScreen from "../../app/SignUp";
import { router } from "expo-router";

jest.mock("expo-router", () => ({
    router: {
      push: jest.fn()
    },
  }));

describe("SignUpScreen", () => {
  it("renders the SignUp screen correctly", () => {
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);

    //check placeholders rendered
    expect(getByPlaceholderText("Netname")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();

    //check button text rendered
    expect(getByText("Sign Up")).toBeTruthy();
  });

  it("updates state on text input", () => {
    const { getByPlaceholderText } = render(<SignUpScreen />);

    //simulate typing Netname
    fireEvent.changeText(getByPlaceholderText("Netname"), "testNetname");
    expect(getByPlaceholderText("Netname").props.value).toBe("testNetname");

    //simulate typing Email
    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    expect(getByPlaceholderText("Email").props.value).toBe("test@example.com");

    //simulate typing Password
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    expect(getByPlaceholderText("Password").props.value).toBe("password123");
  });

  it("navigates to login screen after successful sign up", async () => {
    const mockNavigation = { navigate: jest.fn() };
    const { getByPlaceholderText, getByText } = render(
      <SignUpScreen navigation={mockNavigation} />
    );

    //simulate filling form
    fireEvent.changeText(getByPlaceholderText("Netname"), "newUser");
    fireEvent.changeText(getByPlaceholderText("Email"), "user@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");

    //trigger sign-up process (TO BE REPLACED WITH ACTUAL SIGNUP LOGIC)
    fireEvent.press(getByText("Sign Up"));

    //check router.push call
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/");
    });
  });
});
