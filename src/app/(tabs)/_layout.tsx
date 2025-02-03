import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { MD3LightTheme, MD3DarkTheme, Avatar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const paperTheme =
    colorScheme === "dark"
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: paperTheme.colors.surface },
        tabBarActiveTintColor: paperTheme.colors.primary,
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: ({ color }) => 
          <MaterialIcons name="home-filled" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(explore)"
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="search" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(pets)"
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="pets" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(notifications)"
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="notifications" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
};