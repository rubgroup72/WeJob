import React, {Component} from 'react';
import colors from '../styles/colors';
import {StyleSheet, Text, View, Image, Button, ScrollView,
    KeyboardAvoidingView, TouchableOpacity, ImageBackground  } from 'react-native';
import RoundedButton from '../components/buttons/RoundedButton';
import NavBarButton from '../components/buttons/NavBarButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import InputField from '../components/form/InputField'
import axios from 'axios';
import Loader from '../components/Loader';
import NextArrowButton from '../components/buttons/NextArrowButton';
import Global from '../global';



export default class Register extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = { 
            message: false,
            marineSciences: false,
            aconomicsAndBusiness: false,
            engineering: false,
            socialAndCommunitySciences: false,
            graduate: false,
            loadingVisible: false,
        };

        this.onRegisterPress = this.onRegisterPress.bind(this);
      }

    onRegisterPress = () => {
        this.setState({
            loadingVisible: true
        });
        const httpClient = axios.create();
        httpClient.defaults.timeout = Global.DEFUALT_REQUEST_TIMEOUT_MS;
        httpClient.post(Global.BASE_URL + 'Register', {
            MarineSciences: this.state.marineSciences,
            AconomicsAndBusiness: this.state.aconomicsAndBusiness,
            Engineering: this.state.engineering,
            SocialAndCommunitySciences: this.state.socialAndCommunitySciences,
            Graduate: this.state.graduate,
        }, 
        )
        .then((response) => {
            this.setState({ loadingVisible: false });
            if (response.data.Message === "") {
                alert ('Registered');
            } else {
            alert (response.data.Message);
            }
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

    marineClicked = () =>
    {
        this.setState({ marineSciences: true });
        this.setState({ aconomicsAndBusiness: false });
        this.setState({ engineering: false });
        this.setState({ socialAndCommunitySciences: false });
        this.setState({ graduate: false });
    }
    aconomicsAndBusinessClicked = () =>
    {
        this.setState({ marineSciences: false });
        this.setState({ aconomicsAndBusiness: true });
        this.setState({ engineering: false });
        this.setState({ socialAndCommunitySciences: false });
        this.setState({ graduate: false });
    }
    engineeringClicked = () =>
    {
        this.setState({ marineSciences: false });
        this.setState({ aconomicsAndBusiness: false });
        this.setState({ engineering: true });
        this.setState({ socialAndCommunitySciences: false });
        this.setState({ graduate: false });
    }
    socialAndCommunitySciencesClicked = () =>
    {
        this.setState({ marineSciences: false });
        this.setState({ aconomicsAndBusiness: false });
        this.setState({ engineering: false });
        this.setState({ socialAndCommunitySciences: true });
        this.setState({ graduate: false });
    }
    graduateClicked = () =>
    {
        this.setState({ marineSciences: false });
        this.setState({ aconomicsAndBusiness: false });
        this.setState({ engineering: false });
        this.setState({ socialAndCommunitySciences: false });
        this.setState({ graduate: true });
    }

    render(){
        //const {navigate} = this.props.navigation;
        var marine = <Icon name ="anchor" 
        color='white'
        size={85}
        type="entypo"/>
        if (this.state.marineSciences === true) {
            marine = <Icon name ="anchor" 
            color='rgba(0, 0, 0, 0.38)'
            size={85}
            type="entypo"/>;
        }

        var cogs = <Icon name ="cogs"
        color='white'
        size={85}
        type="entypo"/>
        if (this.state.engineering === true) {
            cogs = <Icon name ="cogs" 
            color='rgba(0, 0, 0, 0.38)'
            size={85}
            type="entypo"/>;
        }

        var suitcase = <Icon name ="suitcase"
        color='white'
        size={85}
        style={{ marginLeft: 15 }}
        type="entypo"/>
        if (this.state.aconomicsAndBusiness === true) {
            suitcase = <Icon name ="suitcase" 
            color='rgba(0, 0, 0, 0.38)'
            size={85}
            style={{ marginLeft: 15 }}
            type="entypo"/>;
        }


        var users = <Icon name ="users"
        color='white'
        style={{ marginLeft: 15 }}
        size={85}
        type="entypo"/>
        if (this.state.socialAndCommunitySciences === true) {
            users = <Icon name ="users" 
            color='rgba(0, 0, 0, 0.38)'
            size={85}
            style={{ marginLeft: 15 }}
            type="entypo"/>;
        }


        var graduate = <Icon name ="graduation-cap"
        color='white'
        size={85}
        type="entypo"/>
        if (this.state.graduate === true) {
            graduate = <Icon name ="graduation-cap" 
            color='rgba(0, 0, 0, 0.38)'
            size={85}
            type="entypo"/>;
        }
       

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
                            <Text style = {styles.logInHeader}>מה אתה לומד?</Text>
                            <View style = {styles.iconsStyle}>
                            <TouchableOpacity activeOpacity = { .5 } onPress={this.marineClicked}>
                                { marine }
                                <Text style={{ textAlign: "center", color: 'white', fontSize: 14 }}>מדעי הים</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity = { .5 } onPress={this.engineeringClicked}>
                                { cogs }
                                <Text style={{ textAlign: 'center', color: 'white', fontSize: 14 }}>הנדסה</Text>
                            </TouchableOpacity>
                            </View>
                            <View style = {styles.iconsStyle}>
                            <TouchableOpacity activeOpacity = { .5 } onPress={this.aconomicsAndBusinessClicked}>
                                { suitcase }
                                <Text style={{ textAlign: 'center', color: 'white', fontSize: 14,  alignItems: 'center' }}>כלכלה ומנהל עסקים</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity = { .5 } onPress={this.socialAndCommunitySciencesClicked}>
                                { users }
                                <Text style={{ textAlign: 'center', color: 'white', fontSize: 14 }}>מדעי החברה והקהילה</Text>
                            </TouchableOpacity>
                            </View>
                            <View style = {styles.iconsStyle}>
                            <TouchableOpacity activeOpacity = { .5 } onPress={this.graduateClicked}>
                                { graduate }
                                <Text style={{ textAlign: "center", color: 'white', fontSize: 14, }}>בוגר</Text>
                            </TouchableOpacity>
                            </View>
                            
                            {/* <RoundedButton
                            text = 'הרשמה'
                            textColor = {colors.green01}
                            background= {colors.white}
                            handleOnPress={() => { this.onRegisterPress() }}
                            /> */}
                            <View style = {styles.nextButton}>
                                <NextArrowButton
                                 handleOnPress={() => this.props.navigation.navigate('Home')}
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