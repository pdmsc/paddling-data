import localEnv from './local-env.json';

export const environment = {
  production: false,
  clientId: localEnv.STRAVA_CLIENT_ID || '',
  clientSecret: localEnv.STRAVA_CLIENT_SECRET || '',
};