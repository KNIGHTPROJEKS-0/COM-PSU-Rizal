const { spawn } = require('child_process');
const path = require('path');

// Start Next.js development server
const nextDev = spawn('npm', ['run', 'dev'], {
  cwd: path.resolve(__dirname),
  stdio: 'inherit'
});

// Start LiveMeet server
const liveMeetPath = path.resolve(__dirname, 'externals', 'LiveMeet');
const liveMeetServer = spawn('npm', ['run', 'dev'], {
  cwd: liveMeetPath,
  stdio: 'inherit'
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  nextDev.kill();
  liveMeetServer.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down servers...');
  nextDev.kill();
  liveMeetServer.kill();
  process.exit(0);
});

// Handle errors
nextDev.on('error', (error) => {
  console.error('Error starting Next.js server:', error);
});

liveMeetServer.on('error', (error) => {
  console.error('Error starting LiveMeet server:', error);
});