import React, {Component} from 'react';
import colors from '../styles/colors';
import LoggedOut from './LoggedOut';
import NavBarButton from '../components/buttons/NavBarButton';
import { StyleSheet, TouchableOpacity, Text, View, Image, Button, AsyncStorage, DrawerLayoutAndroid, I18nManager } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { DrawerActions } from 'react-navigation';
import RoundedButton from '../components/buttons/RoundedButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import JobsCarousel from './JobsCarousel';
import Global from '../global';
import axios from 'axios';
import Department from './Departments';

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
        }
        this.props.navigation.addListener('willFocus', this.loadComponent);

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
        return {
            headerTransparent: true,
            headerTintColor: colors.green01,
            // headerRight: (
            //     <NavBarButton handleButtonPress={() => navigation.navigate('LogIn')} location="left" color={colors.white} text="  לצפיי2ה במשרות ללא הרשמה" />
            // ),
           // title: 'WeJob',
            headerLeft: headerLeftInternal,
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
          if (this.state.userLoggedOut) 
              this.tryLogin();
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
        AsyncStorage.getItem(Global.FACEBOOK_TOKEN_STRING).then((token) => {
            if (token !== null) {
                // Check what happend with facebook
                this.fetchFacebookUserData(token);
            }
        });
        AsyncStorage.getItem(Global.USER_EMAIL).then((email) => {
            if (email !== null) {
                this.fetchStudentDataByEmail(email);
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
                    }
                })
                .catch((error) => {
                    this.setState({ loadingVisible: false });
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
                alert(exc)
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
                    }
                })
                .catch((error) => {
                    this.setState({ loadingVisible: false });
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
         });
         AsyncStorage.setItem(Global.ASYNC_STORAGE_STUDEMT, JSON.stringify(student));
         AsyncStorage.setItem(Global.USER_EMAIL, student.Email);
         AsyncStorage.setItem(Global.IS_USER_LOGGED_IN, "true");
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