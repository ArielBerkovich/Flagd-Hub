export const ENV_KEYS = {
  FLAGD_HUB_API: 'flagd_hub_api',
  IS_SECURED: 'is_secured',
} as const;

export const DEFAULT_LOCAL_CONFIG = {
  [ENV_KEYS.FLAGD_HUB_API]: 'http://localhost:8090',
  [ENV_KEYS.IS_SECURED]: 'true',
} as const;
