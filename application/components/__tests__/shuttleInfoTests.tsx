import React from 'react';
import { render, within } from '@testing-library/react-native';
import ShuttleInfo from '../../app/shuttleInfo';

describe('ShuttleInfo Component', () => {
  it('renders the main title', () => {
    const { getByText } = render(<ShuttleInfo />);
    expect(getByText('Concordia Shuttle Bus')).toBeTruthy();
  });

  it('renders Bus Stops', () => {
    const { getByText } = render(<ShuttleInfo />);
    expect(getByText('Bus Stops')).toBeTruthy();
    //check part from Bus Stops section
    expect(getByText(/Henry F. Hall Building/i)).toBeTruthy();
  });

  it('renders Monday – Thursday departures', () => {
    //render component
    const { getByTestId } = render(<ShuttleInfo />);

    //grab day block by testID
    const monThuBlock = getByTestId('monday-thursday-block');

    //query within block to avoid collisions
    const { getByText: getByTextWithin } = within(monThuBlock);

    //check random times from MTHURS_LOY or MTHURS_SGW
    expect(getByTextWithin('9:15 AM')).toBeTruthy();
    expect(getByTextWithin('4:30 PM')).toBeTruthy();
  });

  //same logic as before but for the Friday block
  it('renders Friday departures', () => {
    const { getByTestId } = render(<ShuttleInfo />);
    const fridayBlock = getByTestId('friday-block');
    const { getByText: getByTextWithin } = within(fridayBlock);

    expect(getByTextWithin('9:15 AM')).toBeTruthy();
    expect(getByTextWithin('4:00 PM')).toBeTruthy();
  });

  //check regulation block
  it('renders the Regulations card', () => {
    const { getByText } = render(<ShuttleInfo />);
    expect(getByText('Regulations')).toBeTruthy();
    expect(getByText(/Must show valid Concordia ID/i)).toBeTruthy();
  });
});
