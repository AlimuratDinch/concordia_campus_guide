import React from 'react';
import { render, screen } from '@testing-library/react-native';
import RootLayout from '../../app/_Layout';

// Mock the Stack component from expo-router
jest.mock('expo-router', () => ({
  Stack: jest.fn(({ children }) => <>{children}</>), // Mock Stack to simply render its children for testing
}));

it('should render the screens in the RootLayout', async () => {
  // Render the RootLayout component
  render(<RootLayout />);

  // Check that the screen titles appear in the document
  const campusMapHeader = screen.getByText('Campus map');
  const loginPageHeader = screen.getByText('Login');

  // Expect the headers to be rendered
  expect(campusMapHeader).toBeTruthy(); // Use `toBeTruthy()` to check for existence
  expect(loginPageHeader).toBeTruthy(); // Use `toBeTruthy()` to check for existence
});
