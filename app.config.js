import "dotenv/config";

const appConfig = {
  "expo": {
    "name": "BantayBuddy",
    "slug": "bb-mobile",
    "scheme": "bb-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./src/assets/app-icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./src/assets/app-icon.png",
      "resizeMode": "contain",
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
        "foregroundImage": "./src/assets/app-icon-foreground.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./src/assets/app-icon.png"
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