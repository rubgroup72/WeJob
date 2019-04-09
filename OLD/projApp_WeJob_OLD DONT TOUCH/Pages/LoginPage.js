import React from 'react';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import styles from './pageStyle';
import { Button, Dialog, DialogDefaultActions } from 'react-native-material-ui';
import InlineImage from '../Components/InlineImage.js';

// import { GoogleSignin, GoogleSigninButton,statusCodes } from 'react-native-google-signin';
// GoogleSignin.configure({
//     scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
//     webClientId: '<FROM DEVELOPER CONSOLE>', // client ID of type WEB for your server (needed to verify user ID and offline access)
//     offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
//     hostedDomain: '', // specifies a hosted domain restriction
//     loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
//     forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
//     accountName: '', // [Android] specifies an account name on the device that should be used
//     iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
//   });
//   signIn = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();
//       this.setState({ userInfo });
//     } catch (error) {
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         // user cancelled the login flow
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         // operation (f.e. sign in) is in progress already
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         // play services not available or outdated
//       } else {
//         // some other error happened
//       }
//     }
//   };

export default class LoginPage extends React.Component {
    static navigationOptions = {
        title: 'LOGIN',
    };

    constructor(props) {
        super(props);
        this.state = {
            txtName: 'Avi',
            txtPass: '123'
        }
    }

    btnLogin = () => {
        debugger;
        if (this.state.txtName == 'Avi' && this.state.txtPass == '123') {
            this.setState({ lblErr: false });
            this.props.navigation.navigate('Home');
        } else {
            this.setState({ lblErr: true });
        }
    };

    btnPOST_Person = () => {
        let per = {
            Name: this.state.txtName,
            Pass: this.state.txtPass
        };

        // POST adds a random id to the object sent
        fetch('http://proj.ruppin.ac.il/igroup96/test1/api/login', {
            method: 'POST',
            body: JSON.stringify(per),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                if (json != null) {
                    alert(`
                    returned from server\n
                    json= ${json}\n
                    Name=${json.Name}\n
                    Pass=${json.Pass}\n
                    Age=${json.Age}`);
                    this.props.navigation.navigate('Home');
                } else {
                    this.setState({ lblErr: true });
                }
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.Header}>
                    <Text style={styles.textBig}>WeJ
                    <InlineImage
            style={{ width:10, height:10}}
            source={require('../assets/Ruppin.png')}/>b</Text>
                   
                </View>
                <View style={styles.Content}>
                {/* <GoogleSigninButton
    style={{ width: 192, height: 48 }}
    size={GoogleSigninButton.Size.Wide}
    color={GoogleSigninButton.Color.Dark}
    onPress={this._signIn}
    disabled={this.state.isSigninInProgress} /> */}
  

                    <Text style={styles.lblText}>NAME:</Text>
                    <TextInput
                        style={styles.TxtInp}
                        onChangeText={(text) => this.setState({ txtName: text })}
                        value={this.state.txtName}
                    />
                    <Text style={styles.lblText}>PASS:</Text>
                    <TextInput
                        style={styles.TxtInp}
                        onChangeText={(text) => this.setState({ txtPass: text })}
                        value={this.state.txtPass}
                    />
                    <TouchableOpacity
                        style={styles.Button}
                        onPress={this.btnLogin}>
                        <Text style={styles.textMedium}>go to home page</Text>
                    </TouchableOpacity>
                    {this.state.lblErr && <Text style={styles.Err}>WRONG NAME OR PASS!</Text>}
                    <View style={{ margin: 20 }}>
                        <Button
                            primary text="LOGIN with WebAPI"
                            icon="directions-car"
                            style={{ margin: 20 }}
                            onPress={this.btnPOST_Person}
                        />
                        {this.state.lblErr &&
                            <View style={{ position: 'absolute',bottom: 150, alignSelf: 'center' }}>
                                <Dialog>
                                    <Dialog.Title><Text>ERR Name or Pass!</Text></Dialog.Title>
                                    <Dialog.Content>
                                        <Text>stam dialog example!</Text>
                                    </Dialog.Content>
                                    <Dialog.Actions>
                                        <DialogDefaultActions
                                            actions={['cancel', 'we\'re good']}
                                            onActionPress={(data) => {
                                                alert(data);
                                                this.setState({ lblErr: false });
                                            }}
                                        />
                                    </Dialog.Actions>
                                </Dialog>
                            </View>
                        }
                    </View>
                </View>
            </View >
        );
    }
}