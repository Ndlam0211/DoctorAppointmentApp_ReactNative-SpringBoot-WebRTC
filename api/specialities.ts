import { specialities } from "@/constants/AppContent";
import { API_PATH, BASE_URL } from "./constant"
import axios from "axios";

export const fetchSpecialities = async ()=>{
    const url = BASE_URL + API_PATH.SPECIALITY;

    // call api get data from database
    // const {data} = await axios.get(url);
    // return data;

    // mock data
    return specialities;
};

export const fetchSpecialityById = async (id:string) => {
  return specialities?.find((item)=>item.id === id);
};