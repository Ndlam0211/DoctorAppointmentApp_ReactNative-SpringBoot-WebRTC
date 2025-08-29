// Ví dụ sử dụng ShowMessage trong component

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ShowMessage from "../components/showMessage/ShowMessage";
import { useShowMessage } from "../hooks/useShowMessage";

export const ExampleScreen = () => {
  const {
    visible,
    toastData,
    hideMessage,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  } = useShowMessage();

  // Ví dụ functions cho API calls
  const handleLogin = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccess("Đăng nhập thành công!", "Chào mừng");
    } catch {
      showError("Đăng nhập thất bại!", "Lỗi");
    }
  };

  const handleBooking = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccess("Đặt lịch thành công!", "Hoàn tất", {
        duration: 5000,
        onPress: () => {
          console.log("Navigate to appointment");
        },
      });
    } catch {
      showError("Đặt lịch thất bại!", "Lỗi", {
        duration: 0, // Không tự động ẩn
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Các button để test */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => showSuccess("Thành công!", "Hoàn tất")}
      >
        <Text style={styles.buttonText}>Show Success</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => showError("Có lỗi xảy ra!", "Lỗi")}
      >
        <Text style={styles.buttonText}>Show Error</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => showWarning("Cảnh báo!", "Chú ý")}
      >
        <Text style={styles.buttonText}>Show Warning</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => showInfo("Thông tin!", "Thông báo")}
      >
        <Text style={styles.buttonText}>Show Info</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Test Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleBooking}>
        <Text style={styles.buttonText}>Test Booking</Text>
      </TouchableOpacity>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    padding: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 150,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
