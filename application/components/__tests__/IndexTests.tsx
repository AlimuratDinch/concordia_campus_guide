import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import Login from '../../app/index';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock("@microsoft/react-native-clarity", () => ({
  initialize: jest.fn(),
}));

describe('Login', () => {
  it('renders correctly', () => {
    //check placeholders rendered
    const { getByPlaceholderText, getByText } = render(<Login />);
    expect(getByPlaceholderText('Netname')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('does not navigate when incorrect credentials are entered', async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);
    
    //simulate incorrect credentials
    fireEvent.changeText(getByPlaceholderText('Netname'), 'wrongNetname');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongPassword');
    
    //simulate press sign in button
    fireEvent.press(getByText('Sign In'));
    
    //check router.push call
    await waitFor(() => {expect(router.push).not.toHaveBeenCalled();});
  });

  it('navigates to menu on correct credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);
    
    //simulate entering ADMIN credentials
    fireEvent.changeText(getByPlaceholderText('Netname'), 'ADMIN');
    fireEvent.changeText(getByPlaceholderText('Password'), 'ADMIN');
    
    //simulate press sign in button
    fireEvent.press(getByText('Sign In'));
    
    //check router.push call
    await waitFor(() => {expect(router.push).toHaveBeenCalledWith('/menu');});
  });

  it("navigates to the signup screen when 'New student? Activate your account' is pressed", async () => {
      const { getByText } = render(<Login />);
  
      //check 'Already have an account? Sign In' text
      const signUpButton = getByText("New student? Activate your account");
  
      //simulate press on link
      fireEvent.press(signUpButton);
  
      //check router.push call
      await waitFor(() => {
        expect(router.push).toHaveBeenCalledWith("/SignUp");
      });
});
});
