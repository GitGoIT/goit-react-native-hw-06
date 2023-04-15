import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { db } from "../../firebase/config";
import { onSnapshot, collection, query } from "firebase/firestore";

const DefaulScreenPosts = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);
  const [commentsCount, setCommentsCount] = useState({});

  const { email, login, photo, } = useSelector((state) => state.auth);

  const getAllPost = async () => {
    try {
      onSnapshot(collection(db, "posts"), (data) => {
        const posts = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setPosts(posts);
        posts.forEach((post) => {
          getCommentsCount(post.id);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllPost();
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

  return (
    <View style={styles.container}>
      <View style={styles.wrapperUser}>
        <Image source={{ uri: photo }} style={styles.userPhoto} />
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.userName}>{login}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item, indx) => indx.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 34,
            }}
          >
            <View style={styles.postContainer}>
              <Image source={{ uri: item.photo }} style={styles.img} />
              <Text style={styles.title}>{item.formValues.title}</Text>
            </View>
            <View style={styles.mapComments}>
              <View
                style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Comments", {
                      postID: item.id,
                      photo: item.photo,
                    })
                  }
                >
                  <Feather
                    name="message-circle"
                    size={20}
                    color={commentsCount[item.id] > 0 ? "#FF6C00" : "#BDBDBD"}
                    style={styles.commentsIcon}
                  />
                </TouchableOpacity>
                <Text style={styles.commentsCount}>
                  {commentsCount[item.id] || 0}
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Map", {
                      location: item.location,
                      title: item.formValues.title,
                    })
                  }
                >
                  <Feather
                    name="map-pin"
                    size={18}
                    color="#BDBDBD"
                    style={styles.mapIcon}
                  />
                  <Text style={styles.textMap}>{item.formValues.location}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#ffff",
  },
  postContainer: {
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    height: 240,
  },
  title: {
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
    marginRight: "auto",
    marginTop: 8,
  },
  commentsCount: {
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
    marginLeft: 9,
  },
  img: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  mapIcon: {
    position: "absolute",
  },
  textMap: {
    flex: 1,
    justifyContent: "space-between",
    marginLeft: 20,
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
    textAlign: "right",
    textDecorationLine: "underline",
  },
  mapComments: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wrapper: {
    width: 353,
  },
  wrapperUser: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
    width: 353,
  },
  userPhoto: {
    marginRight: 8,
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
    alignItems: "flex-start",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 13,
    lineHeight: 15,
    color: "#212121",
  },
  userEmail: {
    fontSize: 11,
    lineHeight: 13,
    color: "rgba(33, 33, 33, 0.8)",
  },
});

export default DefaulScreenPosts;
