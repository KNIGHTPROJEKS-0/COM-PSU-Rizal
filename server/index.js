const { spawn } = require('child_process');
const path = require('path');

// Run Next.js dev from repository root (one level up from this file)
const repoRoot = path.resolve(__dirname, '..');
const nextDev = spawn('npm', ['run', 'dev'], {
  cwd: repoRoot,
  stdio: 'inherit',
});

// Run LiveMeet dev from externals/LiveMeet at repo root
const liveMeetPath = path.resolve(repoRoot, 'externals', 'LiveMeet');
const liveMeetServer = spawn('npm', ['run', 'dev'], {
  cwd: liveMeetPath,
  stdio: 'inherit',
});

// Graceful shutdown
const shutdown = () => {
  console.log('Shutting down servers...');
  try { nextDev.kill(); } catch {}
  try { liveMeetServer.kill(); } catch {}
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Error handling
nextDev.on('error', (error) => {
  console.error('Error starting Next.js server:', error);
});

liveMeetServer.on('error', (error) => {
  console.error('Error starting LiveMeet server:', error);
});