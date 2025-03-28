import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import ConcordiaApp from '../../app/application';
import { router } from 'expo-router';
import { Linking } from 'react-native';

//mock router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

//mock icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    Ionicons: ({ name }: any) => React.createElement('Ionicons', { name }),
  };
});

//mock schedule component
jest.mock('../../app/schedule', () => () => null);





describe('ConcordiaApp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Home tab by default', () => {
    render(<ConcordiaApp />);
    expect(screen.getByText('Featured News')).toBeTruthy();
    expect(screen.getByText('Featured Events')).toBeTruthy();
  });

  it('displays Concordia logo image', () => {
    render(<ConcordiaApp />);
    const logoImage = screen.getByTestId('concordia-logo');
    expect(logoImage.props.resizeMode).toBe('contain');
  });

  it('verifies news item links are correct', () => {
    render(<ConcordiaApp />);
    const newsItem = screen.getByText(/Concordia University will showcase/i);
    const pressable = findPressableParent(newsItem);
    expect(pressable?.props.onPress.toString()).toContain('acfas-2025');
  });

  it('verifies Featured Event link is correct', () => {
    render(<ConcordiaApp />);
    const eventItem = screen.getByText(/Explore Montréal: Underground city tour/i);
  
    const pressable = findPressableParent(eventItem);

    expect(pressable?.props.onPress.toString()).toContain(
      'explore-montreal--underground-city-tour.html'
    );
  });

  it('verifies feedback button has correct URL', () => {
    render(<ConcordiaApp />);
    const feedbackButton = screen.getByText('📝 Share your feedback');
    const pressable = findPressableParent(feedbackButton);
    expect(pressable?.props.onPress.toString()).toContain('google.com/forms');
  });

  it('renders all SGW campus items', () => {
    render(<ConcordiaApp />);
    fireEvent.press(screen.getByTestId('tab-campus'));
    
    expect(screen.getByText('Sir George Williams Campus')).toBeTruthy();
    expect(screen.getAllByText(/SGW Campus map/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/SGW buildings \(WIP\)/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Parking map \(WIP\)/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Bike rack map \(WIP\)/).length).toBeGreaterThan(0);
  });

  it('renders all Loyola campus items', () => {
    render(<ConcordiaApp />);
    fireEvent.press(screen.getByTestId('tab-campus'));
    
    expect(screen.getByText('Loyola Campus')).toBeTruthy();
    expect(screen.getAllByText(/LOY Campus map/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/LOY buildings \(WIP\)/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Parking map \(WIP\)/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Bike rack map \(WIP\)/).length).toBeGreaterThan(0);
  });

  it('handles WIP button presses', () => {
    render(<ConcordiaApp />);
    fireEvent.press(screen.getByTestId('tab-campus'));

    fireEvent.press(screen.getAllByText('SGW buildings (WIP)')[0]);
    fireEvent.press(screen.getAllByText('Parking map (WIP)')[0]);
    fireEvent.press(screen.getAllByText('Bike rack map (WIP)')[0]);
    
    expect(router.push).toHaveBeenCalledTimes(3);
  });

  it('navigates to /CampusMap when pressing SGW Campus map', () => {
    render(<ConcordiaApp />);
    fireEvent.press(screen.getByTestId('tab-campus'));
    
    fireEvent.press(screen.getByText('SGW Campus map'));
    expect(router.push).toHaveBeenCalledWith('/CampusMap');
  });

  it('navigates to /CampusMap when pressing LOY Campus map', () => {
    render(<ConcordiaApp />);
    fireEvent.press(screen.getByTestId('tab-campus'));

    fireEvent.press(screen.getByText('LOY Campus map'));
    expect(router.push).toHaveBeenCalledWith('/CampusMap');
  });

  it('handles shuttle bus button presses', () => {
    render(<ConcordiaApp />);
    fireEvent.press(screen.getByTestId('tab-campus'));

    fireEvent.press(screen.getByText('Shuttle schedule (WIP)'));
    fireEvent.press(screen.getByText('Shuttle tracker (WIP)'));
    //both items just do router.push('/') in code (NEEDS TO BE CHANGED ONCE IMPLEMENTED IN CODE or REMOVED)
    expect(router.push).toHaveBeenCalledTimes(2);
  });

  it('goes to Home tab when Home button is pressed', () => {
    render(<ConcordiaApp />);
    //navigate away from home first
    fireEvent.press(screen.getByTestId('tab-campus'));
    expect(screen.getByText('Sir George Williams Campus')).toBeTruthy();

    //then go back to Home
    fireEvent.press(screen.getByTestId('tab-home'));
    expect(screen.getByText('Featured News')).toBeTruthy();
    expect(screen.getByText('Featured Events')).toBeTruthy();
  });

  it('goes to Schedule tab when Schedule button is pressed', () => {
    render(<ConcordiaApp />);
    expect(screen.getByText('Featured News')).toBeTruthy();

    fireEvent.press(screen.getByTestId('tab-schedule'));
    //the schedule is mocked as null, so main home content should disappear
    expect(screen.queryByText('Featured News')).toBeNull();
  });

  //
  //test error handling if Linking fails
  //   
  it('logs an error when handleBoxClick fails', async () => {
    //spy on console.error
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
  
    //mock Linking.openURL to reject
    jest.spyOn(require('react-native').Linking, 'openURL')
        .mockRejectedValueOnce(new Error('Linking failed'));
  
    render(<ConcordiaApp />);
  
    //press news item
    fireEvent.press(screen.getByText(/Concordia University will showcase/i));
  
    //wait next tick or flush microtasks
    await new Promise(setImmediate);
  
    expect(errorSpy).toHaveBeenCalledWith('Failed to open URL:', expect.any(Error));
  
    //clean up
    errorSpy.mockRestore();
    jest.restoreAllMocks();
  });
});

it('logs an error when handleFeedbackClick fails', async () => {
    //spy console.error to verify call
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    //mock Linking.openURL to reject with error
    jest.spyOn(Linking, 'openURL').mockRejectedValueOnce(
      new Error('Linking failed')
    );
  
    render(<ConcordiaApp />);
  
    //press "Share your feedback" button
    fireEvent.press(screen.getByText('📝 Share your feedback'));
  
    //wait for promises to resolve or reject
    await new Promise(setImmediate);
  
    //verify that console.error was called with expected message
    expect(errorSpy).toHaveBeenCalledWith(
      'Failed to open URL:',
      expect.any(Error)
    );
  
    //cleanup
    errorSpy.mockRestore();
    jest.restoreAllMocks();
  });

//helper function to climb up the parent chain looking for onPress
function findPressableParent(element: any, depth = 0): any {
  if (!element || depth > 5) return null;
  if (element.props?.onPress) return element;
  return findPressableParent(element.parent, depth + 1);
}
