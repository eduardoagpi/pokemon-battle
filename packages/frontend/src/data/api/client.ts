import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL_STORAGE_KEY = 'api_url';
const DEFAULT_URL = 'http://localhost:3000';

/**
 * Singleton instance of Axios for API requests.
 */
class ApiClient {
    private static instance: ApiClient;
    private axiosInstance: AxiosInstance;

    private constructor() {
        const initialApiUrl =
            localStorage.getItem(API_URL_STORAGE_KEY) || DEFAULT_URL;

        this.axiosInstance = axios.create({
            baseURL: initialApiUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error('API Error:', error.response?.data || error.message);
                return Promise.reject(error);
            }
        );
    }

    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    public setBaseUrl(url: string): void {
        this.axiosInstance.defaults.baseURL = url;
        localStorage.setItem(API_URL_STORAGE_KEY, url)
    }

    public getBaseUrl(): string {
        return this.axiosInstance.defaults.baseURL as string || DEFAULT_URL;
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
        return response.data;
    }

    public async post<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
        return response.data;
    }

    public async put<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
        return response.data;
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
        return response.data;
    }
}

export const apiClient = ApiClient.getInstance();
