import React from 'react';
import { Text, View, FlatList, Image } from 'react-native';
import styles from './pageStyle';
import { Button, ActionButton } from 'react-native-material-ui';
import Rider from '../Components/Rider';
import RiderDialog from '../Components/RiderDialog';

export default class HomePage extends React.Component {
  static navigationOptions = {
    title: 'HOME',
  };

  constructor(props) {
    super(props);
    this.state = {
      itemClickedObj: null,
      showDialog: false
    }
  }

  getItemClicked = (itemk) => {
    this.setState({
      itemClickedObj: itemk,
      showDialog: true
    });
  };

  changeShowDialogState = (SDState) => {
    this.setState({ showDialog: SDState });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.Header}>
          <Text style={styles.textBig}>Home Page</Text>
          <Image
            style={{ alignSelf: 'center', width: 100, height: 100 }}
            source={require('../assets/icon.png')} />
        </View>
        <View style={styles.Content}>
          <View style={{ margin: 20 }}>
            <Button
              primary text="go to login page"
              icon="arrow-back"
              onPress={() => {
                this.props.navigation.navigate('Login');
              }} />
          </View>
          <FlatList
            data={[
              { key: 'Tokio', imgSrc: require('../images/Tokio.jpg'), lat: 120.321654, long: 120.325411 },
              { key: 'El Profesor', imgSrc: require('../images/El_Profesor.jpg'), lat: 121.321654, long: 120.325411 },
              { key: 'Raquel Murillo', imgSrc: require('../images/Raquel_Murillo.jpg'), lat: 122.321654, long: 120.325411 },
              { key: 'Nairobi', imgSrc: require('../images/Nairobi.jpg'), lat: 120.321654, long: 120.325411 },
              { key: 'Rio', imgSrc: require('../images/Rio.jpg'), lat: 121.321654, long: 120.325411 },
              { key: 'Denver', imgSrc: require('../images/Denver.jpg'), lat: 122.321654, long: 120.325411 },
              { key: 'Berlin', imgSrc: require('../images/Berlin.jpg'), lat: 122.321654, long: 120.325411 },
            ]}
            renderItem={({ item }) => <Rider item={item} getItemClicked={this.getItemClicked} />}
          />

          {this.state.showDialog &&
            <RiderDialog
              item={this.state.itemClickedObj}
              changeShowDialogState={this.changeShowDialogState} />}

          <View
            style={{
              //flex: 1,
              position: 'absolute',
              bottom: 0,
              alignSelf: 'flex-start',
              flexDirection: 'row-reverse'
            }}>
            <ActionButton
              icon='map'
              onPress={() => this.props.navigation.navigate('Location')} />
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              alignSelf: 'center',
              flexDirection: 'row',
              padding:50
            }}>
            <ActionButton
              icon='notifications'
              onPress={() => this.props.navigation.navigate('Push')} />
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              alignSelf: 'flex-end',
              flexDirection: 'row'
            }}>
            <ActionButton
              icon='photo-camera'
              onPress={() => this.props.navigation.navigate('Camera')} />
          </View>
        </View>
      </View>
    );
  }
}