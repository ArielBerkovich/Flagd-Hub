import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { environment } from '../utils/environment.util';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { API_PATHS } from '../constants/api.constants';
import { ENV_KEYS } from '../constants/environment.constants';

let apiClientInstance: AxiosInstance | null = null;

/**
 * Creates and configures the API client with interceptors
 */
async function createApiClient(): Promise<AxiosInstance> {
  const baseURL = await environment.get(ENV_KEYS.FLAGD_HUB_API);

  const client = axios.create({
    baseURL: `${baseURL}${API_PATHS.BASE}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add JWT token
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      }
      return Promise.reject(error);
    }
  );

  return client;
}

/**
 * Gets the API client instance (singleton pattern)
 * Initializes on first call
 */
export async function getApiClient(): Promise<AxiosInstance> {
  if (!apiClientInstance) {
    apiClientInstance = await createApiClient();
  }
  return apiClientInstance;
}

/**
 * Resets the API client (useful for testing or re-initialization)
 */
export function resetApiClient(): void {
  apiClientInstance = null;
}
