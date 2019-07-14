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
                    <Text style={styles.text}>Application needs camera access</Text>
                    <Text style={styles.warningText}>Please click the below button to use the camera</Text>
                    <Button
                        onPress={() => this.askPermission()}
                        title="Open Camera"
                        color="#007bff"
                    />
                </View>
            );
        } else if (hasCameraPermission === false) {
            return <Text style={styles.errorText}>No access to camera</Text>;
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
                            <View style={styles.container}>
                                <Text style={styles.text}>Now your are authenticated user!</Text>
                                <Text style={styles.warningText}>You can proceed now.</Text>
                                <Button
                                    onPress={() => navigate('Quiz')}
                                    title='Proceed Now'
                                    color = "#28a745"
                                />
                            </View>
                        ) : (
                                <View style={styles.container}>
                                    <Text style={styles.text}>Your are not authenticated user!</Text>
                                    <Text style={styles.warningText}>Please try again.</Text>
                                    <Button
                                        onPress={() => this.setState({ image: null })}
                                        title='Try again'
                                        color = "#ffc107"
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
        alignItems: 'flex-end',
        padding: 10,
    },
    text: {
        fontSize: 22,
        color: '#343a40',
    },
    warningText: {
        fontSize: 15,
        color: '#ffc107',
        marginBottom: 10,
    },
    errorText: {
        fontSize: 20,
        color: '#dc3545',
    },
});
