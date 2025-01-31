import "dotenv/config";

const appConfig = {
  "expo": {
    "name": "bb-mobile",
    "slug": "bb-mobile",
    "scheme": "bb-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "package": "com.dlmbaccay.bb",
      "bundleIdentifier": "com.dlmbaccay.bb",
      "googleServicesFile": "./GoogleService-Info.plist",
      "supportsTablet": true
    },
    "android": {
      "package": "com.dlmbaccay.bb",
      "googleServicesFile": "./google-services.json",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ]
    ],
  }
}

module.exports = appConfig;