import React, { useState } from "react";
import { router } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function SignUpScreen({ navigation }: any) {
  const [netname, setNetname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/concordia-logo.jpg")} style={styles.logo} />

      <Text style={styles.welcomeText}>Create Your Account</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Netname"
          value={netname}
          onChangeText={setNetname}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.signUpButton} 
          onPress={() => console.log("TEMPORARY: Sign Up button clicked")}
        >
          <Text style={styles.signUpText}>Sign Up (WIP)</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.link}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7A1E29",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 250,
    height: 80,
    resizeMode: "contain",
    marginBottom: 20,
  },
  welcomeText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  formContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    elevation: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  signUpText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "blue",
    marginTop: 10,
    textDecorationLine: "underline",
  },
});
