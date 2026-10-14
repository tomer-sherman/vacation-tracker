import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {

        // Listen on 0.0.0.0 and not only on 127.0.0.1.
        // Inside a container, "localhost" means the container itself, so docker's
        // port mapping (80:5173) has nothing to forward to unless we listen on all interfaces:
        host: true,

        // The port docker maps to - keep it fixed so vite doesn't jump to 5174:
        port: 5173,

        open: true
    }
})
