import axios from "axios";
import { API_PATH, BASE_URL } from "./constant"

export const createAppoinment = async (data:any) => {
    const url = BASE_URL + API_PATH.APPOINTMENT;

    // const response = await axios(url, {
    //     data: data,
    //     method: 'POST',
    // })

    // return response.data;

    return {
        id: new Date().getTime().toString(),
        ...data,
    }
}