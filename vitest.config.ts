// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 15000,
    environment: 'happy-dom', // Use happy-dom to simulate the browser environment,
  },
})
