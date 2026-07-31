export const API_PATHS = {
  BASE: '/flagd-hub',
  LOGIN: '/login',
  FLAGS: '/flags',
  CHANGELOGS: '/flags/changelogs',
  FLAG_CHANGELOG: (key: string) => `/flags/${key}/changelog`,
  FLAG_BY_KEY: (key: string) => `/flags/${key}`,
} as const;
