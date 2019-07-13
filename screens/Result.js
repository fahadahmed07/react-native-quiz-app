import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class Result extends Component {
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Text>This is Result</Text>
                <Button title='Go to Home' onPress={()=>navigate('Home')}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
