import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    markdown: ['@uiw/react-md-editor'],
                    calendar: ['react-big-calendar'],
                    emoji: ['emoji-picker-react'],
                },
            },
        },
    },
});
