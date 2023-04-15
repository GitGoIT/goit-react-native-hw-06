import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import { authSignOutUser } from "../../redux/auth/authOperations";
import * as ImagePicker from "expo-image-picker";

import Icon from "react-native-vector-icons/Feather";
import { Feather } from "@expo/vector-icons";

const ProfileScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
    
    const [avatar, setAvatar] = useState(null);
    const [userPosts, setUserPosts] = useState(null);
    const [commentsCount, setCommentsCount] = useState(0);

    const { login, photo, userId } = useSelector((state) => state.auth);

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
      setAvatar(result.assets[0].uri);
    }
  };
  
    const clearPhoto = () => {
      setAvatar(null);
    };

  useEffect(() => {
    getUserPosts();
   }, []);
  
  useEffect(() => {
    if (route.params?.commentsCount) {
      setCommentsCount((prev) => ({
        ...prev,
        [route.params.postID]: route.params.commentsCount,
      }));
    }
  }, [route.params]);

  const getCommentsCount = async (postID) => {
    try {
      const commentsRef = collection(db, `posts/${postID}/comments`);
      const queryRef = query(commentsRef);
      const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
        const commentsCount = querySnapshot.docs.length;
        setCommentsCount((prev) => ({ ...prev, [postID]: commentsCount }));
      });
      return () => unsubscribe();
    } catch (error) {
      console.log(error);
      setCommentsCount((prev) => ({ ...prev, [postID]: 0 }));
    }
  };
  
  const getUserPosts = async () => {
    try {
      const userPostsRef = collection(db, "posts");
      const queryRef = query(userPostsRef, where("userId", "==", userId));
      const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
        const userPosts = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUserPosts(userPosts);

        if (userPosts && userPosts.length > 0) {
          userPosts.forEach((post) => {
            getCommentsCount(post.id.toString());
          });
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = () => {
    dispatch(authSignOutUser());
  };
  useEffect(() => {
    getUserPosts();
    return () => getUserPosts();
  }, []);
  
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        source={require("../../assets/images/photo-bg2x.jpg")}
      >
        <View style={styles.wrapper}>
          <TouchableOpacity onPress={signOut}>
            <Feather
              style={styles.logout}
              name="log-out"
              size={24}
              color="#BDBDBD"
            />
          </TouchableOpacity>
          <View>
            {photo ? (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: photo }} style={styles.imageUser} />
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
            <View>
              <Text style={styles.name}>{login}</Text>
            </View>
            {userPosts && userPosts.length > 0 && (
              <View>
                <FlatList
                  data={userPosts}
                  keyExtractor={(item, indx) => indx.toString()}
                  showsVerticalScrollIndicator={true}
                  renderItem={({ item }) => {
                    return (
                      <View
                        style={{
                          marginBottom: 30,
                        }}
                      >
                        <Image
                          source={{ uri: item.photo }}
                          style={styles.imagePosts}
                        />
                        <Text style={styles.title}>
                          {item.formValues.title}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 5,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("Comments", {
                                  postID: item.id,
                                  photo: item.photo,
                                })
                              }
                            >
                              <Icon
                                name="message-circle"
                                size={24}
                                color={
                                  commentsCount[item.id] > 0
                                    ? "#FF6C00"
                                    : "#BDBDBD"
                                }
                              />
                            </TouchableOpacity>
                            <Text style={styles.commentsCount}>
                              {commentsCount[item.id] || 0}
                            </Text>
                          </View>

                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                            onPress={() =>
                              navigation.navigate("Map", {
                                location: item.location,
                                title: item.formValues.title,
                              })
                            }
                          >
                            <Feather name="map-pin" size={24} color="#BDBDBD" />
                            <Text style={styles.locationText}>
                              {item.formValues.location}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
  
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    justifyContent: "flex-end",
  },
  wrapper: {
    paddingTop: 22,
    paddingBottom: 220,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    marginTop: 119,
    height: 500,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
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
    left: "33%",
    top: -105,
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
  },
  addIcon: {
    position: "absolute",
    left: "90%",
    top: "65%",
    width: 25,
    height: 25,
  },
  name: {
    fontSize: 30,
    lineHeight: 35,
    textAlign: "center",
    marginTop: 32,
    marginBottom: 33,
    color: "#212121",
  },
  logout: {
    marginLeft: "auto",
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
    marginRight: "auto",
    marginTop: 8,
  },
  imagePosts: {
    width: "100%",
    height: 240,
    borderRadius: 8,
  },
  commentsCount: {
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
    marginLeft: 9,
  },
  locationText: {
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
    marginLeft: 8,
    textDecorationLine: "underline",
  },
});
