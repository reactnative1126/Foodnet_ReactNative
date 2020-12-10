import axios from 'axios';
import { API_URL } from '@constants/configs';

axios.defaults.baseURL = API_URL;
axios.defaults.headers.common = { 'Content-Type': 'application/json' };
// axios.defaults.headers.common = { 'Content-Transfer-Encoding': 'application/gzip' };
axios.defaults.responseType = 'json';

export const setClientToken = token => {
    axios.defaults.headers.common['x-auth-token'] = token;
};

export const removeClientToken = () => {
    delete axios.defaults.headers.common['x-auth-token'];
};

export default axios;