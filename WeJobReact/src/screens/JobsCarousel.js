import { DrawerActions } from 'react-navigation';    
import React from 'react';
import { StyleSheet,Text, Image, View, Platform, ScrollView, ImageBackground, Modal, TouchableHighlight, Alert, I18nManager} from 'react-native';
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
        })
        .catch((error) => {
            this.setState({ loadingVisible: false });
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
                        source={{uri: 'http://bit.ly/2GfzooV'}} 
                        title={job.JobName}
                        />
                        <CardTitle
                        subtitle={job.CompanyCompanyNo}
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
    _getJobsList = () => {
        if (this.state.JobsList.length === 0) {
            return this._getEmptyJobsListScreen();
        }
        var ret = [];
        for (var i = 0; i < this.state.JobsList.length; ++i) {
            var j = this.state.JobsList[i];
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
        return <View style={{backgroundColor:'#9DD9D2'}}>
                <View>
                    <View>
                    <TouchableHighlight
                        onPress={() => { this.setState({ isModalVisible: false}); }}>
                        <Icon name="close" size={30} style={{paddingLeft: 10, paddingTop:10}}></Icon>
                    </TouchableHighlight>
                    <Text
                    style={{fontSize: 30, textAlign:"center", marginBottom:20}}
                    > 
                    { modalTitle }</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Icon name="map-marker" size={30} style={{paddingRight:20}} />
                        <Text style={{fontSize: 20, paddingRight:5}}>{ location }</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Icon name="calendar" size={25} style={{paddingRight:20, paddingTop: 5}} />
                        <Text style={{fontSize: 20, paddingRight:5}}>{ OpenDate }</Text>
                    </View>
                    </View>
                    <View style={{backgroundColor:'#FFF8F0'}}>
                        <Text
                        style={{fontSize: 30 , paddingRight:20, paddingBottom:10}}
                        >תיאור:</Text>
                        <Text
                        style={{fontSize: 20 , paddingRight:20, paddingBottom:10}}
                        > { modalDescription }</Text>
                        <Text
                        style={{fontSize: 30 , paddingRight:20, paddingBottom:10}}
                        >דרישות תפקיד:</Text>
                        <Text
                        style={{fontSize: 20 , paddingRight:20, paddingBottom:10}}
                        > { Requirements }</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Icon name="star" size={30} style={{paddingRight:20}} />
                            <Icon name="trash" size={30} style={{paddingRight:20}} />
                        </View>
                        <RoundedButton
                            text = 'שלח קורות חיים  '
                            textColor = "#FFF8F0"
                            background= "#FF8811"
                            style={{position:'absolute', buttom:0}}
                            //icon={<Icon name="facebook" size={20} />}
                            //handleOnPress={}
                            />
                    </View>
                </View>
            </View>;
    }

    render() {
        var jobsList = this._getJobsList();
        return (
            <View style={styles.main}>

                <ImageBackground style={ styles.imgBackground }
                    resizeMode='cover' 
                    source={require('../img/blue.jpeg')}>
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

                <Loader
                modalVisible={this.state.loadingVisible}
                animationType="fade" />  
                
            </View>
        // <SafeAreaView style={styles.container}>   
        //     <TouchableHighlight //כפתור חץ לצד ימין מעדכן את האינדקס לאחד פחות
        //         onPress={
        //             () => { this.carousel._snapToItem(this.state.activeIndex-1)}
        //         }>
        //         <Image source={require('../assets/rightarrow.png')}/>
        //     </TouchableHighlight>

        //     <View>
              
        //         <Carousel //יצירת קומפוננטה מסוג קרוסלה והעברת הנתונים לתכונות הקרוסלה 
        //             ref={ref => this.carousel = ref}
        //             data={this.state.JobsList}
        //             sliderWidth={250}
        //             itemWidth={250}
        //             renderItem={this._renderItem}
        //             onSnapToItem = { index => this.setState({activeIndex:index}) }
        //         />
        //     </View>

        //     <TouchableHighlight //כפתור חץ שמאלי מעדכן את האינדקס לפלוס אחד           
        //         onPress={
        //             () => { this.carousel._snapToItem(this.state.activeIndex+1)}
        //         }>
        //         <Image source={require('../assets/leftarrow.png')}/>                
        //     </TouchableHighlight>
        // </SafeAreaView>
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
},
main: {
    flex: 1   
   },
facebookButtonIcon: {
    color: colors.green01,
    position: 'relative',
    left: 20,
    zIndex: 8,
},
});

