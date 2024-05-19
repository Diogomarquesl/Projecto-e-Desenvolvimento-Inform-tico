/*import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';

const CameraScreen = () => {
    const takePicture = async (camera) => {
        const options = { quality: 0.5, base64: true };
        const data = await camera.takePictureAsync(options);
        console.log(data.uri);
    };

    return (
        <View style={styles.container}>
            <RNCamera
                style={styles.preview}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.off}
                captureAudio={false}
            >
                {({ camera, status }) => {
                    if (status !== 'READY') return <View />;
                    return (
                        <View style={styles.captureContainer}>
                            <Button
                                title="Tirar Foto"
                                onPress={() => takePicture(camera)}
                            />
                        </View>
                    );
                }}
            </RNCamera>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    captureContainer: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
});

export default CameraScreen;*/
