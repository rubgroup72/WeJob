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



export default class JobTitles extends React.Component{
 constructor(props) {
    super(props);
    this.state = {
        selectedCategory: 0,
        JobTitlesList: [],
        loadingVisible: false,
        studentId: '',
        searchTerm: '',
        selectedJobTitlesList: [],

    }
  }

  componentWillMount() {

    //הבאת מספר הקטגוריה שנבחרה מהזיכרון הלוקאלי
    AsyncStorage.getItem(Global.USER_SELECTED_CATEGORY_CODE).then((SelectedCategoryCode) => {
        this.setState({ selectedCategory: SelectedCategoryCode });
        this.fetchJobNamesFromServer();
    });
    //  הבאת אובייקט הסטודנט מהזיכרון הלוקאלי והשמת המספר האישי שלו במשתנה
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
fetchJobNamesFromServer = () => {
    const httpClient = axios.create();
    httpClient.defaults.timeout = Global.DEFUALT_REQUEST_TIMEOUT_MS;
    var url = Global.BASE_URL +'AppJobController?categoryNo=' + this.state.selectedCategory;
    httpClient.get(url)
    .then((response) => {
        this.setState({ JobTitlesList: response.data, loadingVisible: false });
    })
    .catch((error) => {
        this.setState({ loadingVisible: false });
        alert(this.state.selectedCategory)
    });
}

//פוקנציה שמפועלת בעת בחירת המשרות הרצויות
selectedJobTitlesEvent = (i) => {
    var currentSelectedJobTitlesList = this.state.selectedJobTitlesList;
    if (!currentSelectedJobTitlesList.includes(i)) {
        currentSelectedJobTitlesList.push(i);
    } else {
        var index = currentSelectedJobTitlesList.indexOf(i);
        currentSelectedJobTitlesList.splice(index, 1);
    }

    this.setState({ selectedJobTitlesList: currentSelectedJobTitlesList });
}

//יצירת טבלה כך שבכל שורה יופיעו 2 משרות
getTableRows = () => {
    var tableRows = [];
    var arr = this.state.JobTitlesList;
    var currentSelectedJobTitlesList = this.state.selectedJobTitlesList;
    var maxResults = 10;
    var amountOfResults = 0;
    var tempRow = [];
    for (var i = 0; i < arr.length; i = ++i) {
        if (tempRow.length == 2) {
            tableRows.push(tempRow);
            tempRow = [];
        }

        if (this.state.searchTerm != '' && !arr[i].JobName.toLowerCase().includes(this.state.searchTerm.toLowerCase()))
            continue;

        var isSelected = currentSelectedJobTitlesList.includes(arr[i].JobNo);
        if (this.state.searchTerm == '' && amountOfResults >= maxResults && !isSelected)
            continue;

        tempRow.push(<RoundedButton text = {arr[i].JobName} 
            background = { isSelected ? colors.white : 'transparent' }
            textColor = { isSelected ? colors.green01 : 'white' } 
            handleOnPress = {this.selectedJobTitlesEvent.bind(this, arr[i].JobNo)}
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

//השמת המשרות הנבחרות לדטא בייס
handleNextButtonClicked = () => {
    var jobTtilesList = [];
    for (var i = 0; i < this.state.selectedJobTitlesList.length; ++i) {
        jobTtilesList.push({ JobNo: this.state.selectedJobTitlesList[i] });
    }

    const httpClient = axios.create();
    httpClient.defaults.timeout = 15000;
    httpClient.post(Global.BASE_URL +'AppJobController', {
        JobTitlesList: jobTtilesList,
        StudentId: this.state.studentId
    }, 
    )
    .then((response) => {
        this.setState({ loadingVisible: false });
        alert ('GOOD JOB! May the odds be ever in your favor');
        this.props.navigation.navigate('Main');
    })
    .catch((error) => {
        this.setState({ loadingVisible: false });
        alert (error.response.status);
    });
}

//ניווט
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
                        <Text style = {styles.logInHeader}>איזה תפקיד תרצה לעשות </Text>
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