import React from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import styles from './pageStyle';
import { Button, Dialog, DialogDefaultActions, purple } from 'react-native-material-ui';
import registerForPushNotificationsAsync from '../Components/registerForPushNotificationsAsync';
import { Notifications } from 'expo';

export default class PushNotPage extends React.Component {
    static navigationOptions = {
        title: 'PUSH NOT',
    };

    constructor(props) {
        super(props);
        this.state = {
            token: '',
            txtToken: '',
            notification: {},
        }
    }

    componentDidMount() {
        registerForPushNotificationsAsync()
            .then(tok => {
                this.setState({ token: tok });
            });
        this._notificationSubscription = Notifications.addListener(this._handleNotification);
    }

    _handleNotification = (notification) => {
        this.setState({ notification: notification });
    };

    getMyToken = () => {
        this.setState({ txtToken: this.state.token });
    };

    btnSendPushFromClient = () => {
        let per = {
            to: this.state.token,
            title: 'title from client',
            body: "body from client side",
            badge : 3,
            data : {name:"nir", grade:100 }
        };

        // POST adds a random id to the object sent
        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            body: JSON.stringify(per),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                if (json != null) {
                    console.log(`
                    returned from server\n
                    json.data= ${JSON.stringify( json.data)}`);

                } else {
                    alert('err json');
                }
            });
    }

    btnSendPushFromServer = () => {
        let pnd = {
            to: this.state.token,
            title: 'title from Ruppin Server',
            body: "body from server side",
            badge : 4,
            data : {name:"sivan", grade:99 }
        };

        // POST adds a random id to the object sent
        fetch('http://proj.ruppin.ac.il/igroup96/test1/sendpushnotification', {
            method: 'POST',
            body: JSON.stringify(pnd),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                if (json != null) {
                    console.log(`
                    returned from Ruppin server\n
                    json= ${JSON.stringify( json)}`);

                } else {
                    alert('err json');
                }
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.Header}>
                    <Text style={styles.textBig}>Push Page</Text>
                    <Image
                        style={{ alignSelf: 'center', width: 100, height: 100 }}
                        source={require('../assets/icon.png')} />
                    <View style={{ margin: 10, justifyContent: 'flex-start' }}>
                        <Button
                            primary text="Go to Home Page"
                            icon="arrow-back"
                            upperCase={false}
                            onPress={() => {
                                this.props.navigation.navigate('Home');
                            }} />
                    </View>
                </View>
                <View style={styles.Content}>
                    <View style={{ margin: 20 }}>
                        <Button
                            primary text="Get My Token"
                            upperCase={false}
                            icon="perm-device-information"
                            style={{ margin: 20 }}
                            onPress={this.getMyToken}
                        />
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ fontSize: 25, paddingLeft: 20 }}>Token:</Text>
                        <TextInput
                            style={{
                                height: 40,
                                width: Dimensions.get('window').width - 50,
                                borderColor: 'gray',
                                borderWidth: 2,
                                fontSize: 13,
                                marginRight: 15,
                                padding: 5,
                                borderRadius: 5
                            }}
                            onChangeText={(text) => this.setState({ txtToken: text })}
                            value={this.state.txtToken}
                        />
                    </View>
                    <View style={{ margin: 20 }}>
                        <Button
                            primary text="Send Push Notification from Client"
                            upperCase={false}
                            icon="notifications-active"
                            style={{ margin: 20 }}
                            onPress={this.btnSendPushFromClient}
                        />
                    </View>
                    <View style={{ margin: 20 }}>
                        <Button
                            text="Send Push Notification from Server"
                            upperCase={false}
                            icon="notifications"
                            style={{ margin: 20 }}
                            onPress={this.btnSendPushFromServer}
                        />
                    </View>
                    <View>
                        <Text style={{ fontSize: 20 }}>Origin: {this.state.notification.origin}</Text>
                        <Text style={{ fontSize: 20 }}>Data: {JSON.stringify(this.state.notification.data)}</Text>
                    </View>
                </View>
            </View >
        );
    }
}