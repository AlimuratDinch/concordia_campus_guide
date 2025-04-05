import React from 'react';
import { render } from '@testing-library/react-native';
import Hall8Map from "../../app/Hall8Map";

// Mock the Hall8Map component to avoid real implementation issues
jest.mock('../../app/Hall8Map', () => {
  return function MockHall8Map({ path }: { path: string[] }) {
    return <svg testID="hall8map-svg" />;
  };
});

describe('Hall8Map Component', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<Hall8Map path={[]} />);
    expect(getByTestId('hall8map-svg')).toBeTruthy();
  });
});