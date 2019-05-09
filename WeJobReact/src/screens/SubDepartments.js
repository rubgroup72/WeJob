import React, {Component} from 'react';
import colors from '../styles/colors';
import {StyleSheet, Text, View, Image, Button, ScrollView, AsyncStorage,
    KeyboardAvoidingView, TouchableOpacity, ImageBackground  } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import axios from 'axios';
import Loader from '../components/Loader';
import NextArrowButton from '../components/buttons/NextArrowButton';
import Global from '../global';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import RoundedButton from '../components/buttons/RoundedButton';

export default class Register extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = { 
            selectedDepartment: 0,
            subDepartmentList: [],
            loadingVisible: false,
            selectedSubDepartment: 0,
            email:'',
        };
      }

    componentWillMount() {
        AsyncStorage.getItem(Global.USER_SELECTED_DEPARTMENT_CODE).then((departmentCode) => {
            this.setState({ selectedDepartment: departmentCode });
            this.fetchSubDepartmentCodeFromServer();
        });
        AsyncStorage.getItem(Global.USER_EMAIL).then((Email) => {
            this.setState({ email: Email });
        }); 
    }
    
    fetchSubDepartmentCodeFromServer = () => {
        const httpClient = axios.create();
        httpClient.defaults.timeout = Global.DEFUALT_REQUEST_TIMEOUT_MS;
        var url = Global.BASE_URL +'AppGetSubDepartment?departmentCode=' + this.state.selectedDepartment;
        httpClient.get(url)
        .then((response) => {
            this.setState({ subDepartmentList: response.data, loadingVisible: false });
        })
        .catch((error) => {
            this.setState({ loadingVisible: false });
        });
    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation
        return {
          headerTransparent: true,
          headerTintColor: colors.white,
        }
      }

    selectedSubDepartmentEvent = (i) => {
        this.setState({ selectedSubDepartment: i });
    }
    getTableRows = () => {
        var tableRows = [];
        var arr = this.state.subDepartmentList;
        for (var i = 0; i < arr.length; i++) {
            var tempRow = [];
            tempRow.push(<RoundedButton text = {arr[i].SubDepartmentName}
                background = { this.state.selectedSubDepartment === arr[i].SubDepartmentId ? colors.white : 'transparent' }
                textColor = {this.state.selectedSubDepartment === arr[i].SubDepartmentId ? colors.green01 : 'white' } 
                handleOnPress = {this.selectedSubDepartmentEvent.bind(this, arr[i].SubDepartmentId)}
                />);
            tableRows.push(tempRow);
        }
        return tableRows;
    }

    handleNextButtonClicked = () => {
        const httpClient = axios.create();
        httpClient.defaults.timeout = 15000;
        if (this.state.selectedSubDepartment == 0)
        alert("חייב לבחור מחלקה")
        else {
            httpClient.post(Global.BASE_URL +'AppUpdateSubDepartment', {
                Email: this.state.email,
                DepartmentCode: this.state.selectedDepartment,
                SubDepartmentCode: this.state.selectedSubDepartment,
            }, 
            )
            .then((response) => {
                this.setState({ loadingVisible: false });
                AsyncStorage.getItem(Global.ASYNC_STORAGE_STUDEMT).then((jsonStudent) => {
                    var student = JSON.parse(jsonStudent);
                    student.DepartmentCode = this.state.selectedDepartment;
                    student.SubDepartmentCode = this.state.selectedSubDepartment;
                    AsyncStorage.setItem(Global.ASYNC_STORAGE_STUDEMT, JSON.stringify(student));
                    this.props.navigation.navigate('Languages');
                });
            })
            .catch((error) => {
                this.setState({ loadingVisible: false });
                alert (error.response.status);
            });
        }
    
    }
    render(){
        var tableRows = this.getTableRows();
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
                        <Text style = {styles.logInHeader}>באיזו מחלקה?</Text>
                        <Table borderStyle={{borderColor: 'transparent'}}>
                            <Rows data={tableRows} textStyle={styles.text}/>
                        </Table>
                        </View>
                        <View style = {styles.nextButton}>
                                <NextArrowButton
                                 handleOnPress={() => this.handleNextButtonClicked()}
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

    nextButton: {
        alignItems: 'center',
        // left: 20,
        // bottom: 20,
    },

    imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1 
},

});