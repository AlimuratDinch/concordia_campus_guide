// components/__tests__/IndoorMapScreenTests.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import IndoorMapScreen from '../../app/indoorMapScreen';
import { PathFinder } from '../../app/PathAlgorithmDev';
import IndoorSearch from '../../app/IndoorSearch';

jest.mock('../../app/PathAlgorithmDev', () => ({
  PathFinder: jest.fn(),
}));

jest.mock('../../app/IndoorSearch', () => {
  return jest.fn(() => null); // Mock component
});

describe('IndoorMapScreen', () => {
  it('renders correctly and switches maps', () => {
    const { getByText } = render(<IndoorMapScreen />);
    expect(getByText('SWITCH TO HALL 9')).toBeTruthy();

    fireEvent.press(getByText('SWITCH TO HALL 9'));
    expect(getByText('SWITCH TO HALL 8')).toBeTruthy();
  });

  it('handles path search correctly', () => {
    const mockPath = ['A', 'B', 'C'];
    (PathFinder as jest.Mock).mockReturnValue(mockPath);

    const mockOnSearch = jest.fn();
    (IndoorSearch as jest.Mock).mockImplementation(({ onSearch }: { onSearch: (start: string, target: string, accessibility: string) => void }) => (
      <button onClick={() => onSearch('A', 'C', 'walking')} />
    ));

    const { getByRole } = render(<IndoorMapScreen />);
    fireEvent.press(getByRole('button'));
    expect(mockOnSearch).toHaveBeenCalledWith('A', 'C', 'walking');
  });

  it('handles invalid search inputs', () => {
    const mockOnSearch = jest.fn();
    (IndoorSearch as jest.Mock).mockImplementation(({ onSearch }: { onSearch: (start: string | null, target: string, accessibility: string) => void }) => (
      <button onClick={() => onSearch(null, 'C', 'walking')} />
    ));

    const { getByRole } = render(<IndoorMapScreen />);
    fireEvent.press(getByRole('button'));
    expect(mockOnSearch).toHaveBeenCalledWith(null, 'C', 'walking');
  });
});