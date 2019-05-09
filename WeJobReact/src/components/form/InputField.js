import React, {Component} from 'react';
import { PropTypes} from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import colors from '../../styles/colors';

export default class InputField extends Component{
    render() {
        const { labelText, labelTextSize, labelColor, textColor,borderBottomColor, inputType, customStyle, onChangeTextEvent, textValue, isNotEditable } = this.props;
        const fontSize = labelTextSize || 14;
        const color = labelColor || colors.white;
        const inputColor = textColor || colors.white;
        const borderBottom = borderBottomColor || 'transparent';
        const isEditable = isNotEditable === 'true' ? false: true;

        return (
            <View style = {[customStyle, styles.wrapper]}>
            <Text style = {[{color,fontSize},styles.label]}>{labelText}</Text>
            <TextInput
             autoCorrect={false}
             style= {[{color: inputColor, borderBottomColor: borderBottom},styles.InputField]}
             secureTextEntry = {inputType === 'password'}
             onChangeText = {onChangeTextEvent}
             value = {textValue}
             editable = {isEditable}
            />
            </View>
        );
    }
}

InputField.propTypes = {
    labelText: PropTypes.string.isRequired,
    labelTextSize: PropTypes.number,
    labelColor: PropTypes.string,
    textColor: PropTypes.string,
    borderBottomColor: PropTypes.string,
    inputType: PropTypes.string.isRequired,
    customStyle: PropTypes.object,
    onChangeTextEvent: PropTypes.func,
    textValue: PropTypes.string,
    isNotEditable: PropTypes.string,

};

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',

    },
    label: {
        fontWeight: '700',
        marginBottom: 10,
    },
    InputField: {
        borderBottomWidth: 1,
        paddingTop: 5,
        paddingBottom: 5
    }

});