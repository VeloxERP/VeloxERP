import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Verzeichnisse definieren
const BUILD_DIR = path.resolve(__dirname, '../dist');
const FRONTEND_DIR = path.resolve(__dirname, '../frontend');
const SERVER_DIR = path.resolve(__dirname, '../server');

// 1️⃣ Alte Builds löschen
console.log('🧹 Entferne alten Build...');
fs.rmSync(BUILD_DIR, { recursive: true, force: true });
fs.mkdirSync(BUILD_DIR, { recursive: true });

// 2️⃣ Frontend bauen
console.log('⚡ Baue Frontend...');
execSync('pnpm --filter frontend run build', { stdio: 'inherit' });
fs.cpSync(`${FRONTEND_DIR}/dist`, `${BUILD_DIR}/public`, { recursive: true });

// 3️⃣ Backend kompilieren
console.log('⚡ Baue Backend...');
execSync('pnpm --filter server run build', { stdio: 'inherit' });
fs.cpSync(`${SERVER_DIR}/dist`, `${BUILD_DIR}/server`, { recursive: true });

// 4️⃣ Build abgeschlossen
console.log('✅ Build erfolgreich abgeschlossen!');
