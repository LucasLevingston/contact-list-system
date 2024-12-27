import { config } from 'dotenv'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    maxConcurrency: 1,
    globals: true,
    environment: 'node',
    clearMocks: true,
    env: {
      ...config({ path: './.testing.env' }).parsed,
    },
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/database.ts',
        'src/swagger.ts',
        'src/server.ts',
      ],
      all: true,
    },
  },
})
