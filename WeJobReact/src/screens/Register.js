import React, {Component} from 'react';
import colors from '../styles/colors';
import InlineImage from '../components/InlineImage'
import {StyleSheet, Text, View, Image, Button, ScrollView,
    
    KeyboardAvoidingView, } from 'react-native';
import RoundedButton from '../components/buttons/RoundedButton';
import NavBarButton from '../components/buttons/NavBarButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import InputField from '../components/form/InputField'
import axios from 'axios';

export default class Register extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = { 
            message: '',
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
        };

        this.onRegisterPress = this.onRegisterPress.bind(this);
      }

    onRegisterPress = () => {
        axios.post('http://10.0.2.2:53411/api/Register', {
            Email: this.state.email,
            Password: this.state.password,
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            CellPhone: this.state.phoneNumber,
        }, 
        )
             .then((response) => {
                 if (response.data.Message === "") {
                     alert ('Registered');
                 } else {
                    alert (response.data.Message);
                 }
             })
             .catch((error) => {
                alert (error.response.status);
             });
        // () => this.props.navigation.navigate('LogIn')
    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation
        return {
          headerTransparent: true,
          headerTintColor: colors.white,
          // inga test
          //headerTitle: 'New Task',
          headerLeft:
          <NavBarButton handleButtonPress={() => navigation.navigate('LogIn')} location="right" color={colors.white} text="משתמש רשום?  " />,
        }
      }
    
    render(){
        const {navigate} = this.props.navigation;
        return (
            <KeyboardAvoidingView style={styles.wrapper}>
                <ScrollView  behavior="padding" enabled>
                    <View style={styles.wrapper}>
                        <View style={styles.welcomeWrapper}>
                            <Text style = {styles.welcomeText}> 
                                { this.state.message }
                            </Text>
                            <InputField 
                                    labelText = "שם פרטי"
                                    labelTextSize = {14}
                                    labelColor = {colors.white}
                                    textColor = {colors.white}
                                    borderBottomColor = {colors.white}
                                    inputType = "text"
                                    onChangeTextEvent={(text) => this.setState({ firstName: text }) }
                                    customStyle = {{marginBottom: 30}}
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
                            ></InputField>
                            <InputField 
                                    labelText = "סיסמא"
                                    labelTextSize = {14}
                                    labelColor = {colors.white}
                                    textColor = {colors.white}
                                    borderBottomColor = {colors.white}
                                    inputType = "password"
                                    onChangeTextEvent={(text) => this.setState({ password: text }) }
                                    customStyle = {{marginBottom: 30}}
                                >
                            </InputField>
                            <RoundedButton
                            text = 'הרשמה'
                            textColor = {colors.green01}
                            background= {colors.white}
                            handleOnPress={() => { this.onRegisterPress() }}
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        display: 'flex',
        backgroundColor: colors.green01,
        
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
    }


});