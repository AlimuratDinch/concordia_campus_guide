jest.mock('react-native-webview', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    
    // mock of WebView
    const MockWebView = (props: any) => {
      return React.createElement(View, props, [
        React.createElement(Text, { key: 'mockWebViewText' }, 'Mock WebView')
      ]);
    };
  
    return {
      WebView: MockWebView
    };
  });
  
  import React from 'react';
  import { render } from '@testing-library/react-native';
  import ShuttleMap from '../../app/shuttleMap';
  
  describe('ShuttleMap', () => {
    it('renders a mock WebView', () => {
      const { getByText } = render(<ShuttleMap />);
      // confirm mocked text is there
      expect(getByText('Mock WebView')).toBeTruthy();
    });
  });
  