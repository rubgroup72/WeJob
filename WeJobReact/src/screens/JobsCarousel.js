import { DrawerActions } from 'react-navigation';    
import React from 'react';
import { StyleSheet,Text, Image, View, Platform, ScrollView, ImageBackground, Modal, TouchableOpacity, TouchableHighlight, Alert, I18nManager, KeyboardAvoidingView} from 'react-native';
import axios from 'axios';
import Global from '../global';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import Carousel from 'react-native-snap-carousel';
import AsyncStorage from '@react-native-community/async-storage';
import Swipeout from 'react-native-swipeout';
import Loader from '../components/Loader';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../styles/colors';
import RoundedButton from '../components/buttons/RoundedButton';
import { CheckBox, ButtonGroup, Button } from 'react-native-elements'

export default class JobsCarousel extends React.Component {
 
    constructor(props){
        super(props);
        I18nManager.forceRTL(true);
        I18nManager.isRTL = true;
        this.state = {
            studentId: '',
            activeIndex:0,
            JobsList: [],
            isModalVisible: false,
            selectedJob: null,
            loadingVisible: true,
            isSearchModalVisible: false,
            companyList: [],
            locationList: [],
            jobTitleList: [],
            selectedSearchIndex: 0,
            companySearchAmount: 0,
            locationSearchAmount: 0,
            jobTitleSearchAmount: 0,
        }

    }
//ברגע שהדף סיים להיטען יתבצע מה שכתוב בפונקציה 
    componentWillMount() {
        //  הבאת אובייקט סטודנט מהזיכרון הלוקאלי והשמת המספר האישי שלו במשתנה
        AsyncStorage.getItem(Global.ASYNC_STORAGE_STUDEMT).then((jsonStudent) => {
            if (jsonStudent !== null) {
                var student = JSON.parse(jsonStudent);
                this.setState({
                    studentId: student.StudentId
                });
                //הפעלת הפונקציה שמביאה את המשרות המתאימות לסטודנט לפי 3 תנאים
                this.fetchJobsFromServer();
            } else {
                this.setState({ loadingVisible: false });
            }
        });
    }

    //הבאת המשרות  מהדטא בייס לפי 3 התנאים להצגת משרה (אחד לאחד בין תגיות ,אחד לאחד בין תפקיד, והאלגוריתם 
    fetchJobsFromServer = () => {
        const httpClient = axios.create();
        httpClient.defaults.timeout = Global.DEFUALT_REQUEST_TIMEOUT_MS;
        var url = Global.BASE_URL +'AppJobController?studentId=' + this.state.studentId;
        httpClient.get(url)
        .then((response) => {
            this.setState({ JobsList: response.data, loadingVisible: false });
            this.buildSearchList(response.data);
        })
        .catch((error) => {
            this.setState({ loadingVisible: false });
        });
    }

    checkIfKeyExists = (list, key) => {
        for (var i = 0; i < list.length; ++i) {
            if (list[i].key === key) {
                return true;
            }
        }
        return false;
    }

    buildSearchList = (jobs) => {
        var locationList = [];
        var jobTitleList = [];
        var companyList = [];
        for (var i = 0; i < jobs.length; ++i) {
            var j = jobs[i];
            if (!this.checkIfKeyExists(locationList, j.Location)) {
                locationList.push({ key: j.Location, isSelected: false });
            }
            if (!this.checkIfKeyExists(companyList, j.CompanyName)) {
                companyList.push({ key: j.CompanyName, isSelected: false });
            }
            if (!this.checkIfKeyExists(jobTitleList, j.JobName)) {
                jobTitleList.push({ key: j.JobName, isSelected: false});
            }
        }

        this.setState({ 
            locationList: this._sortSearcArray(locationList), 
            companyList: this._sortSearcArray(companyList), 
            jobTitleList: this._sortSearcArray(jobTitleList)
        });
    }

    _sortSearcArray = (arr) => {
        return arr.sort(function (a, b) {
            var keyA = a.key, keyB = b.key;
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });
    }
    

//התפריט למעבר בין הדפים
    static navigationOptions = ({navigation}) => {
        return {
            headerTransparent: true,
            headerStyle: {backgroundColor:'#3c3c3c'},
            headerRight: (
                <TouchableOpacity  onPress={() => navigation.dispatch(DrawerActions.openDrawer())} >
                    <Icon name="bars" size={30} color= {colors.white} />
                </TouchableOpacity>

            ),
        }
        }
///לכל פריט בקרוסלה נציג את הנתונים הבאים
    _renderItem = ({item,index}) => {
        return (
            <View style={{ width: 200, height: 200, flexDirection: 'row', margin: 24, top: 200 }}>
                <Image
                style={{ width: 200, height: 200, position: 'absolute' }}
                source={{ uri: 'https://www.dike.lib.ia.us/images/sample-1.jpg/image' }}
                />
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', alignSelf: 'flex-end' }}>
                <Text style={{ color: 'white', fontSize: 20, margin: 6 }}>{item.JobName}</Text>
                <Text style={{ color: 'white', margin: 6 }}>{item.JobDescription}</Text>
                </View>
             </View>
        )
    }

    _renderJob = (job, index) => {
        var backgroundImage = require('../../images/jobBackground.jpg')
        if (job.IsFromSmartAlgo) {
            backgroundImage = require('../../images/jobBackgroundWithRibbon.jpg')
        }
        let swipeBtns = [{
            text: 'מחיקה',
            backgroundColor: 'red',
            underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () => { 
                var jobToRemove = this.state.JobsList[index];
                var newJobList = this.state.JobsList;
                newJobList.splice(index, 1); 
                this.setState({ JobsList: newJobList });
                // Update server
                const httpClient = axios.create();
                httpClient.defaults.timeout = Global.DEFUALT_REQUEST_TIMEOUT_MS;
                var url = Global.BASE_URL +'AppStudentRemoveJobController?studentId=' + this.state.studentId + '&jobNo=' + jobToRemove.JobNo;
                httpClient.get(url);
            }
        }];
        return  <Swipeout left={swipeBtns} key={index}
                    autoClose={true}
                    backgroundColor= 'transparent'>
                    <Card >
                        <CardImage
                        style={{color:'#FEB557'}}
                        source={backgroundImage}
                        title={job.JobName} 
                        />
                        <CardTitle
                        style={{textAlign: 'right'}}
                        subtitle={job.CompanyName}
                        />
                        <CardContent text={job.JobDescription} />
                        <CardAction separator={true} inColumn={false}>
                        <CardButton onPress={() => { 
                            this.setState({ 
                                isModalVisible: true,
                                selectedJob: job,
                            });
                            }}
                            title="פרטי משרה" color="#FEB557" />
                        <Icon name="heart" size={26} style={{ flexDirection: 'row', justifyContent: 'flex-end' }} onPress={() => {}}  color="#FEB557" />
                        </CardAction>
                    </Card>
                </Swipeout>;
    }
    _getEmptyJobsListScreen = () => {
        return <Text>אין משרות מתאימות לך כרגע.. מומלץ למלא דפי הרשמה</Text>
    }
    _updateSearchByListIndex = (selectedIndex) => {
        this.setState({ 
            selectedSearchIndex: selectedIndex,
        });
    }
    _checkIfJobFilter = (job) => {
        // Check if location
        var atLeastOne = 0;
        if (this.state.locationSearchAmount > 0) {
            for (var i = 0; i < this.state.locationList.length; ++i) {
                var l = this.state.locationList[i];
                if (l.isSelected) {
                    if (atLeastOne === 0) {
                        atLeastOne = 1;
                    }
                    if (l.key === job.Location) {
                        atLeastOne = 2;
                        break;
                    }
                }
            }
            if (atLeastOne === 1) {
                return false;
            }
        }


        // Check if company
        var atLeastOne = 0;
        if (this.state.companySearchAmount > 0) {
            for (var i = 0; i < this.state.companyList.length; ++i) {
                var item = this.state.companyList[i];
                if (item.isSelected) {
                    if (atLeastOne === 0) {
                        atLeastOne = 1;
                    }
                    if (item.key === job.CompanyName) {
                        atLeastOne = 2;
                        break;
                    }
                }
            }
            if (atLeastOne === 1) {
                return false;
            }
        }


        // Check if job title
        var atLeastOne = 0;
        if (this.state.jobTitleSearchAmount > 0) {
            for (var i = 0; i < this.state.jobTitleList.length; ++i) {
                var item = this.state.jobTitleList[i];
                if (item.isSelected) {
                    if (atLeastOne === 0) {
                        atLeastOne = 1;
                    }
                    if (item.key === job.JobName) {
                        atLeastOne = 2;
                        break;
                    }
                }
            }
            if (atLeastOne === 1) {
                return false;
            }
        }
        return true;
    }
    _getJobsList = () => {
        if (this.state.JobsList.length === 0) {
            return this._getEmptyJobsListScreen();
        }
        var ret = [];
        for (var i = 0; i < this.state.JobsList.length; ++i) {
            var j = this.state.JobsList[i];
            if (!this._checkIfJobFilter(j))
                continue;
            ret.push(this._renderJob(j, i));
        }
        return ret;
    }
    _getModalForJob = () => {
        var modalTitle = '', modalDescription = '', location ='', Requirements= '', OpenDate ='';
        if (this.state.selectedJob !== null && this.state.selectedJob !== undefined) {
            modalTitle = this.state.selectedJob.JobName;
            modalDescription = this.state.selectedJob.JobDescription;
            location = this.state.selectedJob.Location;
            Requirements = this.state.selectedJob.Requirements;
            OpenDate = this.state.selectedJob.OpenDate;
        }
        //הדף שך פרטי משרה
        return <ScrollView behavior="padding" enabled keyboardShouldPersistTaps='always' style={styles.wrapper}>
                <View >
                <TouchableHighlight
                            onPress={() => { this.setState({ isModalVisible: false}); }}>
                            <Icon name="close" size={30} style={{paddingLeft: 10, paddingTop:10}}></Icon>
                        </TouchableHighlight>
                        <Text style={{fontSize: 30, textAlign:"center", marginBottom:20}}> { modalTitle }</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Icon name="map-marker" size={30} style={{paddingRight:20}} />
                            <Text style={{fontSize: 20, paddingRight:5}}>{ location }</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Icon name="calendar" size={25} style={{paddingRight:20, paddingTop: 5}} />
                            <Text style={{fontSize: 20, paddingRight:5}}>{ OpenDate }</Text>
                        </View>
                     <View style={{backgroundColor:'#FFF8F0'}}>
                        <Text style={{fontSize: 30 , paddingRight:20, paddingBottom:10}}>תיאור:</Text>
                        <Text style={{fontSize: 20 , paddingRight:20, paddingBottom:10}}> { modalDescription }</Text>
                        <Text style={{fontSize: 30 , paddingRight:20, paddingBottom:10}}>דרישות תפקיד:</Text>
                        <Text style={{fontSize: 20 , paddingRight:20, paddingBottom:10}}> { Requirements }</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Icon name="star" size={30} style={{paddingRight:20}} />
                            <Icon name="trash" size={30} style={{paddingRight:20}} />
                       </View>
                     </View>
                     <RoundedButton
                            text = 'שלח קורות חיים  '
                            textColor = "#FFF8F0"
                            background= "#FF8811"
                            //style={{position:'absolute', buttom:0 ,top: 0}}
                            //icon={<Icon name="facebook" size={20} />}
                            handleOnPress={() => {}}
                            />
                </View>     
             </ScrollView>;
    }

    _getCurrentSearchList = () => {
        if (this.state.selectedSearchIndex === 0) {
            return this.state.companyList;
        } else if (this.state.selectedSearchIndex === 1) {
            return this.state.jobTitleList;
        }
        return this.state.locationList;

    }
    _getSearchList = () => {
        var list = this._getCurrentSearchList();

        var retList = [];
        for (var i = 0; i < list.length; ++i) {
            if (list[i].key === "" || list[i].key === undefined || list[i].key === null)
                continue;
            retList.push(
                <CheckBox
                    key={i}
                    title={list[i].key}
                    checked={list[i].isSelected}
                    onPress = {this._toggleSearchItem.bind(this, i)}
                />
            );
        }

        return retList;
    }

    _toggleSearchItem = (index) => {
        var list;
        var selectedAmount;
        if (this.state.selectedSearchIndex === 0) {
            list = this.state.companyList;
            selectedAmount = this.state.companySearchAmount;
        } else if (this.state.selectedSearchIndex === 1) {
            list = this.state.jobTitleList;
            selectedAmount = this.state.jobTitleSearchAmount;
        } else {
            list = this.state.locationList;
            selectedAmount = this.state.locationSearchAmount;
        }

        list[index].isSelected = !list[index].isSelected;
        if (list[index].isSelected)
            selectedAmount++;
        else
            selectedAmount--;
        
        if (this.state.selectedSearchIndex === 0) {
            this.setState({ companyList: list, companySearchAmount: selectedAmount });
        } else if (this.state.selectedSearchIndex === 1) {
            this.setState({ jobTitleList: list, jobTitleSearchAmount: selectedAmount });
        } else {
            this.setState({ locationList: list, locationSearchAmount: selectedAmount });
        }
    }
    _clearSearchList = (list) => {
        for (var i = 0; i < list.length; ++i) {
            list[i].isSelected = false;
        }
        return list;
    }
    _clearSearchLists = () => {
        var locationList = this._clearSearchList(this.state.locationList);
        var companyList = this._clearSearchList(this.state.companyList);
        var jobTitleList = this._clearSearchList(this.state.jobTitleList);

        this.setState({ 
            locationList: locationList, 
            companyList: companyList,
            jobTitleList: jobTitleList,
            locationSearchAmount: 0,
            companySearchAmount: 0,
            jobTitleSearchAmount: 0,
        });
    }
    _getModalForSearch = () => {
        var searchList = this._getSearchList();
        var searchByTitles = [ 'חברה', 'תפקיד', 'מיקום' ];
        var trashColor = '#c4c4c4';
        if (this.state.jobTitleSearchAmount + this.state.locationSearchAmount + this.state.companySearchAmount > 0) {
            trashColor = '#f46842';
        }
        return <View style={{flex: 1,
                            justifyContent: 'space-between', // 'flex-start',
                            alignItems: 'stretch', // 'center',
                            flexDirection: 'column',
                            flexWrap: 'wrap',}}>
                    <View style={{flex: 1,
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',}}>
                        <View style={{width: 50, height: 50, }} >
                            <Button
                                type="clear"
                                containerStyle={{marginTop: 10}}
                                icon={
                                    <Icon
                                      name="trash"
                                      size={24}
                                      color={trashColor}
                                    />
                                }
                                onPress={this._clearSearchLists}
                            />
                        </View>
                        <View style={{width: 60, height: 50, }} >
                            <Text style={{marginTop: 10, fontSize: 24}}>
                                סינון
                            </Text>
                        </View>
                        <View style={{width: 50, height: 50, }} >
                            <Button
                                containerStyle={{marginTop: 10}}
                                textStyle={{fontSize: 20}}
                                title="אשר"
                                type="clear"
                                onPress={() => {this.setState({ isSearchModalVisible: false }); }}
                            />
                        </View>
                    </View>
                    <ButtonGroup
                                onPress={this._updateSearchByListIndex}
                                selectedIndex={this.state.selectedSearchIndex}
                                buttons={searchByTitles}
                                containerStyle={{height: 50, flex: 1}}
                    />
                    <View style={{flex: 10, alignItems: 'stretch', alignContent: 'stretch' }}>
                        <ScrollView style={styles.scrollViewStyle}> 
                            { searchList }
                        </ScrollView>
                    </View>
                </View>;
    }
    _getFilterText = () => {
        var empty =  'לחץ כאן בכדי לחפש';
        var filterBy = '';

        if (this.state.locationSearchAmount > 0) {
            filterBy += 'מיקום';
        }
        if (this.state.companySearchAmount > 0) {
            filterBy += (filterBy === '' ? '' : ' , ') + 'שם חברה';
        }
        if (this.state.jobTitleSearchAmount > 0) {
            filterBy += (filterBy === '' ? '' : ' , ') + 'משרה';
        }

        return filterBy === '' ? empty : ('מפלטר לפי: ' + filterBy);
    }

    render() {
        var jobsList = this._getJobsList();
        var filterText = this._getFilterText();
        return (
            <View style={styles.main}>

                <ImageBackground style={ styles.imgBackground }
                    resizeMode='cover' 
                    source={require('../img/blue.jpeg')}>

                    <View style={styles.searchViewStyle} maxHeight={35}>
                        <TouchableOpacity onPress={() => {
                            this.setState({ isSearchModalVisible: true });
                        }}> 
                            <Icon name="filter" size={30} style={styles.searchFilterIconStyle} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.setState({ isSearchModalVisible: true });
                        }}>
                            <Text adjustsFontSizeToFit maxHeight={50} style={styles.seacchTextBoxStyle}
                            numberOfLines={1}> { filterText} </Text>
                        </TouchableOpacity>

                    </View>

                    <ScrollView style={styles.scrollViewStyle}> 
                        { jobsList }
                    </ScrollView>

                    
                </ImageBackground>

                <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.isModalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                        }}>
                            { this._getModalForJob() }
                </Modal>

                <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.isSearchModalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                        }}>
                            { this._getModalForSearch() }
                </Modal>

                <Loader
                modalVisible={this.state.loadingVisible}
                animationType="fade" />  
                
            </View>
        );
    }
}

//עיצובים של העמוד
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    backgroundColor:'#131420',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgBackground: {
    width: '100%',
    height: '110%',
    flex: 1,
    paddingTop: 50,
},
scrollViewStyle: {
    flex: 1,
},
searchViewStyle: {
    marginRight: 7,
    marginLeft: 7,
    borderColor: '#d6d7da',
    borderRadius: 4,
    borderWidth: 0.5,
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row'
},
searchFilterIconStyle: {
    backgroundColor: '#FEB557',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    // padding: 5,
},
seacchTextBoxStyle: {
    marginTop: 7,
    justifyContent: 'center',
    alignItems: 'center',
},
main: {
    flex: 1   
   },
   wrapper: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#9DD9D2',
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
});

