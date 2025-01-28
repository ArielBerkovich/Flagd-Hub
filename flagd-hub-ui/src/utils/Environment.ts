// src/utils/Environment.ts

export default class Environment {
    private static config: { [key: string]: any } = {};
    private static isInitialized: boolean = false;

    // Default configuration for local environment
    private static localConfig = {
        "flagd_hub_api": "http://localhost:8090",
        "is_secured": "true"
    };

    // Method to initialize the environment by loading it from /environment endpoint or using default for local
    private static loadEnvironmentFromServer(): void {
        try {
            if (process.env.NODE_ENV === 'development') {
                // If running locally, use the default config
                this.config = { ...this.localConfig };
                this.isInitialized = true;
                console.log('Using local config for development');
                return;
            }

            // If not running locally, fetch environment from the server
            const xhr = new XMLHttpRequest();
            xhr.open('GET', './environment', false); // Synchronous request (blocking)
            xhr.send();

            if (xhr.status === 200) {
                this.config = JSON.parse(xhr.responseText);
                this.isInitialized = true;
            } else {
                console.error(`Failed to fetch environment: ${xhr.statusText}`);
            }
        } catch (error) {
            console.error('Failed to load environment configuration:', error);
        }
    }

    // Method to initialize environment if it's not already loaded
    public static initialize(): void {
        if (!this.isInitialized) {
            this.loadEnvironmentFromServer();
        }
    }

    // Method to get a specific environment variable (ensures the environment is loaded first)
    public static get(key: string): any {
        if (!this.isInitialized) {
            this.initialize(); // Load environment if not already loaded
        }
        if (!(key in this.config)) {
            console.warn(`Environment variable "${key}" is not set.`);
        }
        return this.config[key];
    }

    // Method to get all environment variables (ensures the environment is loaded first)
    public static getAll(): { [key: string]: any } {
        if (!this.isInitialized) {
            this.initialize(); // Load environment if not already loaded
        }
        return this.config;
    }
}
