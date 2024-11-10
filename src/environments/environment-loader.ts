export function loadEnvironment(): any {
if (environment.production) {
    return {
    clientId: process.env['STRAVA_CLIENT_ID'] || '',
    clientSecret: process.env['STRAVA_CLIENT_SECRET'] || '',
    };
} else {
    try {
    // Dynamically import `local-env.json` only in local dev
    return import('./local-env.json').then((localEnv) => localEnv || {});
    } catch (error) {
    console.warn('local-env.json not found, using empty environment');
    return {};
    }
}
}