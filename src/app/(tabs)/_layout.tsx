import { Tabs } from "expo-router";
import { useColorScheme, TouchableOpacity } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import CreatePostModal from "../../components/CreatePostModal";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();
  const [modalVisible, setModalVisible] = useState(false);

  const paperTheme =
    colorScheme === "dark"
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };

  return (
    <>
      {/* Create Post Modal */}
      <CreatePostModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      {/* Bottom Navigation */}
      <Tabs
        screenOptions={{
          tabBarStyle: { backgroundColor: paperTheme.colors.surface },
          tabBarActiveTintColor: paperTheme.colors.primary, // Active tab color
          tabBarInactiveTintColor: "gray", // Inactive tab color
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            tabBarIcon: ({ color, focused }) =>
              <MaterialCommunityIcons name={focused ? "home" : "home-outline"} size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="(explore)"
          options={{
            tabBarIcon: ({ color, focused }) =>
              <MaterialCommunityIcons name={focused ? "magnify" : "magnify"} size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="(create)"
          options={{
            tabBarIcon: ({ color, focused }) =>
              <MaterialCommunityIcons name={focused ? "plus-circle" : "plus-circle-outline"} size={32} color={color} />,
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={() => setModalVisible(true)} />
            ),
          }}
        />
        <Tabs.Screen
          name="(pets)"
          options={{
            tabBarIcon: ({ color, focused }) =>
              <MaterialCommunityIcons name={focused ? "paw" : "paw-outline"} size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="(notifications)"
          options={{
            tabBarIcon: ({ color, focused }) =>
              <MaterialCommunityIcons name={focused ? "cards-heart" : "cards-heart-outline"} size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            tabBarIcon: ({ color, focused }) =>
              <MaterialCommunityIcons name={focused ? "account" : "account-outline"} size={28} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}