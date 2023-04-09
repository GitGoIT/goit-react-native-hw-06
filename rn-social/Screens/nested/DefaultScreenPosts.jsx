import React, { useState, useEffect } from "react";
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

const DefaulScreenPosts = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);
  // console.log("route.params", route.params);

  useEffect(() => {
    if (route.params) {
      setPosts((prevState) => [...prevState, route.params]);
    }
  }, [route.params]);
  console.log("posts", posts);

  return (
    <View style={styles.container}>
      <View style={styles.wrapperUser}>
        <Image
          source={require("../../assets/images/Rectangle.jpg")}
          style={styles.userPhoto}
        />
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.userName}>Natali Romanova</Text>
          <Text style={styles.userEmail}>email@example.com</Text>
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
              <Text style={styles.title}>{item.title}</Text>
            </View>

            <View style={styles.mapComments}>
              <TouchableOpacity onPress={() => navigation.navigate("Comments")}>
                <Feather
                  name="message-circle"
                  size={20}
                  color="#BDBDBD"
                  style={styles.commentsIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Map")}
                style={styles.map}
              >
                <Feather
                  name="map-pin"
                  size={18}
                  color="#BDBDBD"
                  style={styles.mapIcon}
                />
                <Text style={styles.textMap}>{item.location}</Text>
              </TouchableOpacity>
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
  img: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  map: {
    position: "relative",
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
    width: 353,
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
