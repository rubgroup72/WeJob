import React, {Component} from 'react';
import colors from '../styles/colors';
import {StyleSheet, Text, View, Image, Button, ScrollView,
    KeyboardAvoidingView, TouchableOpacity, ImageBackground  } from 'react-native';
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

    }
    

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
                             data={data}
                             />
                             <RadioForm
                             radio_props={radio_props}
                             initial={0}
                             onPress={(value) => {this.setState({value:value})}}
                             />
                            </View>
                            <View style = {styles.iconsStyle}>
                            <Dropdown
                             containerStyle={{width:200}}
                             label='בחר שפה שנייה'
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