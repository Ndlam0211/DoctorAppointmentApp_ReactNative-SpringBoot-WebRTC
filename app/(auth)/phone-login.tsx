import Button from "@/components/button/Button";
import ShowMessage from "@/components/showMessage/ShowMessage";
import { COLORS } from "@/constants/Colors";
import { useShowMessage } from "@/hooks/useShowMessage";
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

const PhoneLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { visible, toastData, hideMessage, showInfo, showError, showSuccess } =
    useShowMessage();

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      showInfo("Please enter phone number", "Info");
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[0-9]{9,11}$/;
    const cleanPhone = phoneNumber.replace(/\s/g, "");

    if (!phoneRegex.test(cleanPhone)) {
      showError("Invalid phone number (9-11 digits)", "Error");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showSuccess("OTP sent successfully!", "Success");

      // Navigate to OTP verification screen with phone number
      router.push({
        pathname: "/otp-verification",
        params: { mobileNumber: cleanPhone },
      });
    } catch {
      showError("Unable to send OTP. Please try again.", "Error");
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign in with Phone</Text>
        </View>

        {/* Logo/Image */}
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/facility.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Enter Phone Number</Text>
            <Text style={styles.subtitle}>
              We will send a verification code to your phone number
            </Text>

            {/* Phone Input */}
            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>🇻🇳 +84</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="Enter phone number"
                placeholderTextColor="#999"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>

            {/* Send OTP Button */}
            <Button
              onPress={handleSendOTP}
              label={isLoading ? "Sending..." : "Send OTP"}
              style={[styles.sendButton, isLoading && styles.disabledButton]}
            />

            {/* Back to Email Login */}
            <TouchableOpacity
              style={styles.backToEmailButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backToEmailText}>Back to email login</Text>
            </TouchableOpacity>
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

export default PhoneLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY || "#0B3DA9",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginRight: 40, // Compensate for back button
  },
  logoContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logo: {
    width: 200,
    height: 120,
  },
  contentContainer: {
    flex: 0.7,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  phoneInputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
  },
  countryCode: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRightWidth: 1,
    borderRightColor: "#e1e5e9",
    justifyContent: "center",
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: "500",
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: "#333",
  },
  sendButton: {
    backgroundColor: COLORS.PRIMARY || "#0B3DA9",
    marginBottom: 20,
    height: 56,
    borderRadius: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  backToEmailButton: {
    alignItems: "center",
    paddingVertical: 15,
  },
  backToEmailText: {
    fontSize: 16,
    color: COLORS.PRIMARY || "#0B3DA9",
    fontWeight: "500",
  },
});
