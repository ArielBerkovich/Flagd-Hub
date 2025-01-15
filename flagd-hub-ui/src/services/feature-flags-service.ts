import axios, { AxiosInstance } from 'axios';
import FeatureFlag from '../models/FeatureFlag';

class FeatureFlagsService {
  private apiClient: AxiosInstance;

  constructor(baseURL: string = `${process.env.REACT_APP_SERVER_URL}/flagd-hub/`) {
    this.apiClient = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // This method returns a promise that resolves to an array of FeatureFlag instances
  async getFeatureFlags(): Promise<FeatureFlag[]> {
    try {
      const response = await this.apiClient.get('/flags');
      return response.data;
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      throw error;
    }
  }

  // The method signature specifies that flagName is a string and flagData is any
  async setFeatureFlag(flagName: string, flagData: any): Promise<any> {
    try {
      const response = await this.apiClient.put(`/flags/${flagName}`, flagData);
      return response.data;
    } catch (error) {
      console.error(`Error setting feature flag (${flagName}):`, error);
      throw error;
    }
  }
}

export default FeatureFlagsService;
