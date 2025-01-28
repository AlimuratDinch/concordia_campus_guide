import { router } from "expo-router";
import { Text, Pressable, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.view}
    >
      <Pressable 
        style={styles.button}
        onPress={() => router.push("/SGW_Map")}
      >
        <Text style={styles.buttonText}>Link to SGW</Text>
      </Pressable>
      <Pressable 
        style={styles.button}
        onPress={() => router.push("/Loyola_Map")}
      >
        <Text style={styles.buttonText}>Link to LOY</Text>
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