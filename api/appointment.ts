import axios from "axios";
import { API_PATH, BASE_URL, getHeaders } from "./constant"

export const createAppoinment = async (data) => {
    const url = BASE_URL + API_PATH.APPOINTMENT;

    // const response = await axios(url, {
    //     data: data,
    //     method: 'POST',
    //     headers: getHeaders()
    // })

    // return response.data;

    return {
        id: new Date().getTime().toString(),
        ...data,
    }
}