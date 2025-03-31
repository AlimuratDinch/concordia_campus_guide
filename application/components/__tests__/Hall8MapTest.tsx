import React from 'react';
import { render } from '@testing-library/react-native';
import Hall8Map from "../../app/Hall8Map";

describe('Hall8Map Component', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<Hall8Map path={[]} />);
    expect(getByTestId('hall8map-svg')).toBeTruthy();
  });
});
