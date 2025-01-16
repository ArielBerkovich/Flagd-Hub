import axios, { AxiosInstance } from 'axios';
import FeatureFlag from '../models/FeatureFlag';

class FeatureFlagsService {
  private static apiClient: AxiosInstance = axios.create({
    baseURL: `/flagd-hub/`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // This method returns a promise that resolves to an array of FeatureFlag instances
  static async getFeatureFlags(): Promise<FeatureFlag[]> {
    try {
      const response = await FeatureFlagsService.apiClient.get('/flags');
      return response.data;
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      throw error;
    }
  }

  // The method signature specifies that flagName is a string and flagData is any
  static async setFeatureFlag(flagName: string, flagData: any) {
    try {
      const response = await FeatureFlagsService.apiClient.put(`/flags/${flagName}`, {"defaultVariant":flagData});
      return response.data;
    } catch (error) {
      console.error(`Error setting feature flag (${flagName}):`, error);
      throw error;
    }
  }
}

export default FeatureFlagsService;
