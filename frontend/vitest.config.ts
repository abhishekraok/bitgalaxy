import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/tests/setup.ts'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/tests/setup.ts',
            ],
            lines: 80,
            functions: 80,
            branches: 80,
            statements: 80
        },
    },
}) 