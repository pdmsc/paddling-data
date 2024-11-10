const fs = require('fs');
const path = require('path');

// Path to environment.prod.ts
const envFilePath = path.resolve(__dirname, 'src/environments/environment.prod.ts');

// Read the environment.prod.ts file
let envFileContent = fs.readFileSync(envFilePath, 'utf-8');

// Replace placeholders with environment variables
envFileContent = envFileContent.replace(/STRAVA_CLIENT_ID_PLACEHOLDER/g, process.env.STRAVA_CLIENT_ID);
envFileContent = envFileContent.replace(/STRAVA_CLIENT_SECRET_PLACEHOLDER/g, process.env.STRAVA_CLIENT_SECRET);
envFileContent = envFileContent.replace(/REDIRECT_URI/g, process.env.REDIRECT_URI);

// Write the modified content back to environment.prod.ts
fs.writeFileSync(envFilePath, envFileContent);

console.log('Environment variables have been injected into environment.prod.ts');