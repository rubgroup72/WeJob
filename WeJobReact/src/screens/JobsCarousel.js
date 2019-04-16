import { DrawerActions } from 'react-navigation';
import React, {Component} from 'react';
import RoundedButton from '../components/buttons/RoundedButton';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Main extends React.Component{

    onRegiterPress = () => {
        this.props.navigation.navigate("Register");
    };
    render () {
        return <RoundedButton
        text = 'Jobs carousel'
        handleOnPress={this.onRegiterPress}
     />;
    }

}