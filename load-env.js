// load-env.js
const dotenv = require('dotenv');  // Load dotenv to read .env file
const fs = require('fs');          // File system module to write files
const path = require('path');      // Path module to ensure correct paths

// Load environment variables from .env
const envConfig = dotenv.config().parsed;

// Convert environment variables into a JSON string
const envConfigJSON = JSON.stringify(envConfig, null, 2); // Formatting for readability

// Define path for Angular to access the JSON file
const outputPath = path.resolve(__dirname, 'src/environments/local-env.json');

// Write JSON file with the environment variables to the specified location
fs.writeFileSync(outputPath, envConfigJSON);

console.log(`Environment variables loaded into ${outputPath}`);