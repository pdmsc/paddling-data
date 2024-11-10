// src/environments/environment.ts
import * as localEnv from './local-env.json';

export const environment = {
  production: false,
  clientId: (localEnv as any).STRAVA_CLIENT_ID || '',
  clientSecret: (localEnv as any).STRAVA_CLIENT_SECRET || '',
};