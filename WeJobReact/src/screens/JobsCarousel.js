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
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import Moment from 'moment';
import BottomNavigation, { FullTab } from 'react-native-material-bottom-navigation';

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
            activeTab: 0,
        }

        this.props.navigation.addListener('willFocus', this.loadComponent);
    }
//ברגע שהדף סיים להיטען יתבצע מה שכתוב בפונקציה 
    componentWillMount() {
        this.loadComponent();
    }
    loadComponent = () => {
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
    const { params = {} } = navigation.state;
    var headerLeftInternal = (<TouchableOpacity style={styles.menu} onPress={() => navigation.dispatch(DrawerActions.openDrawer())} >
        <Icon name="bars" size={30} color= {colors.white} />
        </TouchableOpacity>);
    var title = 'משרות מומלצות עבורך';
    return {
        headerTransparent: true,
        headerTintColor: colors.white,
        title: title,
        headerLeft: headerLeftInternal,
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

        var heartType = 'heart-o';
        var heartColor = '#999999';
        if (job.StudentJobStatus === 'save' || job.StudentJobStatus === 'save and cv') {
            heartType = 'heart';
            heartColor = 'red'; 
        }

        let swipeBtns = [{
            text: 'מחיקה',
            backgroundColor: 'red',
            underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () => { 
                var jobToRemove = this.state.JobsList[index];
                this._removeJob(jobToRemove);
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
                        <Icon name={heartType} size={26}  onPress={this._saveJob.bind(this, job)}  color={heartColor} />                       
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
            
            if (this.state.activeTab === 0 && !(j.StudentJobStatus === 'new' || j.StudentJobStatus === 'save'))
                continue;
            if (this.state.activeTab === 1 && !(j.StudentJobStatus === 'save'))
                continue;
            if (this.state.activeTab === 2 && !(j.StudentJobStatus === 'send cv' || j.StudentJobStatus === 'save and cv'))
                continue;
            
            ret.push(this._renderJob(j, i));
        }
        return ret;
    }

    _removeJob = (jobToRemove) => {
        var newJobList = this.state.JobsList;
        var index = 0;
        for (var i = 0; i < newJobList.length; ++i) {
            if (newJobList[i].JobNo === jobToRemove.JobNo) {
                index = i;
                break;
            }
        }
        newJobList.splice(index, 1); 
        // Update server
        const httpClient = axios.create();
        httpClient.defaults.timeout = Global.DEFUALT_REQUEST_TIMEOUT_MS;
        httpClient.post(Global.BASE_URL +'AppStudnetJobStatus', {
            StudentId: this.state.studentId,
            JobId: jobToRemove.JobNo,
            Status: 'delete'
        });
        this.setState({ JobsList: newJobList, isModalVisible: false });
    }
    _saveJob = (job) => {
        if (job.StudentJobStatus === "send cv") {
            job.StudentJobStatus = "save and cv";
        } else if (job.StudentJobStatus === "save and cv") {
            job.StudentJobStatus = "send cv";
        } else if (job.StudentJobStatus === "save") {
            job.StudentJobStatus = "new";
        } else if (job.StudentJobStatus === "new") {
            job.StudentJobStatus = "save";
        }
        
        var jobsList = this.state.JobsList;
        for (var i = 0; i < jobsList.length; ++i) {
            if (jobsList[i].JobNo === job.JobNo) {
                jobsList[i].StudentJobStatus = job.StudentJobStatus;
                break;
            }
        }

        const httpClient = axios.create();
        httpClient.defaults.timeout = Global.DEFUALT_REQUEST_TIMEOUT_MS;
        httpClient.post(Global.BASE_URL +'AppStudnetJobStatus', {
            StudentId: this.state.studentId,
            JobId: job.JobNo,
            Status: job.StudentJobStatus
        });
        this.setState({ JobsList: jobsList, selectedJob: job });
    }
    _getModalForJob = () => {
        var modalTitle = '', modalDescription = '', location ='', Requirements= '', OpenDate ='', ContactMail='', ContactPhone='', ContactName='', JobStatusStatusName='';
        var starColor = 'grey';
        var starFill = 'heart-o';
        if (this.state.selectedJob !== null && this.state.selectedJob !== undefined) {
            modalTitle = this.state.selectedJob.JobName;
            modalDescription = this.state.selectedJob.JobDescription;
            location = this.state.selectedJob.Location;
            Requirements = this.state.selectedJob.Requirements;
            OpenDate = Moment(this.state.selectedJob.OpenDate).format('YYYY/MM/DD');
            ContactMail = this.state.selectedJob.ContactMail;
            ContactPhone = this.state.selectedJob.ContactPhone;
            ContactName = this.state.selectedJob.ContactName;
            JobStatusStatusName = this.state.selectedJob.JobStatusStatusName;

            if (this.state.selectedJob.StudentJobStatus === "save" ||
                this.state.selectedJob.StudentJobStatus === "save and cv") {
                starColor = 'red';
                starFill = 'heart';
            }
        }
        //הדף שך פרטי משרה
        return <ImageBackground style={ styles.jobImgBackground } 
                resizeMode='cover' 
                source={require('../../images/lightBlue.jpg')}>
                <ScrollView behavior="padding" enabled keyboardShouldPersistTaps='always' style={styles.wrapper}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{paddingTop:10, flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Icon name="fire" size={30} style={{paddingRight:20, color:'#FF8811'}} />
                            <Text style={{fontSize: 20, paddingRight:5, paddingTop:7}}>{ JobStatusStatusName }</Text>
                        </View> 
                        <Icon name="close" size={30} style={{paddingLeft: 10, paddingTop:10}}
                        onPress={() => { this.setState({ isModalVisible: false}); }}></Icon>
                    </View>
                        <Text style={{fontSize: 36, textAlign:"left", marginBottom:20,  color:'#FF8811'}}> { modalTitle }</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Icon name="map-marker" size={30} style={{paddingRight:20, color:'#FF8811'}} />
                            <Text style={{fontSize: 20, paddingRight:5}}>{ location }</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Icon name="calendar" size={25} style={{paddingRight:20, paddingTop: 5, paddingBottom: 5 ,color:'#FF8811'}} />
                            <Text style={{fontSize: 20, paddingRight:5, paddingTop:7}}>{ OpenDate }</Text>
                        </View>
                     <View >
                        <Text style={{fontSize: 25 , paddingRight:20, paddingBottom:10}}>תיאור:</Text>
                        <Text style={{fontSize: 20 , paddingRight:20, paddingBottom:10}}> { modalDescription }</Text>
                        <Text style={{fontSize: 25 , paddingRight:20, paddingBottom:10}}>דרישות תפקיד:</Text>
                        <Text style={{fontSize: 20 , paddingRight:20, paddingBottom:10}}> { Requirements }</Text>
                        <Text style={{fontSize: 25 , paddingRight:20, paddingBottom:10}}>פרטים נוספים:</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Icon name="user" size={25} style={{paddingRight:20, paddingTop: 5}} />
                            <Text style={{fontSize: 20, paddingRight:5}}>{ ContactName }</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Icon name="at" size={25} style={{paddingRight:20, paddingTop: 5}} />
                            <Text style={{fontSize: 20, paddingRight:5}}>{ ContactMail }</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Icon name="phone" size={25} style={{paddingRight:20, paddingTop: 5}} />
                            <Text style={{fontSize: 20, paddingRight:5}}>{ ContactPhone }</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Button
                                type="clear"
                                containerStyle={{marginTop: 10}}
                                icon={
                                    <Icon
                                      name={starFill}
                                      size={40}
                                      color={starColor}
                                    />
                                }
                                onPress={() => {
                                    var job = this.state.selectedJob;
                                    this._saveJob(job);
                                }}
                            />
                            <Button
                                type="clear"
                                containerStyle={{marginTop: 10}}
                                icon={
                                    <Icon
                                      name="trash-o"
                                      size={40}
                                    />
                                }
                                onPress={() => {
                                    var jobToRemove = this.state.selectedJob;
                                    Alert.alert("מחיקת משרה", "האם ברצונך למחוק את המשרה ?", 
                                        [{ text: "כן", onPress: () => this._removeJob(jobToRemove)},
                                        { text: "לא", onPress: () => {}}],
                                    );
                                }}
                            />
                       </View>
                       <RoundedButton
                            text = 'שלח קורות חיים  '
                            textColor = "#FFF8F0"
                            background= "#FF8811"
                            //icon={<Icon name="facebook" size={20} />}
                            handleOnPress={this._sendCV}
                            /> 
                     </View>      
             </ScrollView>
             </ImageBackground>;
    }

    uploadCVButtonClicked = () => {
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
          },(error,res) => {
              if (error !== undefined && error !== null) {
                // alert (error);
                alert ('לא נבחר קובץ');
                return;
              } else {
                if (res.type !== 'application/pdf') {
                    // TODO - support word too
                      alert ('קבצים נתמכים מסוג pdf/word');
                      return;
                }

                this.setState({ loadingVisible: true });
                RNFS.readFile(res.uri, 'base64')
                    .then(result => {
                        const httpClient = axios.create();
                        httpClient.defaults.timeout = 15000;
                        httpClient.post(Global.BASE_URL + 'Students', { 
                            StudentId: this.state.studentId,
                            CVFile: result,
                            CVName: res.fileName
                        })
                        .then((response) => {
                            this.setState({ 
                                loadingVisible: false,
                            });
                            this._sendCV();
                        })
                        .catch((error) => {
                            this.setState({ loadingVisible: false });
                            // alert (error.response.status);
                            alert ("לא נבחר קובץ");
                        });
                    })
                    .catch(error => alert ('לא נבחר קובץ'));
              }
          });
    }
    _sendCV = () => {
        this.setState({ loadingVisible: true });
        var jobToRemove = this.state.selectedJob;
        const httpClient = axios.create();
        httpClient.defaults.timeout = Global.DEFUALT_REQUEST_TIMEOUT_MS;
        httpClient.post(Global.BASE_URL +'AppStudnetJobStatus', {
            StudentId: this.state.studentId,
            JobId: jobToRemove.JobNo,
            Status: jobToRemove.StudentJobStatus === "save" ? "save and cv" : "send cv",
        }).then((response) => {
            this.setState({ loadingVisible: false });
            if (response.data === "No cv") {
                Alert.alert("חסרים קורות חיים", "נדרש להעלות קורות חיים", 
                    [{ text: "העלה כעת", onPress: () => this.uploadCVButtonClicked()},
                    { text: "מאוחר יותר", onPress: () => {}}],
                );
            } else {
                Alert.alert("קורות החיים הוגשו למשרה בהצלחה");
                var newJobList = this.state.JobsList;
                var index = 0;
                for (var i = 0; i < this.state.JobsList.length; ++i) {
                    if (this.state.JobsList[i].JobNo === jobToRemove.JobNo) {
                        index = i;
                        break;
                    }
                }
                // newJobList.splice(index, 1); 
                var prevStatus = newJobList[index].StudentJobStatus;
                newJobList[index].StudentJobStatus = prevStatus === 'new' ? 'send cv' : 'save and cv';  
                this.setState({ JobsList: newJobList, isModalVisible: false });
            }
        }).catch((error) => {
            this.setState({ loadingVisible: false });
        })
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

    tabs = [
        {
          key: 0,
          icon: 'search',
          label: 'כל המשרות',
          barColor: '#325e89',
          pressColor: 'transparent',       
        },
        {
          key: 1,
          icon: 'heart-o',
          label: 'מועדפים',
          barColor: '#127b8d',
          pressColor: 'transparent',
          //pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
          key: 2,
          icon: 'send-o',
          label: 'משרות שפניתי',
          barColor: '#39a78e',
          pressColor: 'transparent',
          //pressColor: 'rgba(255, 255, 255, 0.16)'
        }
      ];

      renderIcon = icon => ({ isActive }) => (
        <Icon size={24} color="white" name={icon} />
      )
      renderTab = ({ tab, isActive }) => (
        <FullTab
          isActive={isActive}
          key={tab.key}
          label={tab.label}
          renderIcon={this.renderIcon(tab.icon)}
        />
      )

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

                <BottomNavigation
                    onTabPress={newTab => this.setState({ activeTab: newTab.key })}
                    renderTab={this.renderTab}
                    tabs={this.tabs}
                />
                
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
jobImgBackground: {
    width: '100%',
    height: '110%',
    flex: 1,
},
scrollViewStyle: {
    flex: 1,
},
searchViewStyle: {
    marginRight: 7,
    marginLeft: 7,
    marginBottom: 7,
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
    //backgroundColor: '#9DD9D2',
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

