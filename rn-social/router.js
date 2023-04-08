import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity } from "react-native";

///icons
import { Feather } from "@expo/vector-icons";

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

import RegistrationScreen from "./Screens/auth/RegistrationScreen";
import LoginScreen from "./Screens/auth/LoginScreen";
import PostsScreen from "./Screens/main/PostsScreen";
import CreatePostsScreen from "./Screens/main/CreatePostsScreen";
import ProfileScreen from "./Screens/main/ProfileScreen";



export const useRoute = (isAuth) => {
    if (!isAuth) {
        return (
            <AuthStack.Navigator>
                <AuthStack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} />
                <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            </AuthStack.Navigator>
        );
    }
    return (
        <MainTab.Navigator
            screenOptions={{
                    tabBarShowLabel: false,
                    tabBarStyle: {
                    height: 83,
                    display: "flex",
                    gap: 30,
                    paddingHorizontal: 80,
                    paddingTop: 9,
                         },
                    }}>
            <MainTab.Screen options={{
                tabBarIcon: ({ focused, size, color }) => (<Feather name="grid" size={size} color={color} />),
                     tabBarItemStyle: { borderRadius: 20, },
                     tabBarActiveBackgroundColor: "#FF6C00",
                     tabBarActiveTintColor: "#FFFFFF",
                headerRight: () => (<TouchableOpacity><Feather
                     name="log-out"
                     size={24}
                     color="#BDBDBD"
                    style={{ marginRight: 10 }} /></TouchableOpacity>),
                    headerTitleAlign: "center",
            }} name="Публікації" component={PostsScreen} />
            <MainTab.Screen options={{
                tabBarIcon: ({ focused, size, color }) => (<Feather name="plus" size={size} color={color} />),
                     tabBarItemStyle: { borderRadius: 20, },
                     tabBarActiveBackgroundColor: "#FF6C00",
                     tabBarActiveTintColor: "#FFFFFF",
                     title: "Створити публікацію",
                     headerTitleAlign: "center",
            }}name="Створити публікацію" component={CreatePostsScreen} />
            <MainTab.Screen options={{
                tabBarIcon: ({ focused, size, color }) => (<Feather name="user" size={size} color={color} />),
                    tabBarItemStyle: { borderRadius: 20 },
                    tabBarActiveBackgroundColor: "#FF6C00",
                    tabBarActiveTintColor: "#FFFFFF",
                    headerShown: false,
            }} name="Profile" component={ProfileScreen} />
        </MainTab.Navigator>
    );
};