#!/usr/bin/env node

const { execSync } = require('child_process');

const port = process.argv[2];

if (!port) {
  console.error('Usage: node scripts/kill-port.js <port>');
  process.exit(1);
}

const isWindows = process.platform === 'win32';

try {
  if (isWindows) {
    const output = execSync(`netstat -ano | findstr :${port}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    const pids = Array.from(
      new Set(
        output
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line.includes('LISTENING'))
          .map((line) => line.split(/\s+/).pop())
          .filter(Boolean),
      ),
    );

    if (pids.length === 0) {
      console.log(`No LISTENING process found on port ${port}`);
      process.exit(0);
    }

    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
        console.log(`Killed process ${pid} on port ${port}`);
      } catch {
        console.warn(`Could not kill process ${pid} on port ${port}`);
      }
    }

    process.exit(0);
  }

  const output = execSync(`lsof -ti tcp:${port}`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();

  if (!output) {
    console.log(`No process found on port ${port}`);
    process.exit(0);
  }

  const pids = output.split(/\r?\n/).filter(Boolean);
  for (const pid of pids) {
    try {
      execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
      console.log(`Killed process ${pid} on port ${port}`);
    } catch {
      console.warn(`Could not kill process ${pid} on port ${port}`);
    }
  }
} catch {
  console.log(`No process found on port ${port}`);
}
