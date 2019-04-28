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



export default class Register extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = { 
<<<<<<< HEAD
            data: [],
            loadingVisible: true,
            firstLang: '',
            secondLang: '',
            thirdLang: '',
            firstDegree: 0,
            secondDegree: 0,
            thirdDegree: 0,
            studentId: '',
=======
            message: false,
            marineSciences: false,
            aconomicsAndBusiness: false,
            engineering: false,
            socialAndCommunitySciences: false,
            graduate: false,
            loadingVisible: false,
>>>>>>> parent of c17af19... Merge branch 'master' of https://github.com/rubgroup72/WeJob
        };

        this.onRegisterPress = this.onRegisterPress.bind(this);
      }

    onRegisterPress = () => {
        this.setState({
            loadingVisible: true
        });
        axios.post('http://10.0.2.2:53411/api/Register', {
            Email: this.state.marineSciences,
            Password: this.state.aconomicsAndBusiness,
            FirstName: this.state.engineering,
            LastName: this.state.socialAndCommunitySciences,
            CellPhone: this.state.graduate,
        }, 
        )
        .then((response) => {
            this.setState({ loadingVisible: false });
            if (response.data.Message === "") {
                alert ('Registered');
            } else {
            alert (response.data.Message);
            }
<<<<<<< HEAD
            this.setState({ data: temp });
            this.fetchStudentLanguages();
        })
        .catch((error) => {
            this.setState({ loadingVisible: false });
            alert (error.response.status);
        });

        AsyncStorage.getItem(Global.ASYNC_STORAGE_STUDEMT).then((jsonStudent) => {
            if (jsonStudent !== null) {
                var student = JSON.parse(jsonStudent);
                this.setState({
                    studentId: student.StudentId
                });
            }
        });
    }
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
                firstDegree: 2, // firstDegree,
                secondDegree: secondDegree,
                thirdDegree: thirdDegree,
            });
=======
>>>>>>> parent of c17af19... Merge branch 'master' of https://github.com/rubgroup72/WeJob
        })
        .catch((error) => {
            this.setState({ loadingVisible: false });
            alert (error.response.status);
        });
        // () => this.props.navigation.navigate('LogIn')
    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation
        return {
          headerTransparent: true,
          headerTintColor: colors.white,
        }
      }

<<<<<<< HEAD
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
            alert ('hi');
            // this.props.navigation.navigate('Languages');
        })
        .catch((error) => {
            this.setState({ loadingVisible: false });
            alert (error.response.status);
        });
    
    }

    langDegreeChanged = (index, degree) => {
        if (index === 0)
            this.setState({ firstDegree: degree });
        else if (index === 1)
            this.setState({ secondDegree: degree });
        else
            this.setState({ thirdDegree: degree });
    }

    firstLanguagesChanged = (value, index, data) => {
        this.setState({ firstLang: value });
    };
    secondLanguagesChanged = (value, index, data) => {
        this.setState({ secondLang: value });
    };
    thirdLanguagesChanged = (value, index, data) => {
        this.setState({ thirdLang: value });
    };
=======
    marineClicked = () =>
    {
        this.setState({ marineSciences: true });

    }
>>>>>>> parent of c17af19... Merge branch 'master' of https://github.com/rubgroup72/WeJob
    

    render(){
        //const {navigate} = this.props.navigation;
        let data = [{
            value: 'Banana',
          }, {
            value: 'Mango',
          }, {
            value: 'Pear',
          }];

          var radio_props = [
            {label: 'בסיסי', value: 0, },
            {label: 'בינוני', value: 1 },
            {label: 'שפת אם', value: 2 }
          ];

        //   var RadioButtonProject = React.createClass({
        //     getInitialState: function() {
        //       return {
        //         value: 0,
        //       }
        //     }
        //     })
      

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
                            <Text style = {styles.logInHeader}> בחר שפות</Text>
                            <View style = {styles.iconsStyle}>
                            <Dropdown
                             containerStyle={{width:200}}
                             label='בחר שפה ראשונה'
<<<<<<< HEAD
                             value={this.state.firstLang}
                             data={this.state.data}
                             onChangeText={this.firstLanguagesChanged}
                             style = {{color: 'white'}} //for changed text color
                             baseColor="rgba(255, 255, 255, 1)" //for initial text color
                             />
                             <RadioForm
                             radio_props={radio_props}
                             initial={this.state.firstDegree}
                             onPress={(value) => { this.langDegreeChanged(0, value); }}
                             buttonColor= {'#FFFFFF'}
                             labelColor={'#FFFFFF'}
                             selectedButtonColor={'#FFFFFF'}
                             selectedLabelColor=   {'#FFFFFF'}                  
=======
                             data={data}
                             />
                             <RadioForm
                             radio_props={radio_props}
                             initial={0}
                             onPress={(value) => {this.setState({value:value})}}
>>>>>>> parent of c17af19... Merge branch 'master' of https://github.com/rubgroup72/WeJob
                             />
                            </View>
                            <View style = {styles.iconsStyle}>
                            <Dropdown
                             containerStyle={{width:200}}
                             label='בחר שפה שנייה'
<<<<<<< HEAD
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
                             data={this.state.data}
                             value={this.state.thirdLang}
                             onChangeText={this.thirdLanguagesChanged}
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
=======
                             data={data}
                             
                             />
                             <RadioForm
                             radio_props={radio_props}
                             initial={0}
  formHorizontal={true}
  labelHorizontal={true}
  labelStyle={{fontSize: 20, color: '#2ecc71'}}
  animation={true}
                             onPress={(value) => {this.setState({value:value})}}
>>>>>>> parent of c17af19... Merge branch 'master' of https://github.com/rubgroup72/WeJob
                             />
                            </View>
                            
                            
                            {/* <RoundedButton
                            text = 'הרשמה'
                            textColor = {colors.green01}
                            background= {colors.white}
                            handleOnPress={() => { this.onRegisterPress() }}
                            /> */}
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
        marginTop: -50,
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