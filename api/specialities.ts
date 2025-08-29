import { specialities } from "@/constants/AppContent";
import { API_PATH, BASE_URL, getToken } from "./constant"
import axios from "axios";

export const fetchSpecialities = async ()=>{
  const url = BASE_URL + API_PATH.SPECIALITY;
  const token = await getToken();

  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.data;
};

export const fetchSpecialityById = async (id:string) => {
  const url = BASE_URL + API_PATH.SPECIALITY + `/${id}`;
  const token = await getToken();

  const {data} = await axios.get(url, 
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return data.data;
};