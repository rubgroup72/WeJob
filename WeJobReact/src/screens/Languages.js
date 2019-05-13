import React, {Component} from 'react';
import colors from '../styles/colors';
import {StyleSheet, Text, View, Image, Button, ScrollView,
    KeyboardAvoidingView, TouchableOpacity, ImageBackground, AsyncStorage  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import axios from 'axios';
import Loader from '../components/Loader';
import NextArrowButton from '../components/buttons/NextArrowButton';
import { Dropdown } from 'react-native-material-dropdown';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Global from '../global';
import { DrawerActions } from 'react-navigation';



export default class Register extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = { 
            data: [],
            loadingVisible: true,
            firstLang: '',
            secondLang: '',
            thirdLang: '',
            firstDegree: 0,
            secondDegree: 0,
            thirdDegree: 0,
            studentId: '',
        };
      }

      

    //   static navigationOptions = ({navigation}) => {
    //     return {
    //         headerTransparent: true,
    //         headerTintColor: colors.green01,
    //         // headerRight: (
    //         //     <NavBarButton handleButtonPress={() => navigation.navigate('LogIn')} location="left" color={colors.white} text="  לצפיי2ה במשרות ללא הרשמה" />
    //         // ),
    //         title: 'שפות',
    //         headerLeft: (
    //             <TouchableOpacity style={styles.menu} onPress={() => navigation.dispatch(DrawerActions.openDrawer())} >
    //                 <Icon name="bars" size={30} color= {colors.white} />
    //             </TouchableOpacity>
    //         ),
    //     }
    //   }

      componentWillMount() {
        this.setState({
            loadingVisible: true
        });
        //קריאה לדטא בייס 
        const httpClient = axios.create();
        httpClient.defaults.timeout = Global.DEFUALT_REQUEST_TIMEOUT_MS;
        httpClient.get( Global.BASE_URL +'language')
        //במידה וחוזר מידע שומר בתכונה 
        .then((response) => {
            this.setState({ loadingVisible: false });
            var temp = [];
            for (var i = 0; i < response.data.length; ++i) {
                temp.push({ value: response.data[i].Name });
            }
            this.setState({ data: temp });
            this.fetchStudentLanguages();
        })
        .catch((error) => {
            this.setState({ loadingVisible: false });
            alert (error.response.status);
        });
//הבאת התז של הסטודנט מהזיכרון הלוקל
        AsyncStorage.getItem(Global.ASYNC_STORAGE_STUDEMT).then((jsonStudent) => {
            if (jsonStudent !== null) {
                var student = JSON.parse(jsonStudent);
                this.setState({
                    studentId: student.StudentId
                });
            }
        });
    }
    //הבאת השפות שהסטודנט בחר והשמתם בתכונות של הקומפוננטה
    fetchStudentLanguages = () => {
        const httpClient = axios.create();
        httpClient.defaults.timeout = Global.DEFUALT_REQUEST_TIMEOUT_MS;
        httpClient.get( Global.BASE_URL +'AppStudentLanguagesController?studentId=' + this.state.studentId)
        .then((response) => {
            this.setState({ loadingVisible: false });
            var firstLanguage = '';
            var firstDegree = 0;
            var secondLanguage = '';
            var secondDegree = 0;
            var thirdLanguage = '';
            var thirdDegree = 0;
            if (response.data.length >= 1) {
                firstLanguage = response.data[0].Name;
                firstDegree = response.data[0].Degree;
            }
            if (response.data.length >= 2) {
                secondLanguage = response.data[1].Name;
                secondDegree = response.data[1].Degree;
            }
            if (response.data.length >= 3) {
                thirdLanguage = response.data[2].Name;
                thirdDegree = response.data[2].Degree;
            }
            this.setState({ 
                firstLang: firstLanguage, 
                secondLang: secondLanguage, 
                thirdLang: thirdLanguage,
                firstDegree: firstDegree,
                secondDegree: secondDegree,
                thirdDegree: thirdDegree,
            });
        })
        .catch((error) => {
            this.setState({ loadingVisible: false });
        });
    };
    //כאשר הסטודנט לחץ על כפתור הבא ,נשמור את השפות שבחר ונכניס לדטא בייס
    handleNextButtonClicked = () => {
        var langList = [];
        langList.push({ Name: this.state.firstLang, Degree: this.state.firstDegree});
        langList.push({ Name: this.state.secondLang, Degree: this.state.secondDegree});
        langList.push({ Name: this.state.thirdLang, Degree: this.state.thirdDegree});

        const httpClient = axios.create();
        httpClient.defaults.timeout = 15000;
        httpClient.post(Global.BASE_URL +'AppStudentLanguagesController', {
            LanguagesList: langList,
            StudentId: this.state.studentId
        }, 
        )
        .then((response) => {
            this.setState({ loadingVisible: false });
            this.props.navigation.navigate('Category');
        })
        .catch((error) => {
            this.setState({ loadingVisible: false });
            alert (error.response.status);
        });
    
    }
//שמירת הרמה של השפות שהסטודנט בחר
    langDegreeChanged = (index, degree) => {
        if (index === 0)
            this.setState({ firstDegree: degree });
        else if (index === 1)
            this.setState({ secondDegree: degree });
        else
            this.setState({ thirdDegree: degree });
    }
//שמירת השפות שבחר הסטודנט
    firstLanguagesChanged = (value, index, data) => {
        this.setState({ firstLang: value });
    };
    secondLanguagesChanged = (value, index, data) => {
        this.setState({ secondLang: value });
    };
    thirdLanguagesChanged = (value, index, data) => {
        this.setState({ thirdLang: value });
    };

    
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation
        return {
          headerTransparent: true,
          headerTintColor: colors.white,
        }
      }

    

    render(){
          var radio_props = [
            {label:  ' בסיסי ', value: 0, },
            {label: ' בינוני ', value: 1 },
            {label: ' שפת אם ', value: 2 }
          ];
        return (
            <ImageBackground style={ styles.imgBackground } 
                 resizeMode='cover' 
                 source={require('../img/blue.jpeg')}>
                 <KeyboardAvoidingView style={styles.wrapper}>
                <ScrollView  behavior="padding" enabled>
                    <View style={styles.wrapper}>
                        <View style={styles.welcomeWrapper}>
                            <Text style = {styles.welcomeText}> 
                                { this.state.message }
                            </Text>
                            <Text style = {styles.logInHeader}> דבר איתנו ב...</Text>
                            <View style = {styles.iconsStyle}>
                            <Dropdown
                             containerStyle={{width:200}}
                             label='בחר שפה ראשונה'
                             value={this.state.firstLang}
                             data={this.state.data}
                             onChangeText={this.firstLanguagesChanged}
                             style = {{color: 'white'}} //for changed text color
                             baseColor="rgba(255, 255, 255, 1)" //for initial text color
                             />
                             
                             <RadioForm //כמו כפתור רדיו 
                             radio_props={radio_props}
                             initial={this.state.firstDegree}
                             onPress={(value) => { this.langDegreeChanged(0, value); }}
                             buttonColor= {'#FFFFFF'}
                             labelColor={'#FFFFFF'}
                             selectedButtonColor={'#FFFFFF'}
                             selectedLabelColor=   {'#FFFFFF'}                  
                             />

                            </View>
                            <View style = {styles.iconsStyle}>
                            <Dropdown
                             containerStyle={{width:200}}
                             label='בחר שפה שנייה'
                             data={this.state.data}
                             onChangeText={this.secondLanguagesChanged}
                             value={this.state.secondLang}
                             style = {{color: 'white'}} //for changed text color
                             baseColor="rgba(255, 255, 255, 1)" //for initial text color
                             />
                             <RadioForm
                             radio_props={radio_props}
                             initial={this.state.secondDegree}
                             onPress={(value) => { this.langDegreeChanged(1, value); }}
                             buttonColor= {'#FFFFFF'}
                             labelColor={'#FFFFFF'}
                             selectedButtonColor={'#FFFFFF'}
                             selectedLabelColor=   {'#FFFFFF'} 
                             />
                            </View>
                            <View style = {styles.iconsStyle}>
                            <Dropdown
                             containerStyle={{width:200}}
                             label='בחר שפה שלישית'
                             value={this.state.thirdLang}
                             onChangeText={this.thirdLanguagesChanged}
                             data={this.state.data}
                             style = {{color: 'white'}} //for changed text color
                             baseColor="rgba(255, 255, 255, 1)" //for initial text color
                             />
                             <RadioForm
                             radio_props={radio_props}
                             initial={this.state.thirdDegree}
                             onPress={(value) => { this.langDegreeChanged(2, value); }}
                             buttonColor= {'#FFFFFF'}
                             labelColor={'#FFFFFF'}
                             selectedButtonColor={'#FFFFFF'}
                             selectedLabelColor=   {'#FFFFFF'} 
                             />
                            </View>
                            <View style = {styles.nextButton}>
                                <NextArrowButton
                                   handleOnPress={() => this.handleNextButtonClicked()}
                                 />
                            </View>
                        </View>
                        <Loader
                         modalVisible={this.state.loadingVisible}
                         animationType="fade" />  
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
           </ImageBackground>
            
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        display: 'flex',
        
    },
    logInHeader: {
        fontSize: 35,
        color: colors.white,
        fontWeight: '300',
        marginBottom: 50,
        marginTop: -60,
        textAlign: 'center'
    },

    welcomeWrapper:{
        flex: 1,
        display: "flex",
        marginTop: 30,
        padding: 20 

    },
    welcomeText: {
        fontSize: 20,
        color: colors.white,
        fontWeight: "500",
        marginTop: 0,
        marginBottom: 20,
        padding: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.85)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },

    container: {
        flex: 1,
        justifyContent: 'center'
    },

    nextButton: {
        alignItems: 'center',
        // left: 20,
        // bottom: 20,
    },

    iconsStyle: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 50,
        flexWrap: 'wrap'
    },
    imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1 
},

});