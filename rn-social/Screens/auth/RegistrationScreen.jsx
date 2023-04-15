import React, { useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ImageBackground, Image, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Dimensions, } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useDispatch } from "react-redux";
import { authSignUpUser } from "../../redux/auth/authOperations";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../firebase/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

SplashScreen.preventAutoHideAsync();

const initialState = {
  login: "",
  email: "",
  password: "",
  imageUri: null,
};

export default function RegistrationScreen({navigation}) {
    const [photo, setPhoto] = useState(null);
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [state, setState] = useState(initialState);
    const [dimensions, setDimentions] = useState(Dimensions.get("window").width - 16 * 2);
    const [isFocus, setIsFocus] = useState({
     login: false,
     email: false,
     password: false,
    });
    const [isSecureEntry, setIsSecureEntry] = useState(true);
    
    const [fontsLoaded] = useFonts({
      "Roboto-Regular": require("../../assets/fonts/Roboto-Regular.ttf"),
      "Roboto-Medium": require("../../assets/fonts/Roboto-Medium.ttf"),
    });
  
  const dispatch = useDispatch();
  
  const handleAddImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.assets.length > 0) {
      setPhoto(result.assets[0]);
    }
  };

  const uploadPhotoToServer = async () => {
    try {
      const response = await fetch(photo.uri);
      const file = await response.blob();
      const uniquePostId = Date.now().toString();
      const storageRef = ref(storage, `profilePictures/${uniquePostId}`);
      await uploadBytes(storageRef, file);
      const processedPhoto = await getDownloadURL(storageRef);
      // console.log("processedPhoto", processedPhoto);
      return processedPhoto;
    } catch (error) {
      console.log(error.message);
    }
  };
  const clearPhoto = () => {
    setPhoto(null);
  };

  async function handleSubmit() {
    try {
      const processedPhoto = photo ? await uploadPhotoToServer() : null;

      const user = {
        login: state.login,
        email: state.email,
        password: state.password,
        photo: processedPhoto,
      };

      dispatch(authSignUpUser(user));
      setState({
        login: "",
        email: "",
        password: "",
      });
      setPhoto(null);
    } catch (error) {
      console.log(error.message);
    }
  }

    const onLayoutRootView = useCallback(async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
      return null;
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container} onLayout={onLayoutRootView}>
          <ImageBackground
            style={styles.image}
            source={require("../../assets/images/photo-bg2x.jpg")}
          >
            <View
              style={{
                ...styles.wrapperForm,
                ...Platform.select({
                  ios: {
                    paddingBottom:
                      isFocus.login || isFocus.email || isFocus.password
                        ? 225
                        : 78,
                  },
                  android: {
                    paddingBottom:
                      isFocus.login || isFocus.email || isFocus.password
                        ? 20
                        : 78,
                  },
                }),
              }}
            >
              {photo ? (
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: photo.uri }} style={styles.imageUser} />
                  <TouchableOpacity
                    onPress={clearPhoto}
                    style={styles.deleteIcon}
                  >
                    <Image source={require("../../assets/delete.png")} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.imageWrapper}>
                  <TouchableOpacity
                    onPress={handleAddImage}
                    style={styles.addIcon}
                  >
                    <Image source={require("../../assets/add.png")} />
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.form}>
                <View>
                  <Text style={styles.title}>Registration</Text>
                </View>
                <KeyboardAvoidingView
                  behavior={Platform.OS == "ios" ? "padding" : "height"}
                >
                  <View>
                    <TextInput
                      onFocus={() => {
                        setIsShowKeyboard(true);
                        setIsFocus({ ...isFocus, login: true });
                      }}
                      onBlur={() => {
                        setIsFocus({ ...isFocus, login: false });
                      }}
                      placeholderTextColor="#BDBDBD"
                      placeholder="Login"
                      value={state.login}
                      onChangeText={(value) =>
                        setState((prevState) => ({
                          ...prevState,
                          login: value,
                        }))
                      }
                      style={{
                        ...styles.input,
                        borderColor: isFocus.login ? `#FF6C00` : `#E8E8E8`,
                      }}
                    />
                    <TextInput
                      keyboardType="email-address"
                      onFocus={() => {
                        setIsShowKeyboard(true);
                        setIsFocus({ ...isFocus, email: true });
                      }}
                      onBlur={() => {
                        setIsFocus({ ...isFocus, email: false });
                      }}
                      placeholder="E-mail address"
                      value={state.email}
                      onChangeText={(value) =>
                        setState((prevState) => ({
                          ...prevState,
                          email: value,
                        }))
                      }
                      style={{
                        ...styles.input,
                        borderColor: isFocus.email ? `#FF6C00` : `#E8E8E8`,
                      }}
                    />
                    <View>
                      <TextInput
                        onFocus={() => {
                          setIsShowKeyboard(true);
                          setIsFocus({ ...isFocus, password: true });
                        }}
                        onBlur={() => {
                          setIsFocus({ ...isFocus, password: false });
                        }}
                        placeholder="Password"
                        value={state.password}
                        onChangeText={(value) =>
                          setState((prevState) => ({
                            ...prevState,
                            password: value,
                          }))
                        }
                        secureTextEntry={isSecureEntry}
                        style={{
                          ...styles.input,
                          borderColor: isFocus.password ? `#FF6C00` : `#E8E8E8`,
                        }}
                      />
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.textPassword}
                        onPress={() => {
                          setIsSecureEntry((prevState) => !prevState);
                        }}
                      >
                        <Text>{isSecureEntry ? "Show" : "Hide"}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </KeyboardAvoidingView>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleSubmit}
                  style={styles.button}
                >
                  <Text style={styles.textButton}>Register</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.containerLink}>
                <Text style={styles.txtLink}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.btnLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
          <StatusBar style="auto" />
        </View>
      </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  title: {
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: 0.01,
    color: "#212121",
    marginBottom: 27,
  },
  input: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    height: 50,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    color: "#212121",
  },
  wrapperForm: {
    paddingBottom: 78,
    paddingTop: 92,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  form: {
    marginHorizontal: 16,
  },
  button: {
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    height: 51,
    marginTop: 43,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    color: "#FFFFFF",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
  },
  imageUser: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  deleteIcon: {
    position: "absolute",
    left: "86%",
    top: "60%",
    width: 25,
    height: 25,
  },
  imageWrapper: {
    position: "absolute",
    left: "35%",
    top: "-15%",
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
  },
  addIcon: {
    position: "absolute",
    left: "89%",
    top: "65%",
    width: 25,
    height: 25,
  },
  textPassword: {
    position: "absolute",
    top: "50%",
    left: "85%",
    color: "#1B4371",
    fontSize: 16,
    lineHeight: 19,
  },
  containerLink: {
    flexDirection: "row",
    justifyContent: "center",
  },
  txtLink: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#1B4371",
    textAlign: "center",
  },
  btnLink: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "blue",
    textAlign: "center",
    marginLeft: 5,
  },
});