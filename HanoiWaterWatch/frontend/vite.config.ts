import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';

export default defineConfig(({mode}) => {
  const value = loadEnv(mode, '.', 'VITE_').VITE_DEMO_MODE;
  if (value === 'true' && mode !== 'demo') {
    throw new Error('VITE_DEMO_MODE=true requires explicit local --mode demo. Production cannot include demo data.');
  }
  const proxy = { '/api': 'http://127.0.0.1:8000' };
  return {
    plugins: [react()],
    server: {proxy},
    preview: {proxy},
    build: {outDir:mode === 'demo' ? 'dist-demo' : 'dist'},
  };
});
