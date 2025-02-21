import React, { useState } from "react";
import { router } from "expo-router";
import { Text, Pressable, View, StyleSheet } from "react-native";
import FeedbackPopUp from "../components/FeedbackPopUp";

export default function Index() {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  return (
    <View style={styles.view}>
      <Pressable 
        style={styles.button}
        onPress={() => router.push("/CampusMap")}
      >
        <Text style={styles.buttonText}>Campus Map</Text>
      </Pressable>
      <Pressable 
        style={styles.button}
        onPress={() => setIsFeedbackVisible(true)}
      >
        <Text style={styles.buttonText}>Leave Feedback</Text>
        
      </Pressable>
      <FeedbackPopUp visible={isFeedbackVisible} onClose={() => setIsFeedbackVisible(false)} />
    </View>
    
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 10,
    backgroundColor: "#912338",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
});