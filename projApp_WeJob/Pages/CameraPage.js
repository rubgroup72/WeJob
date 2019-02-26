import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import styles from './pageStyle';
import { Button, ActionButton } from 'react-native-material-ui';
import { Camera, Permissions } from 'expo';

export default class CameraPage extends React.Component {
  static navigationOptions = {
    title: 'CAMERA',
  };
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.front,
      photoUri: 'https://facebook.github.io/react-native/docs/assets/favicon.png',
      uplodedPicUri:{uri:'https://facebook.github.io/react-native/docs/assets/favicon.png'}
    }

    this.uplodedPicPath = 'http://proj.ruppin.ac.il/igroup96/test1/uploadFiles/';
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  btnSnap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({ quality: 0.2 });
      this.setState({ photoUri: photo.uri });
    }
  };

  btnUpload = () => {
    let img = this.state.photoUri;
    let imgName = 'imgFromCamera.jpg';
    this.imageUpload(img, imgName);
  }; 

  imageUpload = (imgUri, picName) => {
    let urlAPI = "http://proj.ruppin.ac.il/igroup96/test1/uploadpicture";
    let dataI = new FormData();
    dataI.append('picture', {
      uri: imgUri,
      name: picName,
      type: 'image/jpg'
    });
    const config = {
      method: 'POST',
      body: dataI,
    };

    fetch(urlAPI, config)
      .then((responseData) => {
        let res = responseData._bodyText;
        debugger;
        let picNameWOExt = picName.substring(0, picName.indexOf("."));
        let imageNameWithGUID = res.substring(res.indexOf(picNameWOExt), res.indexOf(".jpg") + 4);
        if (responseData.status == 201) {
          this.setState({
            uplodedPicUri: { uri: this.uplodedPicPath +  imageNameWithGUID },
          });
        }
        else {
          alert('error uploding ...');
        }
      })
      .catch(err => {
        alert('err upload= ' + err);
      });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.Header}>
            <Text style={styles.textBig}>Camera Page</Text>
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
            <View style={{ alignItems: 'center' }}>
              <View style={{
                flex: 1, width: 200, margin: 10,
                justifyContent: 'flex-end', borderColor: 'black', borderWidth: 1
              }}>
                <Camera
                  ref={ref => { this.camera = ref; }}
                  style={{ flex: 1 }}
                  type={this.state.type}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'transparent',
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      style={{
                        flex: 0.2,
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        this.setState({
                          type: this.state.type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back,
                        });
                      }}>
                      <Text
                        style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                        {' '}Flip{' '}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Camera>
              </View>

              <View style={stylesCP.placeHolder}>
                <Image
                  style={stylesCP.image}
                  source={{ uri: this.state.photoUri }}
                ></Image>
              </View>
              <View style={stylesCP.placeHolder}>
              <Image
                  style={stylesCP.image}
                  source={ this.state.uplodedPicUri }
                ></Image>
              </View>
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 180,
                width: Dimensions.get('window').width - 10,
                flexDirection: 'row',
                paddingLeft: 20
              }}>
              <TouchableOpacity onPress={this.btnSnap}>
                <View style={{
                  width: 55,
                  height: 55,
                  borderRadius: 40,
                  justifyContent: 'center',
                  backgroundColor: 'lightblue'
                }}>
                  <Image
                    style={{
                      alignSelf: 'center', width: 25, height: 25,
                      borderRadius: 50
                    }}
                    source={require('../assets/camera-shutter.png')} />
                </View>
              </TouchableOpacity>
              {/* <ActionButton icon="camera" onPress={this.btnLocation} /> */}
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                width: Dimensions.get('window').width - 10,
                flexDirection: 'row-reverse',
              }}>
              <ActionButton icon="cloud-upload" onPress={this.btnUpload} />
            </View>
          </View>
        </View>
      );
    }
  }
}


const stylesCP = StyleSheet.create({
  placeHolder: {
    flex: 1,
    width: 200,
    borderColor: 'black',
    borderWidth: 1,
    margin: 10
  },
  image: {
    flex: 1,
    //width: 300
  }
}); 