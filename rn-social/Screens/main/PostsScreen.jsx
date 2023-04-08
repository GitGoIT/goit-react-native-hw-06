import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

import CommentsScreen from "./CommentsScreen";

const NestedScreen = createStackNavigator();


const PostsScreen = () => {
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        options={{
          title: "Публікації",
          headerRight: () => (
            <TouchableOpacity>
              <Feather
                name="log-out"
                size={24}
                color="#BDBDBD"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
        name="CommentsScreen"
        component={CommentsScreen}
      />
    </NestedScreen.Navigator>
  );
};


export default PostsScreen;
