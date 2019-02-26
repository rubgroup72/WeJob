import React from 'react';
import { Text, View, Image } from 'react-native';
import { Dialog, DialogDefaultActions } from 'react-native-material-ui';

export default function RiderDialog(props) {
    return (
        <View style={{ position: 'absolute', bottom: 150, alignSelf: 'center' }}>
        <Dialog>
            <Dialog.Title><Text>Hello {props.item.key}</Text></Dialog.Title>
            <Dialog.Content>
                <Image
                    style={{ alignSelf:'center', width: 150, height: 150 }}
                    source={props.item.imgSrc}
                />
            </Dialog.Content>
            <Dialog.Actions>
                <DialogDefaultActions
                    actions={['hey U', 'we\'re good']}
                    onActionPress={(data) => {
                        alert(data);
                        props.changeShowDialogState(false);
                    }}
                />
            </Dialog.Actions>
        </Dialog>
    </View>
    );
}