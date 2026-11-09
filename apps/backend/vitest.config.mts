import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    globals: true, // Чтобы не импортировать describe/it в каждом файле
    environment: 'node',
    include: ['src/**/*.spec.ts'], // Ищем тесты в папке src
    root: './',
  },
  plugins: [
    // Этот плагин критически важен для работы декораторов NestJS
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
