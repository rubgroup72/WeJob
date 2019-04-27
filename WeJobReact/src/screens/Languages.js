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
import Global from '../global';
import { DrawerActions } from 'react-navigation';



export default class Register extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = { 
            data: [],
            loadingVisible: true,
        };
      }

      static navigationOptions = ({navigation}) => {
        return {
            headerTransparent: true,
            headerTintColor: colors.green01,
            // headerRight: (
            //     <NavBarButton handleButtonPress={() => navigation.navigate('LogIn')} location="left" color={colors.white} text="  לצפיי2ה במשרות ללא הרשמה" />
            // ),
            title: 'שפות',
            headerLeft: (
                <TouchableOpacity style={styles.menu} onPress={() => navigation.dispatch(DrawerActions.openDrawer())} >
                    <Icon name="bars" size={30} color= {colors.white} />
                </TouchableOpacity>
            ),
        }
      }

      componentWillMount() {
        this.setState({
            loadingVisible: true
        });
        const httpClient = axios.create();
        httpClient.defaults.timeout = Global.DEFUALT_REQUEST_TIMEOUT_MS;
        httpClient.get( Global.BASE_URL +'language')
        .then((response) => {
            this.setState({ loadingVisible: false });
            var temp = [];
            for (var i = 0; i < response.data.length; ++i) {
                temp.push({ value: response.data[i].Name });
            }
            this.setState({ data: temp });
        })
        .catch((error) => {
            this.setState({ loadingVisible: false });
            alert (error.response.status);
        });
    }
    // static navigationOptions = ({ navigation }) => {
    //     const { state } = navigation
    //     return {
    //       headerTransparent: true,
    //       headerTintColor: colors.white,
    //     }
    //   }

    marineClicked = () =>
    {
        this.setState({ marineSciences: true });

    }
    

    render(){
          var radio_props = [
            {label: 'בסיסי', value: 0, },
            {label: 'בינוני', value: 1 },
            {label: 'שפת אם', value: 2 }
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
                            <Text style = {styles.logInHeader}> בחר שפות</Text>
                            <View style = {styles.iconsStyle}>
                            <Dropdown
                             containerStyle={{width:200}}
                             label='בחר שפה ראשונה'
                             data={this.state.data}
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
                             data={this.state.data}
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
                             label='בחר שפה שלישית'
                             data={this.state.data}
                             />
                             <RadioForm
                             radio_props={radio_props}
                             initial={0}
                             onPress={(value) => {this.setState({value:value})}}
                             />
                            </View>
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