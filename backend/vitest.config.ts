import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    exclude: ['node_modules', 'dist'],
    // Garante o SQLite em memoria tambem nas execucoes locais (pnpm test)
    env: {
      NODE_ENV: 'test',
    },
  },
});
