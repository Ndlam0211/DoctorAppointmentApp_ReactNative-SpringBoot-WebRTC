import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "http://10.18.0.210:8080/api";

export const API_PATH = {
  DOCTORS: "/doctors",
  SPECIALITY: "/specialities",
  APPOINTMENT: "/appointments",
  AUTH_GOOGLE_LOGIN: "/auth/google-login",
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/signup",
};

export async function setToken(token:string) {
  await AsyncStorage.setItem("token", token);
};

export async function getToken() {
  return await AsyncStorage.getItem("token");
}