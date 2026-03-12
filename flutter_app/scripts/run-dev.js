import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../.env.dev');

function loadEnv(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`Error: .env file not found at ${filePath}`);
        process.exit(1);
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const env = {};
    content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            env[match[1]] = match[2].trim();
        }
    });
    return env;
}

const env = loadEnv(envPath);

const requiredVars = [
    'WEB_FLUTTER_INITIAL_API_URL',
    'WEB_BATTLE_SERVER',
    'WEB_FLUTTER_PORT'
];

requiredVars.forEach(v => {
    if (!env[v]) {
        console.warn(`Warning: ${v} is not defined in .env.dev`);
    }
});

const dartDefines = [
    `--dart-define=WEB_FLUTTER_INITIAL_API_URL=${env.WEB_FLUTTER_INITIAL_API_URL}`,
    `--dart-define=WEB_BATTLE_SERVER=${env.WEB_BATTLE_SERVER}`
];

const flutterArgs = [
    'run',
    '-d', 'chrome',
    '--web-port', env.WEB_FLUTTER_PORT || '5001',
    ...dartDefines
];

console.log(`Running: flutter ${flutterArgs.join(' ')}`);

const flutterProcess = spawn('flutter', flutterArgs, {
    stdio: 'inherit',
    shell: true
});

flutterProcess.on('close', (code) => {
    process.exit(code);
});
