import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FeedbackPopUp from "../FeedbackPopUp";
import { Linking } from "react-native";

jest.mock("react-native/Libraries/Linking/Linking", () => ({
  openURL: jest.fn(),
}));

describe("FeedbackPopUp Component", () => {
  const mockOnClose = jest.fn();
  const googleFormUrl = "https://forms.gle/NFwW7AJbRAujc7EJ6";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the modal when visible is true", () => {
    const { getByText } = render(<FeedbackPopUp visible={true} onClose={mockOnClose} />);

    expect(getByText("We value your feedback!")).toBeTruthy();
    expect(getByText("Give Feedback")).toBeTruthy();
    expect(getByText("Close")).toBeTruthy();
  });

  it("calls Linking.openURL and onClose when 'Give Feedback' is pressed", () => {
    const { getByText } = render(<FeedbackPopUp visible={true} onClose={mockOnClose} />);
    const feedbackButton = getByText("Give Feedback");

    fireEvent.press(feedbackButton);

    expect(Linking.openURL).toHaveBeenCalledWith(googleFormUrl);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when 'Close' is pressed", () => {
    const { getByText } = render(<FeedbackPopUp visible={true} onClose={mockOnClose} />);
    const closeButton = getByText("Close");

    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not render the modal when visible is false", () => {
    const { queryByText } = render(<FeedbackPopUp visible={false} onClose={mockOnClose} />);

    expect(queryByText("We value your feedback!")).toBeNull();
  });
});
