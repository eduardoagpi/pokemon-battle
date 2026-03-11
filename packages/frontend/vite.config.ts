import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {

    console.log("HOLA MUNDO " + mode)

    // __dirname apunta a packages/frontend
    // ../.. sube hasta la raíz del repo
    const envDir = path.resolve(__dirname, '../../')

    const env = loadEnv(mode, envDir, '')

    console.log('Variables cargadas:', env)

    return {
        envDir,
        plugins: [
            tailwindcss(),
            react()
        ],
        server: {
            port: Number(env.VITE_PORT)
        }
    }
})