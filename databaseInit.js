const databaseHelper = require('./utils/databaseHelper.js');

const force =  process.argv.includes('--force') || process.argv.includes('-f');

// Create an inital Database 
databaseHelper.createDefaultInitialDb(force);