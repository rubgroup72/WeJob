import React, {Component} from 'react';
import { PropTypes} from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    ImageBackground,
    AsyncStorage,
} from 'react-native';

import colors from '../styles/colors';
import InputField from '../components/form/InputField';
import RoundedButton from '../components/buttons/RoundedButton';
import axios from 'axios';
import Loader from '../components/Loader';
import Global from '../global';

class LogIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            loadingVisible: false,
        };
    }

    handleNextButton(){
        alert("Next button pressed");
    }

    LoginButtonCliked = () => {
        this.setState({
            loadingVisible: true
        });
        const httpClient = axios.create();
        httpClient.defaults.timeout = Global.DEFUALT_REQUEST_TIMEOUT_MS;
        httpClient.post(Global.BASE_URL + "Login", {
            Email: this.state.email,
            Password: this.state.password,
        })
        .then((response) => {
            this.setState({ loadingVisible: false });
            if (response.data.Message === '') {
                var student = response.data.Data;
                AsyncStorage.setItem(Global.USER_EMAIL, student.Email);
                this.props.navigation.navigate('Main');
            } else {
                alert (response.data.Message);
            }
        })
        .catch((error) => {
            this.setState({ loadingVisible: false });
            alert (error);
        });
    }

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation
        return {
          headerTransparent: true,
          headerTintColor: colors.white,
        }
      }
    render(){
        return(
            <ImageBackground style={ styles.imgBackground } 
                 resizeMode='cover' 
                 source={require('../img/blue.jpeg')}>
                 <KeyboardAvoidingView style={styles.wrapper}>
                <ScrollView  behavior="padding" enabled>
                 <View style = {styles.scrolViewWrapper}>
                    <Text style = {styles.logInHeader}>התחבר</Text>
                    <InputField 
                        labelText = "דואר אלקטרוני"
                        labelTextSize = {14}
                        labelColor = {colors.white}
                        textColor = {colors.white}
                        borderBottomColor = {colors.white}
                        inputType = "email"
                        customStyle = {{marginBottom: 30}}
                        onChangeTextEvent = {(text)=> this.setState ({email:text})}
                    >
                    </InputField>
                    <InputField 
                        labelText = "סיסמא"
                        labelTextSize = {14}
                        labelColor = {colors.white}
                        textColor = {colors.white}
                        borderBottomColor = {colors.white}
                        inputType = "password"
                        customStyle = {{marginBottom: 30}}
                        onChangeTextEvent = {(text)=> this.setState ({password:text})}
                    >
                </InputField>

                <RoundedButton
                     text = "התחברות"
                     textColor = {colors.white}
                     backgroundColor = {colors.white}
                     handleOnPress = {() => {this.LoginButtonCliked()}}
                >
                </RoundedButton>

                
             </View>

            </ScrollView>
            <Loader
             modalVisible={this.state.loadingVisible}
             animationType="fade" />  
        </KeyboardAvoidingView>    
            </ImageBackground>   
        );
          
    }
}

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        flex: 1,
        //backgroundColor: colors.green01,
    },
    scrolViewWrapper:{
        marginTop: 70,
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
    },
    ScrollView: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20,
        flex: 1,
    },

    logInHeader: {
        fontSize: 35,
        color: colors.white,
        fontWeight: '300',
        marginBottom: 40,
    },
    nextButton: {
        alignItems: 'flex-start',
        left: 20,
        bottom: 20,
    },
    imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1 
    },
})

// const mapStateToProps = (state) => {  
//     return {
//         loggedInStatus: state.loggedInStatus,
//     }
// };

// const mapDispatchToProps = (dispatch) => {
//     return bindActionCreators(ActionCreators, dispatch);
// };


export default LogIn;
