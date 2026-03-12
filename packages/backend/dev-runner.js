import { spawn } from 'child_process';

// Capturamos el argumento (ej: -3000)
const arg = process.argv[2];
const port = arg ? arg.replace('-', '') : null;

if (!port || isNaN(port)) {
    console.error("\nERROR: Debes indicar el puerto. Ejemplo: npm run dev -w backend -- -3000\n");
    process.exit(1);
}

console.log(`Arrancando en el puerto: ${port}`);

const child = spawn('npx', ['tsx', 'watch', 'src/index.ts'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: port }
});

child.on('exit', (code) => process.exit(code));