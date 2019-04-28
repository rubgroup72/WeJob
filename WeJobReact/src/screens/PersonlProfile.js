import { DrawerActions } from 'react-navigation';
import React, {Component} from 'react';
import RoundedButton from '../components/buttons/RoundedButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../styles/colors';
import {StyleSheet, Text, View, Image, Button, ScrollView, AsyncStorage, KeyboardAvoidingView, TouchableOpacity, ImageBackground  } from 'react-native';
import NavBarButton from '../components/buttons/NavBarButton';
import axios from 'axios';
import Loader from '../components/Loader';
import Global from '../global';
import InputField from '../components/form/InputField';

export default class PersonalProfile extends React.Component{

    constructor(props) {
        super(props);
        this.state = { 
            message: '',
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
            loadingVisible: false,
            gender: '',
            department: '1',
            editGender: false,
        };

        this.onSubmitPress = this.onSubmitPress.bind(this);
      }


    componentWillMount() {
        AsyncStorage.getItem(Global.ASYNC_STORAGE_STUDEMT).then((jsonStudent) => {
            if (jsonStudent !== null) {
                var student = JSON.parse(jsonStudent);
                this.setState({
                    firstName: student.FirstName,
                    lastName: student.LastName,
                    email: student.Email,
                    phoneNumber: student.CellPhone,
                    gender: student.Gender,
                    editGender: student.Gender === ''
                });
            }
        });
    }
    static navigationOptions = ({navigation}) => {
        return {
            headerTransparent: true,
            headerTintColor: colors.green01,
            headerLeft: (
                <TouchableOpacity style={styles.menu} onPress={() => navigation.dispatch(DrawerActions.openDrawer())} >
                    <Icon name="bars" size={30} color="#900" />
                </TouchableOpacity>
            ),
        }
    }

    onSubmitPress = () => {
        this.setState({
            loadingVisible: true
        })
        const httpClient = axios.create();
        httpClient.defaults.timeout = 15000;
        httpClient.post(Global.BASE_URL +'Students', {
            Email: this.state.email,
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            CellPhone: this.state.phoneNumber,
            Gender: this.state.gender,
            Department: this.state.department,
        }, 
        )
        .then((response) => {
            this.setState({ loadingVisible: false });
            alert ('התעדכן בהצלחה');
            AsyncStorage.setItem(Global.ASYNC_STORAGE_STUDEMT, JSON.stringify(response.data));
        })
        .catch((error) => {
            this.setState({ loadingVisible: false });
            alert (error.response.status);
        });
        
        // () => this.props.navigation.navigate('LogIn')
    };
    maleClicked = () =>
    {
        this.setState({ gender: 'זכר' });
    }
    genderClicked = () =>
    {
        this.setState({ gender: 'נקבה' });
    }

    getGenderView = () => {
        if (!this.state.editGender) {
            return;
        }

        var maleImage = <Image  source={require('../img/male.png')}  style = {styles.maleImg} />;
        if (this.state.gender === 'זכר') {
            maleImage = <Image  source={require('../img/male.png')}  style = {styles.selectedMaleImg} />;
        }

        var femaleImage = <Image  source={require('../img/female.png')}  style = {styles.femaleImg} />;
        if (this.state.gender === 'נקבה') {
            femaleImage = <Image  source={require('../img/female.png')}  style = {styles.selectedFemaleImg} />;
        }
        return <View 
            style={{flex: 1,
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'row',
            marginBottom: 50,}}>
            <TouchableOpacity activeOpacity = { .5 } onPress={this.maleClicked}>
                { maleImage }
                <Text style={{ textAlign: "center", color: 'white', fontSize: 14 }}>זכר</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity = { .5 } onPress={this.genderClicked}>
                { femaleImage }
                <Text style={{ textAlign: "center", color: 'white', fontSize: 14 }}>נקבה</Text>
            </TouchableOpacity>
        </View>;
    }
    render(){
        const {navigate} = this.props.navigation;
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
                            <Text style = {styles.logInHeader}>עדכון פרטים</Text>
                            { this.getGenderView() }
                            <InputField 
                                    labelText = "שם פרטי"
                                    labelTextSize = {14}
                                    labelColor = {colors.white}
                                    textColor = {colors.white}
                                    borderBottomColor = {colors.white}
                                    inputType = "text"
                                    onChangeTextEvent={(text) => this.setState({ firstName: text }) }
                                    customStyle = {{marginBottom: 30}}
                                    textValue = {this.state.firstName }
                                >
                            </InputField>
                            <InputField 
                                    labelText = "שם משפחה"
                                    labelTextSize = {14}
                                    labelColor = {colors.white}
                                    textColor = {colors.white}
                                    borderBottomColor = {colors.white}
                                    inputType = "text"
                                    onChangeTextEvent={(text) => this.setState({ lastName: text }) }
                                    customStyle = {{marginBottom: 30}}
                                    textValue = {this.state.lastName }
                                >
                            </InputField>
                            <InputField 
                                    labelText = "דואר אלקטרוני"
                                    labelTextSize = {14}
                                    labelColor = {colors.white}
                                    textColor = {colors.white}
                                    borderBottomColor = {colors.white}
                                    inputType = "email"
                                    onChangeTextEvent={(text) => this.setState({ email: text }) }
                                    customStyle = {{marginBottom: 30}}
                                    textValue = {this.state.email }
                            ></InputField>
                            <InputField 
                                    labelText = "פלאפון"
                                    labelTextSize = {14}
                                    labelColor = {colors.white}
                                    textColor = {colors.white}
                                    borderBottomColor = {colors.white}
                                    inputType = "number"
                                    onChangeTextEvent={(text) => this.setState({ phoneNumber: text }) }
                                    customStyle = {{marginBottom: 30}}
                                    textValue = {this.state.phoneNumber }
                            ></InputField>
                            <RoundedButton
                            text = 'עדכון פרטים'
                            textColor = {colors.green01}
                            background= {colors.white}
                            handleOnPress={() => { this.onSubmitPress() }}
                            />
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
        //backgroundColor: colors.green01,
        
    },
    logInHeader: {
        fontSize: 35,
        color: colors.white,
        fontWeight: '300',
        marginBottom: 50,
        marginTop: -50,
        textAlign: 'center'
    },
    subHeader: {
        fontSize: 20,
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

    facebookButtonIcon: {
        color: colors.green01,
        position: 'relative',
        left: 20,
        zIndex: 8,
    },
    googleButtonIcon: {
        color: colors.white,
        position: 'relative',
        left: 20,
        zIndex: 8,
    },
    notShareWithoutPermissionsText:{
        color: colors.white,
        alignSelf: 'center',
        marginTop: -15,
        
    },
    drawHorizontalLine:{
        marginTop: 20,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
    },
    orText:{
        color: colors.white,
        alignSelf:'center',
        paddingHorizontal:5,
        paddingTop: 20,
        marginBottom: 20
    },
    drawLine:{
        backgroundColor: colors.white,
        height: 2,
        flex: 1,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20
        
    },

    logInButton: {
        color: 'red',
        paddingLeft: 22
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
        horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },

    femaleImg: {
        width: 85,
        height: 85,
        tintColor: 'white',
    },
    selectedFemaleImg: {
        width: 85,
        height: 85,
    },

    maleImg: {
        width: 85,
        height: 85,
        tintColor: 'white',
    },
    selectedMaleImg: {
        width: 85,
        height: 85,
    },
    imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1 
    },
});