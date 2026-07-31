import { getApiClient } from './api-client';
import { FeatureFlag, Changelog, LoginRequest, LoginResponse } from '../models';
import { convertVariantsToMap, serializeFeatureFlag } from '../utils/variant-converter.utils';
import { API_PATHS } from '../constants/api.constants';

/**
 * Authenticates a user and returns a JWT token
 */
export async function login(loginRequest: LoginRequest): Promise<LoginResponse> {
  try {
    const client = await getApiClient();
    const response = await client.post<LoginResponse>(API_PATHS.LOGIN, loginRequest);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}

/**
 * Retrieves changelogs for a specific feature flag
 */
export async function getChangelogs(flagKey: string): Promise<Changelog[]> {
  try {
    const client = await getApiClient();
    const response = await client.get<Changelog[]>(API_PATHS.FLAG_CHANGELOG(flagKey));
    return response.data;
  } catch (error) {
    console.error(`Error fetching changelogs for flag ${flagKey}:`, error);
    throw error;
  }
}

/**
 * Retrieves all feature flags
 */
export async function getFeatureFlags(): Promise<FeatureFlag[]> {
  try {
    const client = await getApiClient();
    const response = await client.get<any[]>(API_PATHS.FLAGS);
    return convertVariantsToMap(response.data);
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    throw error;
  }
}

/**
 * Retrieves changelogs for all feature flags
 */
export async function getAllChangeLogs(): Promise<Map<string, Changelog>> {
  try {
    const client = await getApiClient();
    const response = await client.get<Map<string, Changelog>>(API_PATHS.CHANGELOGS);
    return response.data;
  } catch (error) {
    console.error('Error fetching feature flags changelogs', error);
    throw error;
  }
}

/**
 * Updates the default variant of a feature flag
 */
export async function setFeatureFlagVariant(flagKey: string, defaultVariant: string): Promise<any> {
  try {
    const client = await getApiClient();
    const response = await client.put(API_PATHS.FLAG_BY_KEY(flagKey), { defaultVariant });
    return response.data;
  } catch (error) {
    console.error(`Error setting feature flag variant (${flagKey}):`, error);
    throw error;
  }
}

/**
 * Updates an existing feature flag
 */
export async function updateFeatureFlag(featureFlag: FeatureFlag): Promise<any> {
  try {
    const client = await getApiClient();
    const serialized = serializeFeatureFlag(featureFlag);
    const response = await client.put(API_PATHS.FLAG_BY_KEY(featureFlag.key), JSON.stringify(serialized));
    return response.data;
  } catch (error) {
    console.error(`Error updating feature flag (${featureFlag.key}):`, error);
    throw error;
  }
}

/**
 * Creates a new feature flag
 */
export async function createFeatureFlag(featureFlag: FeatureFlag): Promise<any> {
  try {
    const client = await getApiClient();
    const serialized = serializeFeatureFlag(featureFlag);
    const response = await client.post(API_PATHS.FLAGS, JSON.stringify(serialized));
    return response.data;
  } catch (error) {
    console.error(`Error creating feature flag:`, error);
    throw error;
  }
}

/**
 * Deletes a feature flag
 */
export async function deleteFeatureFlag(flagKey: string): Promise<any> {
  try {
    const client = await getApiClient();
    const response = await client.delete(API_PATHS.FLAG_BY_KEY(flagKey));
    return response.data;
  } catch (error) {
    console.error(`Failed to delete flag (${flagKey}):`, error);
    throw error;
  }
}
