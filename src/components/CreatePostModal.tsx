import React, { useState, useEffect, useRef } from "react";
import { Platform, Animated, Easing, Dimensions, Modal } from "react-native";
import { Portal, Button, Text, useTheme, TextInput, IconButton } from "react-native-paper";
import { View } from "react-native";

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreatePostModal = ({ visible, onClose }: CreatePostModalProps) => {
  const theme = useTheme();
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} animationType="slide">
        <View 
          className={`
            flex flex-row justify-between items-center w-full 
            ${Platform.OS === "ios" ? "pt-16" : "pt-2"}`}
        >
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
      </Modal>
    </Portal>
  );
};

export default CreatePostModal;