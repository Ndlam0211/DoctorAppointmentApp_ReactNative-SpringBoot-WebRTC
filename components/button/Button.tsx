import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

interface ButtonProps {
  label?: string;
  onPress?: () => void;
  style?: any;
  children?: React.ReactNode;
}

const Button = ({ label, onPress, style, children }: ButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      {children ? children : <Text style={styles.text}>{label}</Text>}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 10,
  },
  text: {
    color: "white",
    fontSize: 22,
  },
});
