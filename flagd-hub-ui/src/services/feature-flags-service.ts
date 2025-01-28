import axios, { AxiosInstance } from 'axios';
import FeatureFlag from '../models/FeatureFlag';
import LoginResponse from '../models/LoginResponse';
import LoginRequest from '../models/LoginRequest';
import Changelog from '../models/Changelog';
import Environment from '../utils/Environment';

class FeatureFlagsService {
  private static apiClient: AxiosInstance = axios.create({
    baseURL: Environment.get("flagd_hub_api")+`/flagd-hub/`,
    headers: {
      'Content-Type': 'application/json'
        },
  });

  // Add an interceptor to include the JWT token in the Authorization header
  static initializeInterceptors() {
    this.apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('flagd-hub-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });
  }

  static async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await FeatureFlagsService.apiClient.post('/login', loginRequest);
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  static async getChangelogs(flagKey:string): Promise<Changelog[]> {
    try {
      const response = await FeatureFlagsService.apiClient.get(`/flags/${flagKey}/changelog`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      throw error;
    }
  }

  static async getFeatureFlags(): Promise<FeatureFlag[]> {
    try {
      const response = await FeatureFlagsService.apiClient.get('/flags');
      return response.data;
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      throw error;
    }
  }

  static async setFeatureFlag(flagKey: string, flagData: any) {
    try {
      const response = await FeatureFlagsService.apiClient.put(`/flags/${flagKey}`, { defaultVariant: flagData });
      return response.data;
    } catch (error) {
      console.error(`Error setting feature flag (${flagKey}):`, error);
      throw error;
    }
  }

  static async createFeatureFlag(featureFlag: FeatureFlag) {
    try {
      const json = JSON.stringify({
        ...featureFlag,
        variants: Object.fromEntries(featureFlag.variants),
      });
      const response = await FeatureFlagsService.apiClient.post(`/flags`, json);
      return response.data;
    } catch (error) {
      console.error(`Error creating feature flag (${featureFlag}):`, error);
      throw error;
    }
  }

  static async deleteFeatureFlag(flagKey: string) {
    try {
      const response = await FeatureFlagsService.apiClient.delete(`/flags/${flagKey}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete (${flagKey}):`, error);
      throw error;
    }
  }
}

// Initialize interceptors on service load
FeatureFlagsService.initializeInterceptors();

export default FeatureFlagsService;
