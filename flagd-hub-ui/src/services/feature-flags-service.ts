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

  // Helper method to convert variants from objects to Maps
  private static convertVariantsToMap(flags: any[]): FeatureFlag[] {
    return flags.map(flag => {
      // If variants is an object, convert it to a Map
      if (flag.variants && !(flag.variants instanceof Map)) {
        const variantsMap = new Map<string, string>();
        Object.entries(flag.variants).forEach(([key, value]) => {
          variantsMap.set(key, value as string);
        });
        flag.variants = variantsMap;
      }
      return flag;
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
      return this.convertVariantsToMap(response.data);
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      throw error;
    }
  }


  static async getChangeLogs(): Promise<Map<string,Changelog>> {
    try {
      const response = await FeatureFlagsService.apiClient.get('/flags/changelogs');
      return response.data;
    } catch (error) {
      console.error('Error fetching feature flags changelogs', error);
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

  static async updateFeatureFlag(featureFlag: FeatureFlag) {
    try {
      const json = JSON.stringify({
        ...featureFlag,
        variants: Object.fromEntries(featureFlag.variants),
      });
      const response = await FeatureFlagsService.apiClient.put(`/flags/${featureFlag.key}`, json);
      return response.data;
    } catch (error) {
      console.error(`Error updating feature flag (${featureFlag.key}):`, error);
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
