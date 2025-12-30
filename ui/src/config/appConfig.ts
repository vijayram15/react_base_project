// src/config/appConfig.ts
export const APP_SETTINGS = {
  CACHING_ENABLED: true,
  DEFAULT_STALE_TIME: 1000 * 60 * 10, // 10 minutes
  SECURITY: {
    XSS_PROTECTION: true,
    CSRF_HEADER: 'X-XSRF-TOKEN',
  },
  UI: {
    SIDEBAR_DEFAULT_OPEN: true,
    ACCORDION_AUTO_CLOSE: false,
  }
};
