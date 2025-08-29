import { login } from "@/api/authService";
import { setToken } from "@/api/constant";
import Button from "@/components/button/Button";
import GoogleSignIn from "@/components/googleSignin/GoogleSignIn";
import { COLORS } from "@/constants/Colors";
import { useUser } from "@/context/UserContext";
import { useShowMessage } from "@/hooks/useShowMessage";
import ShowMessage from "@/components/showMessage/ShowMessage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Login = () => {
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { visible, toastData, hideMessage, showInfo, showError, showSuccess } =
    useShowMessage();

  const handleLoginSuccess = async (userData: any, token: string) => {
    setUser({
      name: "Username",
      email: "email@gmail.com",
      photo:
        "https://png.pngtree.com/png-clipart/20200701/original/pngtree-business-men-silhouette-avatar-png-image_5434725.jpg",
    });

    await setToken(token);

    router.replace("/home");
  };

  const onPressLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showInfo("Please enter both email and password", "Info");
      return;
    }

    setIsLoading(true);

    try {
      const res = await login({ email: email.trim(), password });
      console.log("token: ", res?.data?.token);
      const { user } = res.data;
      showSuccess("Login successful!", "Welcome");
      handleLoginSuccess(user, res?.data?.token);
    } catch (error) {
      console.log("Error authenticating with backend: ", error);
      showError("Email or password is incorrect", "Login Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/facility.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                onChangeText={setEmail}
                value={email}
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                onChangeText={setPassword}
                value={password}
                style={[styles.textInput, styles.passwordInput]}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Button
              onPress={onPressLogin}
              label={isLoading ? "Signing in..." : "Sign In"}
              style={[styles.loginButton, isLoading && styles.disabledButton]}
            />

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Phone Login Button */}
            <TouchableOpacity
              style={styles.phoneLoginButton}
              onPress={() => router.push("/phone-login")}
            >
              <Ionicons
                name="phone-portrait-outline"
                size={20}
                color={COLORS.PRIMARY}
              />
              <Text style={styles.phoneLoginText}>
                Sign in with Phone Number
              </Text>
            </TouchableOpacity>

            {/* Google Sign In */}
            <GoogleSignIn />

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupQuestion}>
                Don&apos;t have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.signupLink}>Sign up now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ShowMessage Component */}
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
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY || "#0B3DA9",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerSection: {
    flex: 0.35,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  logoContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logo: {
    width: 200,
    height: 120,
  },
  formSection: {
    flex: 0.65,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
  },
  formContainer: {
    paddingHorizontal: 24,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.PRIMARY || "#0B3DA9",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: COLORS.PRIMARY || "#0B3DA9",
    marginBottom: 20,
    height: 56,
    borderRadius: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e1e5e9",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#666",
  },
  phoneLoginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.PRIMARY || "#0B3DA9",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  phoneLoginText: {
    fontSize: 16,
    color: COLORS.PRIMARY || "#0B3DA9",
    fontWeight: "500",
    marginLeft: 8,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 30,
  },
  signupQuestion: {
    fontSize: 16,
    color: "#666",
  },
  signupLink: {
    fontSize: 16,
    color: COLORS.PRIMARY || "#0B3DA9",
    fontWeight: "600",
  },
});
