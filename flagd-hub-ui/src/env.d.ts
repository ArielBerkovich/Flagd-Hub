// src/env.d.ts
export {};

declare global {
  interface Window {
    env: {
      REACT_APP_SERVER_URL?: string;
    };
  }
}

