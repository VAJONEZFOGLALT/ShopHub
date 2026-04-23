#!/usr/bin/env node

console.log('🚀 Setting up project...\n');

const { execSync } = require('child_process');
const path = require('path');

const run = (command, cwd) => {
  console.log(`📦 Running: ${command}`);
  try {
    execSync(command, { 
      stdio: 'inherit', 
      cwd: cwd || process.cwd(),
      shell: true 
    });
  } catch (error) {
    console.error(`❌ Error running: ${command}`);
    process.exit(1);
  }
};

console.log('1️⃣  Installing backend dependencies...');
run('npm install', path.join(__dirname, 'backend'));

console.log('\n2️⃣  Installing frontend dependencies...');
run('npm install', path.join(__dirname, 'frontend'));

console.log('\n3️⃣  Setting up database...');
run('npm exec prisma generate', path.join(__dirname, 'backend'));
run('npm exec prisma migrate deploy', path.join(__dirname, 'backend'));
console.log('ℹ️  Seed was intentionally skipped (existing TiDB data is preserved).');

console.log('\n✅ Setup complete!');
console.log('\n📝 Next steps:');
console.log('   npm run dev     - Start both backend and frontend');
console.log('   npm run dev:backend - Start only backend (port 3000)');
console.log('   npm run dev:frontend - Start only frontend (port 5173)');
console.log('\n🌐 Open http://localhost:5173 in your browser\n');
