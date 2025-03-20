// import statusCodes along with GoogleSignin
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { router } from "expo-router";
  
// Somewhere in your code
export const signIn = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      if (userInfo.data !== null) {
        router.push("/menu");
      }
    } catch (error: any) {
      console.log("Sign in error:", error);
      if (error.code) {
        const errorMessages: Record<string, string> = {
          [statusCodes.IN_PROGRESS]: "Sign-in already in progress.",
          [statusCodes.PLAY_SERVICES_NOT_AVAILABLE]: "Google Play Services not available.",
        };
        console.log(errorMessages[error.code] || "An unknown error occurred.");
      }
    }
  };