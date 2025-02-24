import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import Index from "../../app/menu";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('Index Screen', () => {

  it('navigates to Campus Map when Campus Map button is pressed', async () => {
    const { getByText } = render(<Index />);
    
    //check placeholders rendered
    const campusMapButton = getByText('Campus Map');
    
    //simulate press on campus button
    fireEvent.press(campusMapButton);
    
    //check router.push call
    await waitFor(() => {expect(router.push).toHaveBeenCalledWith("/CampusMap");});
  });

});
