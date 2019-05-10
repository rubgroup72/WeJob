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
import SubDepartments from './src/screens/SubDepartments';
import JobsCarousel from './src/screens/JobsCarousel';
import Category from './src/screens/Category';
import SubCategory from './src/screens/SubCategory';
import JobTitles from './src/screens/JobTitles';

const MainStack = createStackNavigator({
  Main: { screen: Main },
  Register: { screen: Register },
  LoggedOut: {screen: LoggedOut},
  JobsCarousel: { screen: JobsCarousel },
  LogIn: { screen: LogIn }
});


//יצירת תפריט עבור דף הפרופיל האישי
const profileStack = createStackNavigator({
  Profile: { screen: PersonalProfile },
}, {
  defaultNavigationOptions: {
    headerStyle: {
        backgroundColor: 'trasparent',
        elevation: 0,
        shadowOpacity: 0
    },
    headerTitle: '',
    headerTintColor: '#333333',
    headerTitleStyle: {
        fontWeight: 'bold',
        color: '#ffffff'
    }
}
});

//יצירת תפריט עבור דף שפות
const LanguageStack = createStackNavigator({
  Languages: { screen: Languages }
}, {
  defaultNavigationOptions: {
    headerStyle: {
        backgroundColor: 'trasparent',
        elevation: 0,
        shadowOpacity: 0
    },
    headerTitle: '',
    headerTintColor: '#333333',
    headerTitleStyle: {
        fontWeight: 'bold',
        color: '#ffffff'
    }
}
});

//   שפות + יצירת תפריט עבור מחלקות
const DepartmentsStack = createStackNavigator({
  Departments: { screen: Departments },
  SubDepartments: {screen: SubDepartments },
  Languages: { screen: Languages },
}, {
  defaultNavigationOptions: {
    headerStyle: {
        backgroundColor: 'trasparent',
        elevation: 0,
        shadowOpacity: 0
    },
    headerTitle: '',
    headerTintColor: '#333333',
    headerTitleStyle: {
        fontWeight: 'bold',
        color: '#ffffff'
    }
}
});

const JobStack = createStackNavigator({
  Category: {screen: Category},
  SubCategory: { screen: SubCategory },
  JobTitles: {screen: JobTitles},
}, {
  defaultNavigationOptions: {
    headerStyle: {
        backgroundColor: 'trasparent',
        elevation: 0,
        shadowOpacity: 0
    },
    headerTitle: '',
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
  'דף הבית': { screen: MainStack, },
  // 'התחברות': { screen: LogIn, }, // sync with Global.js
  'מחלקות': { screen: DepartmentsStack, },
  'פרופיל': { screen: profileStack },
  'מסכי חיפוש משרה': {screen: JobStack },
}, {
    initialRouteName: 'דף הבית',
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