import React from 'react';
import { View, Text, Button } from 'react-native';
import { createAppContainer, createDrawerNavigator, createStackNavigator, StackActions, NavigationActions, I18nManager } from 'react-navigation';
import LogIn from './src/screens/LogIn';
import LoggedOut from './src/screens/LoggedOut';
import Register from './src/screens/Register';
import Departments from './src/screens/Departments';
import Main from './src/screens/Main';
import Languages from './src/screens/Languages';
import Global from './src/global';
import PersonalProfile from './src/screens/PersonlProfile';

const MainStack = createStackNavigator({
  Main: { screen: Main },
  Register: { screen: Register },
});
const profileStack = createStackNavigator({
  Profile: { screen: PersonalProfile }
}, {
  defaultNavigationOptions: {
    headerStyle: {
        backgroundColor: '#28F1A6',
        elevation: 0,
        shadowOpacity: 0
    },
    headerTitle: 'פרופיל אישי',
    headerTintColor: '#333333',
    headerTitleStyle: {
        fontWeight: 'bold',
        color: '#ffffff'
    }
}
});

const hiddenDrawerItems = [
  'Register',
]
const drawerNav = createDrawerNavigator({
  Home: { screen: MainStack, },
  'התחברות': { screen: LogIn, }, // sync with Global.js
  Departments: { screen: Departments, },
  Languages: { screen: Languages, },
  'פרופיל': { screen: profileStack },
}, {
    initialRouteName: 'Home',
    drawerPosition: 'right',
    drawerOpenRoute: 'DrawerRightOpen', 
    drawerCloseRoute: 'DrawerRightClose', 
    drawerToggleRoute: 'DrawerRightToggle',
    
});

const AppNavigator = createStackNavigator({
  RootScope: { screen: drawerNav }
},
  {
    headerMode: 'none',
  }
  );
  MainStack.navigationOptions = ({ navigation }) => {
    name = (navigation.state.index !== undefined ? navigation.state.routes[navigation.state.index] : navigation.state.routeName)
    let  drawerLockMode = 'locked-closed';
    if (name.routeName != 'Register') {
      drawerLockMode =  'unlocked';
    }
  return {
    drawerLockMode,
  };
};
export default createAppContainer(AppNavigator);