import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

const ProfileScreen = () => {
    return (
      <View style={styles.container}>
        <Text>ProfileScreen</Text>
        <StatusBar style="auto" />
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});

export default ProfileScreen;