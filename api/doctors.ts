import { doctors } from "@/constants/AppContent";
import { API_PATH, BASE_URL } from "./constant"
import axios from "axios";

export const fetchDoctors = async ()=>{
    const url = BASE_URL + API_PATH.DOCTORS;

    // call api get data from database
    // const {data} = await axios.get(url);
    // return data;

    // mock data
    return doctors;
};

export const fetchDoctorById = async (id:string) => {
  return doctors?.find((item)=>item.id === id);
};