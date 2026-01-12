import { DEFAULT_LOCAL_CONFIG } from '../constants/environment.constants';

interface EnvironmentConfig {
  [key: string]: string;
}

class EnvironmentManager {
  private config: EnvironmentConfig = {};
  private isInitialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  /**
   * Loads environment configuration asynchronously
   */
  private async loadEnvironment(): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'development') {
        this.config = { ...DEFAULT_LOCAL_CONFIG };
        this.isInitialized = true;
        console.log('Using local config for development');
        return;
      }

      // Use fetch instead of synchronous XHR
      const response = await fetch('./environment');

      if (!response.ok) {
        throw new Error(`Failed to fetch environment: ${response.statusText}`);
      }

      this.config = await response.json();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to load environment configuration:', error);
      // Fallback to default config
      this.config = { ...DEFAULT_LOCAL_CONFIG };
      this.isInitialized = true;
    }
  }

  /**
   * Initializes the environment if not already loaded
   * Returns a promise that resolves when initialization is complete
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }

    if (!this.initPromise) {
      this.initPromise = this.loadEnvironment();
    }

    return this.initPromise;
  }

  /**
   * Gets an environment variable value
   * Automatically initializes if needed
   */
  public async get(key: string): Promise<string> {
    await this.initialize();

    if (!(key in this.config)) {
      console.warn(`Environment variable "${key}" is not set.`);
      return '';
    }

    return this.config[key];
  }

  /**
   * Gets an environment variable as a boolean
   */
  public async getBoolean(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value.toLowerCase() === 'true';
  }

  /**
   * Gets all environment variables
   */
  public async getAll(): Promise<EnvironmentConfig> {
    await this.initialize();
    return { ...this.config };
  }

  /**
   * Synchronous getter for when environment is already initialized
   * Use with caution - prefer async methods
   */
  public getSync(key: string): string {
    if (!this.isInitialized) {
      console.warn('Environment not initialized. Use async get() method.');
      return '';
    }
    return this.config[key] || '';
  }

  /**
   * Synchronous boolean getter for when environment is already initialized
   */
  public getBooleanSync(key: string): boolean {
    const value = this.getSync(key);
    return value.toLowerCase() === 'true';
  }
}

// Export singleton instance
export const environment = new EnvironmentManager();

// For backwards compatibility, auto-initialize on import
environment.initialize().catch(console.error);
