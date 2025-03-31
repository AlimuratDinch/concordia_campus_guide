import React from 'react';
import { render } from '@testing-library/react-native';
import Hall9Map from "../../app/Hall9Map";

describe('Hall9Map Component', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<Hall9Map path={[]} />);
    expect(getByTestId('hall8map-svg')).toBeTruthy();
  });
});
