import { DrawerActions } from 'react-navigation';    
import React from 'react';
import { StyleSheet,Text, Image, View,SafeAreaView ,TouchableHighlight, AsyncStorage} from 'react-native';
import axios from 'axios';
import Global from '../global';

import Carousel from 'react-native-snap-carousel';

export default class JobsCarousel extends React.Component {
 
    constructor(props){
        super(props);
        this.state = {
            studentId: '',
            activeIndex:0,
            JobsList: [],
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
            headerTintColor: colors.green01,
            headerRight: (

                <TouchableOpacity style={styles.menu} onPress={() => navigation.dispatch(DrawerActions.openDrawer())} >
                    <Icon name="bars" size={30} color= {colors.white} />
                </TouchableOpacity>
            //     <NavBarButton handleButtonPress={() => navigation.navigate('LogIn')} location="left" color={colors.white} text="  לצפיי2ה במשרות ללא הרשמה" />
            ),
            //title: 'WeJob1',
            // headerLeft: (
            //     <TouchableOpacity style={styles.menu} onPress={() => navigation.dispatch(DrawerActions.openDrawer())} >
            //         <Icon name="bars" size={30} color= {colors.white} />
            //     </TouchableOpacity>
            // ),
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
            // <View style={{flex:1,justifyContent:'center',alignItems:'center'}}> 
            //     <Image
            //         source={require('../assets/usericon.png')}
            //         />
            //     <Text style={{color:'#fff'}} >{item.JobName}</Text>
            // </View>
        )
    }

    render() {
        return (
        <SafeAreaView style={styles.container}>
          
            <TouchableHighlight //כפתור חץ לצד ימין מעדכן את האינדקס לאחד פחות
                onPress={
                    () => { this.carousel._snapToItem(this.state.activeIndex-1)}
                }>
                <Image source={require('../assets/rightarrow.png')}/>
            </TouchableHighlight>

            <View>
              
                <Carousel //יצירת קומפוננטה מסוג קרוסלה והעברת הנתונים לתכונות הקרוסלה 
                    ref={ref => this.carousel = ref}
                    data={this.state.JobsList}
                    sliderWidth={250}
                    itemWidth={250}
                    renderItem={this._renderItem}
                    onSnapToItem = { index => this.setState({activeIndex:index}) }
                />
            </View>

            <TouchableHighlight //כפתור חץ שמאלי מעדכן את האינדקס לפלוס אחד           
                onPress={
                    () => { this.carousel._snapToItem(this.state.activeIndex+1)}
                }>
                <Image source={require('../assets/leftarrow.png')}/>                
            </TouchableHighlight>

           

        </SafeAreaView>
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
});

