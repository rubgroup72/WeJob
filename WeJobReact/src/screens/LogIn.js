import React, {Component} from 'react';
import { PropTypes} from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
} from 'react-native';

import colors from '../styles/colors';
import InputField from '../components/form/InputField';
import NextArrowButton from '../components/buttons/NextArrowButton';
import RoundedButton from '../components/buttons/RoundedButton';
import axios from 'axios';
import Loader from '../components/Loader';

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
        axios.post("http://10.0.2.2:53411/api/Login", {
            Email: this.state.email,
            Password: this.state.password,
        })
        .then((response) => {
            this.setState({ loadingVisible: false });
            if (response.data.Message === '') {
                alert ('Login succes');
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
            <View style = {styles.nextButton}>
                  <NextArrowButton
                   handleOnPress={() => this.props.navigation.navigate('Home')}
                   />
            </View>
            <Loader
             modalVisible={this.state.loadingVisible}
             animationType="fade" />  
        </KeyboardAvoidingView>       
        );
          
    }
}

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        flex: 1,
        backgroundColor: colors.green01,
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
    }
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
