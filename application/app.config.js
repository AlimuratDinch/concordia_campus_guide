import 'dotenv/config';

export default {
  expo: {
    name: "minicap_concordia_campus_guide_app",
    slug: "minicap_concordia_campus_guide_app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.bu-abd.minicap-concordia-campus-guide-app",
      config: {
        googleMapsApiKey: process.env.API_KEY
      }
    },
    android: {
      config: {
        googleMaps: {
          apiKey: process.env.API_KEY
        }
      },
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.bu_abd.minicap_concordia_campus_guide_app"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    extra: {
      API_KEY: process.env.API_KEY,
      SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    }
  }
};
