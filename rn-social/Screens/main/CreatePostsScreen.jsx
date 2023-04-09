import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";


const CreatePostsScreen = ({navigation}) => {
  const [cameraRef, setCameraRef] = useState(null);
  const [photo, setPhoto] = useState("");
  const [location, setLocation] = useState(null);
   const [formValues, setFormValues] = useState({ title: "", location: "" });
      console.log(location);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }
    })();
  });

  const takePhoto = async () => {
    const photo = await cameraRef.takePictureAsync();
    const location = await Location.getCurrentPositionAsync();
    // console.log("latitude", location.coords.latitude);
    // console.log("longitude", location.coords.longitude);
    setLocation(location);
    setPhoto(photo.uri);
  };

  const sendPhoto = () => {
    // console.log("navigation", navigation);
    navigation.navigate("DefaultScreen", {
      title: formValues.title,
      location: formValues.location,
      photo: photo,
    });
    setFormValues({ title: "", location: "" });
    setPhoto("");
  };


  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={setCameraRef}>
        {photo && (
          <View style={styles.takePhotoContainer}>
            <Image
              source={{ uri: photo }}
              style={{ height: "100%", width: "100%" }}
            />
          </View>
        )}
        <TouchableOpacity
          style={{
            ...styles.cameraBtn,
            backgroundColor: !photo ? `#FFFFFF` : `rgba(255, 255, 255, 0.3)`,
          }}
          onPress={takePhoto}
        >
          <FontAwesome
            name="camera"
            size={24}
            style={{ color: !photo ? `#BDBDBD` : `#FFFFFF` }}
          />
        </TouchableOpacity>
      </Camera>
      {!photo ? (
        <Text style={styles.text}>Загрузити фото</Text>
      ) : (
        <Text style={styles.text}>Редагувати фото</Text>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
      >
        <View>
          <TextInput
            placeholder="Назва..."
            value={formValues.title}
            onChangeText={(value) =>
              setFormValues({ ...formValues, title: value })
            }
            style={styles.input}
          />
          <View style={styles.inputMapWrapper}>
            <Feather
              name="map-pin"
              size={18}
              color="#BDBDBD"
              style={styles.mapIcon}
            />
            <TextInput
              placeholder="Місцевість..."
              value={formValues.location}
              onChangeText={(value) =>
                setFormValues({ ...formValues, location: value })
              }
              style={styles.inputMap}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.btn} onPress={sendPhoto}>
          <Text style={styles.textBtn}>Опублікувати</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
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
    borderRadius: 50,
  },
  takePhotoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  text: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
  },
  btn: {
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    height: 51,
    marginTop: 32,
    marginBottom: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  textBtn: {
    color: "#FFFFFF",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
  },
  input: {
    marginTop: 32,
    fontSize: 16,
    lineHeight: 19,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  inputMapWrapper: {
    position: "relative",
  },
  mapIcon: {
    position: "absolute",
    top: 24,
  },
  inputMap: {
    marginTop: 10,
    paddingLeft: 20,
    fontSize: 16,
    lineHeight: 19,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
});

export default CreatePostsScreen;
