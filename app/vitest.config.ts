import { defineConfig } from "viteest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["node_modules", "dist", "build", "coverage"],
    coverage: {
      //define o provedor 
      provider: "c8",

      //diretorio onde o relatório de cobertura será gerado
      reportsDirectory: "coverage",
      
      include: ['src/**/*.{ts,tsx}'],

      //arquivos que devem ser ignorados na cobertura
      exclude: [
        "src/main.tsx",
        "src/vitest.config.ts",
        "src/**/*.d.ts",
        "src/**/*.test.{ts,tsx}",
        "src/**/index.{ts,tsx}",
      ],

      //definição dos limites mínimos obrigatórios de cobertura para cada tipo de métrica
      statements: 80,
      branches: 80,

  } 
});
