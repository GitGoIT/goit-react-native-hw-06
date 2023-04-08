import React, {useState} from "react";
import { View, Text, StyleSheet, Touchable, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";

const CreatePostsScreen = () => {
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);

  const takePhoto = async () => { 
    const photo = await camera.takePictureAsync();
    setPhoto(photo.url);
  };


  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={setCamera}>
        {photo && (<View style={styles.takePhotoContainer}>
            <Image source={{ uri: photo }} style={{ height: "100%", width: "100%" }}/>
          </View>
        )}
        <TouchableOpacity style={styles.cameraBtn} onPress={takePhoto}>
          <FontAwesome name="camera" size={24} />
        </TouchableOpacity>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  camera: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    height: 240,
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    overflow: "hidden",
  },
  cameraBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: "50%",
  },
  takePhotoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
});

export default CreatePostsScreen;
