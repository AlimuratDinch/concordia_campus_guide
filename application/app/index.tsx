import { router } from "expo-router";
import { Text, Pressable, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.view}>
      <Pressable 
        style={styles.button}
        onPress={() => router.push("/CampusMap")}
      >
        <Text style={styles.buttonText}>Campus Map</Text>
      </Pressable>
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