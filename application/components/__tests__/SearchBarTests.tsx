import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import SearchBar from '../../app/components/SearchBar';
describe('SearchBar', () => {
  const mockOnSelect = jest.fn();

  const mockData = ['Apple', 'Banana', 'Orange', 'Pineapple'];

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders without crashing', () => {
    render(<SearchBar data={mockData} onSelect={mockOnSelect} />);
    expect(screen.getByPlaceholderText('Search...')).toBeTruthy();
  });

  it('filters data based on search query', async () => {
    render(<SearchBar data={mockData} onSelect={mockOnSelect} />);

    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'Ap');

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeTruthy();
      expect(screen.getByText('Pineapple')).toBeTruthy();
    });

    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'B');

    await waitFor(() => {
      expect(screen.queryByText('Apple')).toBeNull();
      expect(screen.getByText('Banana')).toBeTruthy();
    });
  });

  it('shows dropdown when there are matching results', async () => {
    render(<SearchBar data={mockData} onSelect={mockOnSelect} />);

    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'Ap');

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeTruthy();
      expect(screen.getByText('Pineapple')).toBeTruthy();
    });
  });

  it('hides dropdown when search query is empty', async () => {
    render(<SearchBar data={mockData} onSelect={mockOnSelect} />);

    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'Ap');
    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeTruthy();
    });

    fireEvent.changeText(screen.getByPlaceholderText('Search...'), '');

    await waitFor(() => {
      expect(screen.queryByText('Apple')).toBeNull();
    });
  });

  it('calls onSelect with the selected item', async () => {
    render(<SearchBar data={mockData} onSelect={mockOnSelect} />);

    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'Ap');

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Apple'));

    expect(mockOnSelect).toHaveBeenCalledWith('Apple');
  });

  it('clears the search query after selecting an item', async () => {
    render(<SearchBar data={mockData} onSelect={mockOnSelect} />);

    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'Ap');
    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Apple'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search...').props.value).toBe('');
    });
  });
});
