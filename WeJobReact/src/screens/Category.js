import React, {Component} from 'react';
import colors from '../styles/colors';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ImageBackground, KeyboardAvoidingView, AsyncStorage, } from 'react-native';
import SearchInput, { createFilter } from 'react-native-search-filter';
import NextArrowButton from '../components/buttons/NextArrowButton';
import RoundedButton from '../components/buttons/RoundedButton';
import Global from '../global';
import axios from 'axios';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

//import Loader from '../components/Loader';

export default class Category extends React.Component{
 constructor(props) {
    super(props);
    this.state = {
        coding: false,
        aconomicsAndBusiness: false,
        categoriesList: [],
        loadingVisible: false,
        selectedCategory: 0,
        selectedCategoryName: '',
        studentId: 0
    }
    this.props.navigation.addListener('willFocus', this.loadComponent);
  }

  loadComponent = () => {
    this.fetchCategoryCodeFromServer();
}

fetchCategoryCodeFromServer = () => {
    AsyncStorage.getItem(Global.ASYNC_STORAGE_STUDEMT).then((jsonStudent) => {
        if (jsonStudent !== null) {
            var student = JSON.parse(jsonStudent);
            this.setState({
                studentId: student.StudentId,
            });
        }

        const httpClient = axios.create();
        httpClient.defaults.timeout = Global.DEFUALT_REQUEST_TIMEOUT_MS;
        var url = Global.BASE_URL +'Category?studentId=' + this.state.studentId;
        httpClient.get(url)
        .then((response) => {
            var selectedCategoryName = '';
            if (response.data.AllCategoriesList !== undefined) {
                for (var i = 0; i < response.data.AllCategoriesList.length; ++i) {
                    if (response.data.AllCategoriesList[i].CategoryNo === response.data.SelectedCategoryId)
                        selectedCategoryName = response.data.AllCategoriesList[i].CategoryName;
                }
            }
            this.setState({ 
                categoriesList: response.data.AllCategoriesList, 
                loadingVisible: false,
                selectedCategory: response.data.SelectedCategoryId,
                selectedCategoryName: selectedCategoryName
            });
        })
        .catch((error) => {
            this.setState({ loadingVisible: false });
        });
    });
}

selectedCategory = (i) => {
    this.setState({ selectedCategory: i.CategoryNo });
    this.setState({ selectedCategoryName: i.CategoryName });
}
getTableRows = () => {
    var tableRows = [];
    var arr = this.state.categoriesList;
    for (var i = 0; i < arr.length; i++) {
        var tempRow = [];
        tempRow.push(<RoundedButton 
            text = {arr[i].CategoryName} 
            background = { this.state.selectedCategory === arr[i].CategoryNo ? colors.white : 'transparent' }
            textColor = {this.state.selectedCategory === arr[i].CategoryNo ? colors.green01 : 'white' } 
            handleOnPress = {this.selectedCategory.bind(this, arr[i])}
            />);
        tableRows.push(tempRow);
    }
    return tableRows;
}

handleNextButtonClicked = () => {
    AsyncStorage.setItem(Global.USER_SELECTED_CATEGORY_CODE, this.state.selectedCategory.toString());
    AsyncStorage.setItem(Global.USER_SELECTED_CATEGORY_NAME, this.state.selectedCategoryName.toString());
    this.props.navigation.navigate('SubCategory');
}


  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    return {
      headerTransparent: true,
      headerTintColor: colors.white,
    }
  }

  render() {
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
                        <Text style = {styles.logInHeader}>בחר תחום עניין</Text>
                        </View>
                        <View>
                        <Table borderStyle={{borderColor: 'transparent'}}>
                            <Rows data={tableRows} textStyle={styles.text}/>
                        </Table>
                        </View>
                        <View style = {styles.nextButton}>
                            <NextArrowButton
                                handleOnPress={() => this.handleNextButtonClicked()}
                            />
                        </View>
                        {/* <Loader
                         modalVisible={this.state.loadingVisible}
                         animationType="fade" />   */}
                 </View>
                </ScrollView>
            </KeyboardAvoidingView>
         </ImageBackground>
      
    );
  }
}
 
const styles = StyleSheet.create({


  searchInput:{
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    marginBottom: 20,
    fontSize: 20,
  },
  imgBackground: {
    width: '100%',
    height: '100%',
    flex: 1 
},
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
text: {

},
nextButton: {
    alignItems: 'center',
    // left: 20,
    // bottom: 20,
},
});