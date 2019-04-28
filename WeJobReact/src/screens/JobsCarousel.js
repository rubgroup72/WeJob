import { DrawerActions } from 'react-navigation';    
import React from 'react';
import { StyleSheet,Text, Image, View,SafeAreaView ,TouchableHighlight} from 'react-native';

import Carousel from 'react-native-snap-carousel';

export default class JobsCarousel extends React.Component {
 
    constructor(props){
        super(props);
        this.state = {
            activeIndex:0,
            carouselItems: [
            {
                title:"עבודה 1"
            },
            {
                title:"עבודה 2"
            },
            {
                title:"עבודה 3"
            },
            {
                title:"עבודה 4"
            },
            {
                title:"עבודה 5"
            }
        ]}
    }

    _renderItem({item,index}){
        return (
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}> 
                <Image
                    source={require('../assets/usericon.png')}
                    />
                <Text style={{color:'#fff'}} >{item.title}</Text>
            </View>
        )
    }

    render() {
        return (
        <SafeAreaView style={styles.container}>
            <TouchableHighlight
                onPress={
                    () => { this.carousel._snapToItem(this.state.activeIndex-1)}
                }>
                <Image source={require('../assets/rightarrow.png')}/>
            </TouchableHighlight>

            <View>
                <Carousel

                        ref={ref => this.carousel = ref}
                        data={this.state.carouselItems}
                        sliderWidth={250}
                        itemWidth={250}
                        renderItem={this._renderItem}
                        onSnapToItem = { index => this.setState({activeIndex:index}) }
                    />
            </View>

            <TouchableHighlight            
                onPress={
                    () => { this.carousel._snapToItem(this.state.activeIndex+1)}
                }>
                <Image source={require('../assets/leftarrow.png')}/>                
            </TouchableHighlight>

           

        </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    backgroundColor:'#131420',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

