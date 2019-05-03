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

const KEYS_TO_FILTERS = ['user.name', 'subject'];
 
export default class SubCategory extends React.Component{
 constructor(props) {
    super(props);
    this.state = {
        selectedCategory: 0,
        subCategoriesList: [],
        loadingVisible: false,
        //selectedSubDepartment: 0,
        email:'',
        searchTerm: '',
        selectedSubCategoryList: [],
    }
  }

  componentWillMount() {
    AsyncStorage.getItem(Global.USER_SELECTED_CATEGORY_CODE).then((SelectedCategoryCode) => {
        this.setState({ selectedCategory: SelectedCategoryCode });
        this.fetchSubCategoryCodeFromServer();
    });
    AsyncStorage.getItem(Global.USER_EMAIL).then((Email) => {
        this.setState({ email: Email });
    }); 
}

fetchSubCategoryCodeFromServer = () => {
    const httpClient = axios.create();
    httpClient.defaults.timeout = Global.DEFUALT_REQUEST_TIMEOUT_MS;
    var url = Global.BASE_URL +'AppGetTagsbyCategory?categoryCode=' + this.state.selectedCategory;
    httpClient.get(url)
    .then((response) => {
        this.setState({ subCategoriesList: response.data, loadingVisible: false });
    })
    .catch((error) => {
        this.setState({ loadingVisible: false });
    });
}

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
getTableRows = () => {
    var tableRows = [];
    var arr = this.state.subCategoriesList;
    var maxIterations = arr.length > 10 ? 10 : arr.length;
    var currentSelectedSubCategoryList = this.state.selectedSubCategoryList;
    for (var i = 0; i < maxIterations; i = i + 2) {
        var tempRow = [];
        
        for (var j = 0; j < 2; j++) {
            if (i + j == maxIterations) {
                return;
            }

            var isSelected = currentSelectedSubCategoryList.includes(arr[i + j].Id);
            tempRow.push(<RoundedButton text = {arr[i + j].TagName} 
                background = { isSelected ? colors.white : 'transparent' }
                textColor = { isSelected ? colors.green01 : 'white' } 
                handleOnPress = {this.selectedSubCategoryEvent.bind(this, arr[i + j].Id)}
                />);
        }
        
        
        tableRows.push(tempRow);
    }
    return tableRows;
}


  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    return {
      headerTransparent: true,
      headerTintColor: colors.white,
    }
  }

  render() {
    // const filteredEmails = emails.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
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
                        <Text style = {styles.logInHeader}>בחר תחומי עניין</Text>
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
                            {/* {filteredEmails.map(email => {
                            return (
                                // <RoundedButton
                                //     handleOnPress={()=>alert(email.user.name)}
                                //     key={email.id}
                                //     text = {email.user.name}
                                //     textColor = {colors.white}>
                                    
                                // </RoundedButton>
                                <Table borderStyle={{borderColor: 'transparent'}}>
                                  <Rows data={tableRows} textStyle={styles.text}/>
                                </Table>
                            )
                            })} */}
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