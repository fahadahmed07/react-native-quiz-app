import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class Result extends Component {
    state = {
        totalScore: '',
        totalUserAnswers: [],
    }

    componentDidMount() {
        const { navigation } = this.props;
        console.log("navigation ==>> ", navigation)
        const totalUserAnswers = navigation.getParam('totalUserAnswers', []);
        const totalScore = navigation.getParam('totalScore', 0)
        const totalTime = navigation.getParam('totalTime', 0)
        this.setState({ totalUserAnswers, totalScore, totalTime })
    }

    render() {
        const { navigate } = this.props.navigation
        const { totalUserAnswers, totalScore, totalTime } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.title}>React Native Quiz Result</Text>
                <Text style={styles.text}>Correct answer {totalScore / 10} out {totalUserAnswers.length} </Text>
                <Text style={styles.text}>Total time {(totalTime / 60000).toFixed(2)} min</Text>
                <Button
                    onPress={() => navigate('Home')}
                    title='Play Again'
                    color="#007bff"
                />
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
    title: {
        fontSize: 30,
        color: '#343a40',
        marginBottom: 10,
    },
    text: {
        fontSize: 20,
        color: '#343a40',
        marginBottom: 5,
    },
});