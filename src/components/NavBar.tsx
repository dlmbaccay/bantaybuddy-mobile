import { BottomNavigation } from "react-native-paper";
import { useState } from "react";
import { router } from "expo-router";

const MyComponent = () => {
  const [index, setIndex] = useState(0);
  const routes = [
    { key: "home", focusedIcon: "home-outline" },
    { key: "explore", focusedIcon: "magnify" },
    { key: "notifications", focusedIcon: "bell-outline" },
    { key: "messages", focusedIcon: "message-outline" },
    { key: "profile", focusedIcon: "account-outline" },
  ];

  // Correct renderScene with empty functions (not used with Expo Router)
  const renderScene = BottomNavigation.SceneMap({
    home: () => null,
    explore: () => null,
    notifications: () => null,
    messages: () => null,
    profile: () => null,
  });

  // Handle navigation when a tab is selected
  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);
    router.push(`/${routes[newIndex].key}`);
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={handleIndexChange}
      renderScene={renderScene}
      barStyle={{ height: 70, }}
    />
  );
};

export default MyComponent;
