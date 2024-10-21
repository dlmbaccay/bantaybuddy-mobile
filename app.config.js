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
      "supportsTablet": true
    },
    "android": {
      "package": "com.dlmbaccay.bb",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router"
    ]
  }
}

module.exports = appConfig;