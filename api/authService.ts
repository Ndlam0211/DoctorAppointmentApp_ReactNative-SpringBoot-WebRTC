import axios from 'axios';
import { API_PATH, BASE_URL } from './constant';

export const authenticate = async (data:any) => {
    const url = `${BASE_URL}${API_PATH.AUTH_GOOGLE_LOGIN}`;

    const response = await axios(url, {
        data: data,
        method: 'POST',
    })

    return response.data;
}