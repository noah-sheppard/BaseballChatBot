import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load standard env files
  const env = loadEnv(mode, process.cwd(), '');

  // Manually try to load 'key.env' if it exists
  try {
    const keyEnvPath = path.resolve(process.cwd(), 'key.env');
    if (fs.existsSync(keyEnvPath)) {
      const keyEnvContent = fs.readFileSync(keyEnvPath, 'utf-8');
      keyEnvContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["']|["']$/g, '');
          if (key === 'VITE_API_KEY') {
             env.VITE_API_KEY = value;
          }
        }
      });
    }
  } catch (e) {
    console.warn("Could not load key.env", e);
  }

  // Prioritize VITE_API_KEY, then GEMINI_API_KEY, then API_KEY (from system/env), then process.env.API_KEY
  const apiKey = env.VITE_API_KEY || env.GEMINI_API_KEY || env.API_KEY || process.env.API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY so the @google/genai SDK works
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  };
});
