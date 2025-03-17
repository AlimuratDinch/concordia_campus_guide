import React, { useState } from "react";
import { router } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { initialize } from '@microsoft/react-native-clarity';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { signIn } from "../components/googleSignIn";
import { webClientIDVariable } from "./config";

const webClientID = webClientIDVariable
console.log(webClientID);

GoogleSignin.configure({
  webClientId: webClientID,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  offlineAccess: true,
  forceCodeForRefreshToken: true
});

initialize("qlbgvblls8");

export default function LoginScreen() {
  const [netname, setNetname] = useState("");
  const [password, setPassword] = useState("");

  //check if netname and password are "ADMIN"
  const handleSignIn = () => {
    if (netname === "ADMIN" && password === "ADMIN") {
      router.push("/menu");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/concordia-logo.jpg")} style={styles.logo} />

      <Text style={styles.welcomeText}>Welcome to Concordia Campus Guide</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Netname"
          value={netname}
          onChangeText={setNetname}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleSignIn}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
        />

        <TouchableOpacity onPress={() => console.log("TEMPORARY: Forgot Password?")}>
          <Text style={styles.link}>Forgot password? (WIP)</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/SignUp")}>
          <Text style={styles.link}>New student? Activate your account</Text>
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
    fontWeight: "bold"
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
  signInButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  signInText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "blue",
    marginTop: 10,
    textDecorationLine: "underline",
  }
});
