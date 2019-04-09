import React from 'react';
import { Text, View, Dimensions, Image } from 'react-native';
import styles from './pageStyle';
import { Button, ActionButton } from 'react-native-material-ui';
import { MapView } from 'expo';
const { Marker } = MapView;

export default class LocationPage extends React.Component {
  static navigationOptions = {
    title: 'LOCATION',
  };
  constructor(props) {
    super(props);
    this.state = {
      latitude: 37.78825,
      longitude: -122.4324
    }
  }

  btnLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const output =
          'latitude=' + position.coords.latitude +
          '\nlongitude=' + position.coords.longitude +
          '\naltitude=' + position.coords.altitude +
          '\nheading=' + position.coords.heading +
          '\nspeed=' + position.coords.speed

        alert(output);
        this.setState(
          {
            latitude: position.coords.latitude,// +  Math.random()/1000,
            longitude: position.coords.longitude
          });
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.Header}>
          <Text style={styles.textBig}>Location Page</Text>
          <Image
            style={{ alignSelf: 'center', width: 80, height: 80 }}
            source={require('../assets/icon.png')} />

          <View style={{ margin: 10, justifyContent: 'flex-start' }}>
            <Button
              primary text="go to Home page"
              icon="arrow-back"
              onPress={() => {
                this.props.navigation.navigate('Home');
              }} />
          </View>
        </View>
        <View style={styles.Content}>
          <View style={{
            borderColor: 'black',
            borderWidth: 2,
          }}>
            <MapView
              style={{
                flex: 1,
                width: Dimensions.get('window').width - 30,
              }}
              region={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.0322,
                longitudeDelta: 0.0321,
              }}
            >
              <Marker
                coordinate={{
                  latitude: this.state.latitude,
                  longitude: this.state.longitude
                }}
                title='my place:)'
                description='here i am'
                //image={require('../assets/icon.png')}
              />
            </MapView>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              width: Dimensions.get('window').width - 10,
              flexDirection: 'row-reverse'
            }}>
            <ActionButton icon="place" onPress={this.btnLocation} />
          </View>
        </View>
      </View>
    );
  }
}