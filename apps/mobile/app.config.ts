import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'AeroFresh',
  slug: 'aerofresh',
  version: '1.0.0',
  main: 'App.tsx',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#3B82F6'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.aerofresh.app'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#3B82F6'
    },
    package: 'com.aerofresh.app'
  },
  web: {
    favicon: './assets/favicon.svg'
  },
            extra: {
                      // API Configuration - Single source of truth
                      API_BASE_URL: (typeof process !== 'undefined' && process.env?.API_BASE_URL) || 'https://aerofresh-api-staging.ignasgru.workers.dev',
              API_TIMEOUT: (typeof process !== 'undefined' && process.env?.API_TIMEOUT) || '5000',
              API_RETRY_COUNT: (typeof process !== 'undefined' && process.env?.API_RETRY_COUNT) || '3',
              
              // Feature flags
              ENABLE_DEMO_MODE: (typeof process !== 'undefined' && process.env?.ENABLE_DEMO_MODE) !== 'false',
              ENABLE_ANALYTICS: (typeof process !== 'undefined' && process.env?.ENABLE_ANALYTICS) !== 'false',
              
              // Development flags
              DEBUG_MODE: (typeof process !== 'undefined' && process.env?.NODE_ENV) === 'development',
              
                      // Production API URL (for deployment)
                      PROD_API_URL: 'https://aerofresh-api-staging.ignasgru.workers.dev',
            }
});
