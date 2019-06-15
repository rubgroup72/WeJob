import React, {Component} from 'react';
import colors from '../styles/colors';
import LoggedOut from './LoggedOut';
import NavBarButton from '../components/buttons/NavBarButton';
import { StyleSheet, TouchableOpacity, Text, View, Image, Button, DrawerLayoutAndroid, I18nManager, Alert } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { DrawerActions } from 'react-navigation';
import RoundedButton from '../components/buttons/RoundedButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import JobsCarousel from './JobsCarousel';
import Global from '../global';
import axios from 'axios';
import Department from './Departments';
import AsyncStorage from '@react-native-community/async-storage';
import { Crashlytics, Answers } from 'react-native-fabric';
import firebase from 'react-native-firebase';
import { BarIndicator} from 'react-native-indicators';

export default class Main extends React.Component{

    constructor(props) {
        super(props);
        I18nManager.forceRTL(true);// מנג'ר שאחראי על תווים וכיוונים שמגדיר לקרוא את המסך מימין לשמאל
        this.state = {
            userLoggedOut: true,
            loginWithFacebook: false,
            loginWithGoogle: false,
            loginWithEmail: false,
            student: null,
            isDemoUser: false,
            isFirstFetch: false,
            navigateToDepartment: false,
            fcmToken: '',
            tryAutomaticLogin: 0,
        }
        this.props.navigation.addListener('willFocus', this.loadComponent);

        Crashlytics.setString('test', 'my test');
    }

    //הגדרות של הניווט
    static navigationOptions = ({navigation}) => {
        const { params = {} } = navigation.state;
        let headerLeftInternal = null;
        if (params.shouldShow) {
            headerLeftInternal = (<TouchableOpacity style={styles.menu} onPress={() => navigation.dispatch(DrawerActions.openDrawer())} >
            <Icon name="bars" size={30} color= {colors.white} />
            </TouchableOpacity>);
        }
        var title = '';
        if (params.shouldShow) {
            title = 'משרות מומלצות עבורך';
        }
        return {
            headerTransparent: true,
            headerTintColor: colors.white,
            // headerRight: (
            //     <NavBarButton handleButtonPress={() => navigation.navigate('LogIn')} location="left" color={colors.white} text="  לצפיי2ה במשרות ללא הרשמה" />
            // ),
            title: title,
            headerLeft: headerLeftInternal,
        }
      }

      async componentDidMount() {
        this.checkPermission();
        this.createNotificationListeners();
      }

      componentWillUnmount() {
        // this.notificationListener();
        // this.notificationOpenedListener();
      }
      async createNotificationListeners() {
        /*
        * Triggered when a particular notification has been received in foreground
        * */
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            this.showAlert(title, body);
        });
      
        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        });
      
        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
          //process data message
          console.log(JSON.stringify(message));
        });
      }
      
      showAlert(title, body) {
        // Alert.alert(
        //   title, body,
        //   [
        //       { text: 'OK', onPress: () => console.log('OK Pressed') },
        //   ],
        //   { cancelable: false },
        // );
      }
      async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
      }
      async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                // user has a device token
                await AsyncStorage.setItem(Global.FCM_TOKEN, fcmToken);
                this.setState({ fcmToken: fcmToken });
            }
        } else {
            this.setState({ fcmToken: fcmToken });
        }
      }
      async requestPermission() {
            try {
                await firebase.messaging().requestPermission();
                // User has authorised
                this.getToken();
            } catch (error) {
                // User has rejected permissions
                console.log('permission rejected');
            }
        }
  

      //קופוננטה שמתבצעת בכל פעם שהדף נטען
      loadComponent = () => {
          AsyncStorage.getItem(Global.IS_JUST_REGISTERED).then((res) => {
            if (res === "true") {
                // אם הסטודנט נרשם נעביר אותו לדף מחלקות
                AsyncStorage.setItem(Global.IS_JUST_REGISTERED, "false");
                this.setState({ navigateToDepartment: true });
            } else {
                //אם הוא לא נרשם עתה אבל הדגל של ניווט לדף מחלקות דולק, נכבה אותו
                if (this.state.navigateToDepartment) {
                    this.setState({ navigateToDepartment: false });
                }
            }
          });
        // אם היוזר נמצא בדף ההתחברות, ננסה לחבר אותו לפי הפרטים ששמורים לנו ממקודם
          if (this.state.userLoggedOut) {
              this.tryLogin();
          }
          else  {
            // In case the user have been logged out from another screen  
            AsyncStorage.getItem(Global.IS_USER_LOGGED_IN).then((res) => {
                if (res === "false") {
                    this.setState({
                        userLoggedOut: true,
                        loginWithFacebook: false,
                        loginWithGoogle: false,
                        loginWithEmail: false,
                        student: null,
                        isDemoUser: false,
                    });
                    this.props.navigation.setParams({ shouldShow: false });
                }
            });
          }

          this.props.navigation.setParams({ shouldShow: !this.state.userLoggedOut }); // אם היוזר מחובר תראה תפריט בצד
      }
      //קומפוננטה שקוראת רק פעם אחת כשהדף עולה בפעם הראשונה
      componentWillMount() {
        if (this.state.isFirstFetch) {
            return;
        }
        this.state.isFirstFetch = true;
        this.tryLogin();
    }
    //ננסה לחבר את היוזר באחת האופציות ששמורות לנו במידה והתחבר מקודם
    tryLogin = () => {
        this.setState({ tryAutomaticLogin: 2 });
        AsyncStorage.getItem(Global.FACEBOOK_TOKEN_STRING).then((token) => {
            if (token !== null) {
                // Check what happend with facebook
                this.fetchFacebookUserData(token);
            } else {
                this.setState({ tryAutomaticLogin: this.state.tryAutomaticLogin - 1 });
            }
        });
        AsyncStorage.getItem(Global.USER_EMAIL).then((email) => {
            if (email !== null) {
                this.fetchStudentDataByEmail(email);
            } else {
                this.setState({ tryAutomaticLogin: this.state.tryAutomaticLogin - 1 });
            }
        });
    }
    // משיכת פרטי סטודנט בעזרת אימייל
    fetchStudentDataByEmail = (email) => {
        const httpClient = axios.create();
        httpClient.defaults.timeout = 15000;
        httpClient.get(Global.BASE_URL + "AppGetStudentByEmail?email=" + email)
                .then((response) => {
                    if (response.data !== undefined && response.data !== null) {
                        this.loginFinished('email', response.data);
                    } else {
                        alert('An error has occured1');
                        this.setState({ tryAutomaticLogin: this.state.tryAutomaticLogin - 1 });
                    }
                })
                .catch((error) => {
                    this.setState({ tryAutomaticLogin: this.state.tryAutomaticLogin - 1 });
                    alert (error);
                });
    }
        //משיכת פרטי סטודנט שאיתו התחברנו לפייסבוק
        fetchFacebookUserData = (token) => {
            fetch('https://graph.facebook.com/v2.5/me?fields=email,name&access_token=' + token)
            .then((response) => response.json())
            .then((json) => {
                var user = {};
                user.name = json.name;
                user.id = json.id;
                user.email = json.email;
                this.fetchStudentDataFromFacebook(user.email, user.name, token);//מושכים נתונים מהשרת בעזרת האימייל שקיבלנו מפייסבוק
            })
            .catch((exc) => {
                this.setState({ tryAutomaticLogin: this.state.tryAutomaticLogin - 1 });
                alert(exc);
            });
        }
        
    // מביאים מהשרת את פרטי הסטודנט בעזרת אימייל שנתנו לנו מפייסבוק
    fetchStudentDataFromFacebook = (email, name, token) => {
        const httpClient = axios.create();
        httpClient.defaults.timeout = Global.DEFUALT_REQUEST_TIMEOUT_MS;
        httpClient.post(Global.BASE_URL + "appFacebook", {
                    Email: email,
                    FirstName: name,
                    Password: token,
                })
                .then((response) => {
                    if (response.data !== undefined && response.data !== null) {
                        this.loginFinished('facebook', response.data);
                    } else {
                        alert('An error has occured2');
                        this.setState({ tryAutomaticLogin: this.state.tryAutomaticLogin - 1 });
                    }
                })
                .catch((error) => {
                    this.setState({ tryAutomaticLogin: this.state.tryAutomaticLogin - 1 });
                    alert (error);
                });
    }
    //פוקנציה שמופעלת כאשר תהליך ההתחברות עם כל אופציית התחברות הסתיים
    loginFinished = (loginProvider, student) => {
        this.setState({ 
            userLoggedOut: false, 
            loginWithFacebook: (loginProvider === 'facebook'),
            loginWithGoogle: (loginProvider === 'google'),
            loginWithEmail: (loginProvider === 'email'),
            student: student,
            tryAutomaticLogin: 0,
         });
         AsyncStorage.setItem(Global.ASYNC_STORAGE_STUDEMT, JSON.stringify(student));
         AsyncStorage.setItem(Global.USER_EMAIL, student.Email);
         AsyncStorage.setItem(Global.IS_USER_LOGGED_IN, "true");
         
         Answers.logLogin(student.Email, true);
  
         const httpClient = axios.create();
         httpClient.defaults.timeout = 15000;
         httpClient.get(Global.BASE_URL + "AppRegisterDeviceID?email=" + student.Email + "&fcmToken=" + this.state.fcmToken);

         this.props.navigation.setParams({ shouldShow: true });
    }
    //פונקציה שמסמנת שהסטודנט התנתק מפייסבוק
    logoutFacebook = () => {
        this.setState({ 
            userLoggedOut: true,
            loginWithFacebook: false,
            student: null,
        });
        AsyncStorage.setItem(Global.FACEBOOK_TOKEN_STRING, '');
    }

    //איזה מסך נרצה להציג לסטודנט
    getScreenToShow = () => {

        if (this.state.tryAutomaticLogin > 0) {
            return <BarIndicator count={5} color='orange' />
        }

        //כאשר האפליקציה עולה זהו הדף הראשון אליו נגיע באופן דיפולטיבי
        // ונעביר לדף את הנתונים של המשתמש ואת הטוקן של הפייסבוק
        //אם הדגל של ניתוק דולק
        if (this.state.userLoggedOut) {
            return <LoggedOut 
            fetchFacebookUserData={this.fetchFacebookUserData} 
            logoutFacebook={this.logoutFacebook}
            navigation={this.props.navigation} />;
        }
        //אם הדגל של מחלקות דלוק תעביר אותי למחלקות
        if (this.state.navigateToDepartment) {
            return <Department navigation={this.props.navigation} />;
        }
        //אחרת תעביר לקרוסלת משרות
        //var string = this.state.student.email + ' ' + this.state.student.name;
        return <JobsCarousel navigation={this.props.navigation} />;
    }
    
    render() {
        return this.getScreenToShow();
    }
}

const styles = StyleSheet.create({
    menu: {
        marginLeft: 5
    }

});