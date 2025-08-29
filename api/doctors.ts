import { API_PATH, BASE_URL, getToken } from "./constant"
import axios from "axios";

export const fetchDoctors = async () => {
  const url = BASE_URL + API_PATH.DOCTORS;
  const token = await getToken();

    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data.data;
};

export const fetchDoctorById = async (id:string) => {
  const url = BASE_URL + API_PATH.DOCTORS + `/${id}`;
  const token = await getToken();

  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.data;
};