import { register } from "@/api/authService";
import { setToken } from "@/api/constant";
import Button from "@/components/button/Button";
import { ShowMessage, useShowMessage } from "@/components/showMessage";
import { useUser } from "@/context/UserContext";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Register = () => {
  // const [mobileNumber, setMobileNumber] = useState('');
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { visible, toastData, hideMessage, showSuccess, showError } =
    useShowMessage();

  const handleLoginSuccess = async (userData: any, token: string) => {
    setUser({
      name: "Username",
      email: email,
      photo:
        "https://png.pngtree.com/png-clipart/20200701/original/pngtree-business-men-silhouette-avatar-png-image_5434725.jpg",
    });

    await setToken(token);
    // Show success message
    showSuccess("Account created successfully!", "Welcome!");
    router.replace("/home");
  };

  const onPressLogin = async () => {
    // Validation
    if (!email.trim()) {
      showError("Please enter your email", "Email Required");
      return;
    }

    if (!password.trim()) {
      showError("Please enter your password", "Password Required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Please enter a valid email address", "Invalid Email");
      return;
    }

    // Password validation
    if (password.length < 6) {
      showError("Password must be at least 6 characters", "Password Too Short");
      return;
    }

    setIsLoading(true);

    try {
      const res = await register({ email, password });
      console.log("token: ", res?.data?.token);
      const { user } = res.data;

      // Handle successful registration
      await handleLoginSuccess(user, res?.data?.token);
    } catch (error: any) {
      console.log("Error registering: ", error);

      // Handle different error types
      if (error.response?.status === 409) {
        showError(
          "Email already exists. Please use a different email.",
          "Registration Failed"
        );
      } else if (error.response?.status === 400) {
        showError(
          "Email already exists. Please use a different email.",
          "Registration Failed"
        );
      } else {
        showError(
          "Registration failed. Please try again.",
          "Registration Failed"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "#0B3DA9",
        }}
      >
        <View
          style={{
            flex: 0.5,
            justifyContent: "center",
            marginTop: 20,
            alignItems: "center",
          }}
        >
          <Image
            source={require("@/assets/images/facility.png")}
            style={{ width: "100%" }}
            resizeMode="contain"
          />
        </View>
        <View
          style={{
            flex: 0.5,
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={styles.loginLink}
            accessibilityRole="button"
            accessibilityLabel="Go to login"
          >
            <Text style={styles.loginLinkText}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
          <View style={styles.inputRow}>
            <Text style={styles.label}>{"Email:"}</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>{"Password:"}</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
              placeholder="Password"
              autoCapitalize="none"
              returnKeyType="done"
              // onSubmitEditing={onPressLogin}
            />
          </View>
          <View
            style={{
              width: "100%",
              paddingVertical: 15,
              paddingHorizontal: 10,
            }}
          >
            <Button
              onPress={isLoading ? undefined : onPressLogin}
              style={{ backgroundColor: isLoading ? "#0B3DA9" : "#0B3DA9" }}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}
                >
                  Signup
                </Text>
              )}
            </Button>
          </View>
        </View>
      </View>

      {/* ShowMessage component */}
      {toastData && (
        <ShowMessage
          visible={visible}
          type={toastData.type}
          title={toastData.title}
          message={toastData.message}
          duration={toastData.duration}
          onHide={hideMessage}
          onPress={toastData.onPress}
        />
      )}
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  loginLink: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  loginLinkText: {
    fontSize: 16,
    color: "#0B3DA9",
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    height: 56,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    alignItems: "center",
    margin: 10,
    borderRadius: 10,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    paddingHorizontal: 8,
    width: 90,
  },
  input: {
    padding: 10,
    fontSize: 16,
    flex: 1,
  },
});
