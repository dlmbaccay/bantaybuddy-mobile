import React, { useState, useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Dimensions, TouchableWithoutFeedback, TextInput } from "react-native";
import { Portal, Button, Text, useTheme, IconButton } from "react-native-paper";
import { View } from "react-native";
import { white } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreatePostModal = ({ visible, onClose }: CreatePostModalProps) => {
  const theme = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const translateY = useRef(new Animated.Value(Dimensions.get('window').height)).current;

  useEffect(() => {
    if (visible) {
      setIsAnimating(true);
      Animated.timing(translateY, { 
        toValue: 0, 
        duration: 150, 
        easing: Easing.out(Easing.ease), 
        useNativeDriver: true }).start();
    } else {
      Animated.timing(translateY, { 
        toValue: Dimensions.get('window').height, 
        duration: 150, 
        easing: Easing.in(Easing.ease), 
        useNativeDriver: true,}).start(() => setIsAnimating(false));
    }
  }, [visible, translateY]);

  return (
    <Portal>
      {isAnimating && (
        <Animated.View
          style={{
            transform: [{ translateY }],
            height: "100%",
            width: "100%",
            paddingTop: 60,
            backgroundColor: theme.colors.background,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <View className="flex flex-row justify-between items-center w-full">
            <Button mode="text" onPress={onClose}>
              <Text style={{ color: theme.colors.onBackground, fontSize: 16 }}>
                Cancel
              </Text>
            </Button>
            
            <Text style={{ color: theme.colors.onBackground, fontSize: 16 }} className="font-bold">
              Create a Post
            </Text>

            <Button mode="text" onPress={() => ({})}>
              <Text style={{ color: theme.colors.primary, fontSize: 16 }}>
                Post
              </Text>
            </Button>
          </View>
        </Animated.View>
      )}
    </Portal>
  );
};

export default CreatePostModal;