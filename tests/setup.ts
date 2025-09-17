import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

const ensureSupabaseEnv = () => {
  if (!process.env.VITE_SUPABASE_URL) {
    process.env.VITE_SUPABASE_URL = 'http://localhost:54321';
  }

  if (!process.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY = 'supabase-test-key';
  }

  vi.stubEnv('VITE_SUPABASE_URL', process.env.VITE_SUPABASE_URL);
  vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', process.env.VITE_SUPABASE_PUBLISHABLE_KEY);
};

ensureSupabaseEnv();

beforeEach(() => {
  ensureSupabaseEnv();
});

afterEach(() => {
  cleanup();
});
