import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DefaultScreenPosts from "./../nested/DefaultScreenPosts";
import CommentsScreen from "./../nested/CommentsScreen";
import MapScreen from "./../nested/MapScreen";
import { Feather } from "@expo/vector-icons";
import {useDispatch} from "react-redux";
import { authSignOutUser } from "../../redux/auth/authOperations"; // LogOut

const NestedScreen = createStackNavigator();

const PostsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch(); // LogOut
  const signOut = () => {        // LogOut
    dispatch(authSignOutUser());
  }

  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        options={{
          title: "Posts",
          headerTitleAlign: "center",
          headerRight: () => (
            <TouchableOpacity onPress={signOut}>
              <Feather
                name="log-out"
                size={24}
                color="#BDBDBD"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
        name="DefaultScreen"
        component={DefaultScreenPosts}
      />
      <NestedScreen.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
          title: "Comments",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather
                name="arrow-left"
                size={24}
                color="#212121"
                style={{ marginLeft: 16 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <NestedScreen.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: "Map",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather
                name="arrow-left"
                size={24}
                color="#212121"
                style={{ marginLeft: 16 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </NestedScreen.Navigator>
  );
};

export default PostsScreen;
