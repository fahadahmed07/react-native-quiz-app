import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { Ionicons } from '@expo/vector-icons';

export default class Home extends Component {

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.front,
        image: null,
        faces: [],
    }

    async askPermission() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    async capture() {
        if (this.camera) {
            const { uri } = await this.camera.takePictureAsync();
            this.setState({ image: uri });
            const { faces } = await this.detectFaces(uri);
            this.setState({ faces: faces });
        }
    }

    async detectFaces(imageUri) {
        const options = { mode: FaceDetector.Constants.Mode.fast };
        // eslint-disable-next-line no-return-await
        return await FaceDetector.detectFacesAsync(imageUri, options);
    };

    render() {
        const { navigate } = this.props.navigation;
        const { hasCameraPermission, type, image, faces } = this.state;

        if (hasCameraPermission === null) {
            return (
                <View style={styles.container}>
                    <Text>This application needs camera access</Text>
                    <Text>(Please click the below button and allow the camera)</Text>
                    <Button
                        onPress={() => this.askPermission()}
                        title="Open Camera"
                    />
                </View>
            );
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {

            return !image ? (
                <View style={{ flex: 1 }}>
                    <Camera
                        type={type}
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={{ flex: 1 }}
                        type={this.state.type}>
                        <View style={styles.cont_row}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        type:
                                            this.state.type === Camera.Constants.Type.back
                                                ? Camera.Constants.Type.front
                                                : Camera.Constants.Type.back,
                                    });
                                }}
                            >
                                <Ionicons name="md-reverse-camera" size={30} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.capture()}
                            >
                                <Ionicons name="md-camera" size={30} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.setState({ hasCameraPermission: null })}
                            >
                                <Ionicons name="md-arrow-back" size={30} color="white" />
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View >
            ) : (
                    <View style={styles.container}>{
                        faces.length > 0 ? (
                            <View>
                                <Text>Your are athunticated user!</Text>
                                <Text>&amp;</Text>
                                <Text>You can start the quiz</Text>
                                <Button
                                    title='Start Quiz'
                                    onPress={() => navigate('Quiz')}
                                />
                            </View>
                        ) : (
                                <View>
                                    <Text>Your are not athunticated user!</Text>
                                    <Text>(Please try again.)</Text>
                                    <Button
                                        title='Try again'
                                        onPress={() => this.setState({ image: null })}
                                    />
                                </View>
                            )
                    }</View>
                )
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cont_row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 10,
    }
});
