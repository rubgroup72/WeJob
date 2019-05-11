import React, {Component} from 'react';
import colors from '../styles/colors';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ImageBackground, KeyboardAvoidingView, AsyncStorage} from 'react-native';
import SearchInput, { createFilter } from 'react-native-search-filter';
import NextArrowButton from '../components/buttons/NextArrowButton';
import RoundedButton from '../components/buttons/RoundedButton';
import Global from '../global';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import axios from 'axios';
//import Loader from '../components/Loader';



export default class SubCategory extends React.Component{
 constructor(props) {
    super(props);
    this.state = {
        selectedCategory: 0,
        subCategoriesList: [],
        loadingVisible: false,
        studentId: '',
        searchTerm: '',
        selectedSubCategoryList: [],
        selectedCategoryName: ''
    }
  }

  componentWillMount() {
    //הבאת שם הקטגוריה שנבחרה מהזיכרון הלוקאלי
    AsyncStorage.getItem(Global.USER_SELECTED_CATEGORY_NAME).then((CategoryName) => {
    this.setState({ selectedCategoryName: CategoryName });
    }); 
    //הבאת מספר הקטגוריה שנבחרה מהזיכרון הלוקאלי
    AsyncStorage.getItem(Global.USER_SELECTED_CATEGORY_CODE).then((SelectedCategoryCode) => {
        this.setState({ selectedCategory: SelectedCategoryCode });
        this.fetchSubCategoryCodeFromServer();
    });
    //הבאת אובייקט הסטודנט מהזיכרון הלוקאלי
    AsyncStorage.getItem(Global.ASYNC_STORAGE_STUDEMT).then((jsonStudent) => {
        if (jsonStudent !== null) {
            var student = JSON.parse(jsonStudent);
            this.setState({
                studentId: student.StudentId
            });
        }
    });
}

//הבאת השמות של המשרות מהדטא בייס
fetchSubCategoryCodeFromServer = () => {
    const httpClient = axios.create();
    httpClient.defaults.timeout = Global.DEFUALT_REQUEST_TIMEOUT_MS;
    var url = Global.BASE_URL +'AppSubCategoryController?categoryCode=' + this.state.selectedCategory;
    httpClient.get(url)
    .then((response) => {
        this.setState({ subCategoriesList: response.data, loadingVisible: false });
    })
    .catch((error) => {
        this.setState({ loadingVisible: false });
    });
}

//פוקנציה שמפועלת בעת בחירת התגיות הרצויות
selectedSubCategoryEvent = (i) => {
    var currentSelectedSubCategoryList = this.state.selectedSubCategoryList;
    if (!currentSelectedSubCategoryList.includes(i)) {
        currentSelectedSubCategoryList.push(i);
    } else {
        var index = currentSelectedSubCategoryList.indexOf(i);
        currentSelectedSubCategoryList.splice(index, 1);
    }

    this.setState({ selectedSubCategoryList: currentSelectedSubCategoryList });
}

//יצירת טבלה כך שבכל שורה יופיעו 2 תגיות
getTableRows = () => {
    var tableRows = [];
    var arr = this.state.subCategoriesList;
    var currentSelectedSubCategoryList = this.state.selectedSubCategoryList;
    var maxResults = 10;
    var amountOfResults = 0;
    var tempRow = [];
    for (var i = 0; i < arr.length; i = ++i) {
        if (tempRow.length == 2) {
            tableRows.push(tempRow);
            tempRow = [];
        }

        if (this.state.searchTerm != '' && !arr[i].TagName.toLowerCase().includes(this.state.searchTerm.toLowerCase()))
            continue;

        var isSelected = currentSelectedSubCategoryList.includes(arr[i].SubCategoryNo);
        if (this.state.searchTerm == '' && amountOfResults >= maxResults && !isSelected)
            continue;

        tempRow.push(<RoundedButton text = {arr[i].TagName} 
            background = { isSelected ? colors.white : 'transparent' }
            textColor = { isSelected ? colors.green01 : 'white' } 
            handleOnPress = {this.selectedSubCategoryEvent.bind(this, arr[i].SubCategoryNo)}
            />);
        amountOfResults++;
    }
    if (tempRow.length != 0)
        tableRows.push(tempRow);

    return tableRows;
}

//חיפוש תגיות
  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

//השמת הקטגוריות הנבחרות לדטא בייס
handleNextButtonClicked = () => {
    var tagsList = [];
    for (var i = 0; i < this.state.selectedSubCategoryList.length; ++i) {
        tagsList.push({ SubCategoryNo: this.state.selectedSubCategoryList[i] });
    }

    const httpClient = axios.create();
    httpClient.defaults.timeout = 15000;
    httpClient.post(Global.BASE_URL +'AppSubCategoryController', {
        TagsList: tagsList,
        StudentId: this.state.studentId
    }, 
    )
    .then((response) => {
        this.setState({ loadingVisible: false });
        //alert ('hi');
        this.props.navigation.navigate('JobTitles');
    })
    .catch((error) => {
        this.setState({ loadingVisible: false });
        alert (error.response.status);
    });
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
                        <Text style = {styles.logInHeader}>מה מעניין אותך בעולם </Text>
                        <Text style = {styles.logInHeaderCatName}> ה{this.state.selectedCategoryName}</Text>
                        </View>
                        <View>
                            <SearchInput 
                            onChangeText={(term) => { this.searchUpdated(term) }} 
                            style={styles.searchInput}
                            placeholder="חפש..."
                            placeholderTextColor = {colors.white01}
                            />
                            <ScrollView>
                                <Table borderStyle={{borderColor: 'transparent'}}>
                                    <Rows data={tableRows} textStyle={styles.text}/>
                                </Table>
                            </ScrollView>
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
logInHeaderCatName: {
    fontSize: 35,
    color: colors.green01,
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
});