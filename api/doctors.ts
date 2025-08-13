import { doctors } from "@/constants/AppContent";
import { API_PATH, BASE_URL } from "./constant"
import axios from "axios";

export const fetchDoctors = async (token:string)=>{
    const url = BASE_URL + API_PATH.DOCTORS;

    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return data;
};

export const fetchDoctorById = async (id:string, token:string) => {
  const url = BASE_URL + API_PATH.DOCTORS + `/${id}`;

  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};