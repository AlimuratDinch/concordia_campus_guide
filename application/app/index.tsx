
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { router } from "expo-router";
import { supabase } from "./lib/supabase";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();


export default function LoginScreen() {
  const [netname, setNetname] = useState("");
  const [password, setPassword] = useState("");

  // Admin Login Check
  const handleSignIn = () => {
    if (netname === "ADMIN" && password === "ADMIN") {
      router.push("/menu");
    }
  };

  // Google Sign-In with Supabase
 const handleGoogleSignIn = async () => {
  try {
    console.log("Initiating Google Sign-In...");

    // Generate a redirect URI for Expo
    const redirectUri = AuthSession.makeRedirectUri();
    console.log("Generated Redirect URI:", redirectUri);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUri,
      },
    });

    if (error) {
      console.error("Google Sign-In Failed:", error.message);
      Alert.alert("Google Sign-In Failed", error.message);
      return;
    }

    console.log("Google Sign-In Data:", data);

    if (data?.url) {
      console.log("Opening Google Authentication URL:", data.url);

      // Open Google authentication
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
      console.log("Web Browser Auth Result:", result);

      if (result.type === "success") {
        console.log("Google Authentication Successful! Fetching session...");

        // Fetch user session after successful sign-in
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        
        console.log("Session Data:", session);
        console.log("Session Error:", sessionError);

        if (sessionError) {
          console.error("Session Error:", sessionError.message);
          Alert.alert("Session Error", sessionError.message);
        } else if (session?.session) {
          console.log("User logged in successfully:", session.session.user);
          console.log("Redirecting to /menu...");
          router.push("/menu");  // Redirect to menu page after success
        } else {
          console.warn("No session found after login.");
        }
      } else {
        console.warn("Google Sign-In was canceled.");
        Alert.alert("Google Sign-In Canceled");
      }
    }
  } catch (error) {
    console.error("Unexpected Error:");
    Alert.alert("Error");
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

        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        {/* Google Sign-In Button */}
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
          <Image source={require("../assets/images/favicon.png")} style={styles.googleLogo} />
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>

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
  googleButton: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 10,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    color: "black",
    fontSize: 16,
  },
  link: {
    color: "blue",
    marginTop: 10,
    textDecorationLine: "underline",
  },
});

// import React, { useState } from "react";
// import { router } from "expo-router";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";

// export default function LoginScreen() {
//   const [netname, setNetname] = useState("");
//   const [password, setPassword] = useState("");

//   //check if netname and password are "ADMIN"
//   const handleSignIn = () => {
//     if (netname === "ADMIN" && password === "ADMIN") {
//       router.push("/menu");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Image source={require("../assets/images/concordia-logo.jpg")} style={styles.logo} />

//       <Text style={styles.welcomeText}>Welcome to Concordia Campus Guide</Text>

//       <View style={styles.formContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Netname"
//           value={netname}
//           onChangeText={setNetname}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />

//         <TouchableOpacity
//           style={styles.signInButton}
//           onPress={handleSignIn}
//         >
//           <Text style={styles.signInText}>Sign In</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => console.log("TEMPORARY: Forgot Password?")}>
//           <Text style={styles.link}>Forgot password? (WIP)</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => router.push("/SignUp")}>
//           <Text style={styles.link}>New student? Activate your account</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#7A1E29",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   logo: {
//     width: 250,
//     height: 80,
//     resizeMode: "contain",
//     marginBottom: 20,
//   },
//   welcomeText: {
//     color: "white",
//     fontSize: 18,
//     textAlign: "center",
//     marginBottom: 20,
//     fontWeight: "bold"
//   },
//   formContainer: {
//     backgroundColor: "white",
//     padding: 20,
//     borderRadius: 10,
//     width: "90%",
//     alignItems: "center",
//     elevation: 5,
//   },
//   input: {
//     width: "100%",
//     height: 40,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//   },
//   signInButton: {
//     backgroundColor: "black",
//     paddingVertical: 10,
//     width: "100%",
//     alignItems: "center",
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   signInText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   link: {
//     color: "blue",
//     marginTop: 10,
//     textDecorationLine: "underline",
//   }
// });
