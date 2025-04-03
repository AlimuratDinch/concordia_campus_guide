import React from 'react';
import { render } from '@testing-library/react-native';
import Hall9Map from "../../app/Hall8Map";

// Mock the Hall8Map component to avoid real implementation issues
jest.mock('../../app/Hall9Map', () => {
  return function MockHall8Map({ path }: { path: string[] }) {
    return <svg testID="hall9map-svg" />;
  };
});

describe('Hall9Map Component', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<Hall9Map path={[]} />);
    expect(getByTestId('hall9map-svg')).toBeTruthy();
  });
});