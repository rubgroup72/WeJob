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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../redux/actions';
import colors from '../styles/colors';
import InputField from '../components/form/InputField'
import NextArrowButton from '../components/buttons/NextArrowButton'

class LogIn extends Component {
    handleNextButton(){
        alert("Next button pressed");
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
                    >
                </InputField>

                
             </View>

            </ScrollView>
            <View style = {styles.nextButton}>
                  <NextArrowButton
                   handleOnPress={this.handleNextButton}
                   />
                </View>
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

const mapStateToProps = (state) => {
    return {
        loggedInStatus: state.loggedInStatus,
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(ActionCreators, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(LogIn);
