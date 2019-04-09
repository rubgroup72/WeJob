import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import LocationPage from './Pages/LocationPage';
import CameraPage from './Pages/CameraPage';
import PushNotPage from './Pages/PushNotPage';
import { ThemeProvider } from 'react-native-material-ui';
// import FaceBookPage from  './Pages/FaceBookPage';


class App extends React.Component {
  render() {
    return (
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    );
  }
}



const AppNavigator = createStackNavigator(
  {
    Login: LoginPage,
    Home: HomePage,
    Location:LocationPage,
    Camera:CameraPage,
    Push:PushNotPage,
    // faceBook:faceBookPage
  },
  {
    initialRouteName: 'Login',
  }
);

export default createAppContainer(AppNavigator);
