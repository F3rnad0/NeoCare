import React from 'react';
import AppNavigator from './components/AppNavigator';
import { AppProvider } from './components/AppContext';

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}
