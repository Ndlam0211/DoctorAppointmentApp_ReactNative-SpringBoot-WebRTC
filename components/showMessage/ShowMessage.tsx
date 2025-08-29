import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface ShowMessageProps {
  visible: boolean;
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  duration?: number; // Thời gian tự động ẩn (ms), 0 = không tự động ẩn
  onHide: () => void;
  onPress?: () => void;
}

export const ShowMessage: React.FC<ShowMessageProps> = ({
  visible,
  type = "info",
  title,
  message,
  duration = 3000,
  onHide,
  onPress,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const getConfig = () => {
    switch (type) {
      case "success":
        return {
          backgroundColor: "#4CAF50",
          iconName: "checkmark-circle-outline" as const,
          iconColor: "#fff",
        };
      case "error":
        return {
          backgroundColor: "#F44336",
          iconName: "close-circle-outline" as const,
          iconColor: "#fff",
        };
      case "warning":
        return {
          backgroundColor: "#FF9800",
          iconName: "warning-outline" as const,
          iconColor: "#fff",
        };
      default:
        return {
          backgroundColor: "#2196F3",
          iconName: "information-circle-outline" as const,
          iconColor: "#fff",
        };
    }
  };

  const config = getConfig();

  const showAnimation = useCallback(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, opacityAnim]);

  const hideAnimation = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  }, [slideAnim, opacityAnim, onHide]);

  useEffect(() => {
    if (visible) {
      // Reset animation values
      slideAnim.setValue(-100);
      opacityAnim.setValue(0);

      // Show animation
      showAnimation();

      // Auto hide after duration
      if (duration > 0) {
        const timer = setTimeout(() => {
          hideAnimation();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [visible, duration, showAnimation, hideAnimation, slideAnim, opacityAnim]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        activeOpacity={onPress ? 0.8 : 1}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={config.iconName} size={24} color={config.iconColor} />
        </View>

        <View style={styles.textContainer}>
          {title && (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          )}
          <Text style={styles.message} numberOfLines={2}>
            {message}
          </Text>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={hideAnimation}>
          <Ionicons name="close" size={20} color={config.iconColor} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 9999,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  message: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
});

export default ShowMessage;
