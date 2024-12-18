import axios, { AxiosRequestConfig } from 'axios';
import { decrypt, encrypt } from '@/components/DataEncryption';



export async function fetchFromApi(
    endpoint: string,
    options: AxiosRequestConfig = {},
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
) {
    const csrfResponse = await fetch('/api/csrf');
    const csrfData = await csrfResponse.json();



    if (csrfData) {
        const defaultOptions: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfData.csrfToken,
            },
        };



        const mergedOptions = {
            ...defaultOptions,
            ...options,
        };



        try {
            let response;
            switch (method) {
                case 'POST':
                    response = await axios.post(`/api/${endpoint}`, encrypt(mergedOptions.data), mergedOptions);
                    break;
                case 'PUT':
                    response = await axios.put(`/api/${endpoint}`, encrypt(mergedOptions.data), mergedOptions);
                    break;
                case 'DELETE':
                    response = await axios.delete(`/api/${endpoint}`, mergedOptions);
                    break;
                case 'GET':
                default:
                    response = await axios.get(`/api/${endpoint}`, mergedOptions);
                    break;
            }
            return decrypt(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.message);
            }
            throw new Error('An unexpected error occurred');
        }
    }


}
