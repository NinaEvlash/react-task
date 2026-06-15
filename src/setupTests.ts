import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.spyOn(console, 'error').mockImplementation(() => {
  // intentionally never resolves to test loading state
});
vi.spyOn(console, 'warn').mockImplementation(() => {
  // intentionally never resolves to test loading state
});

globalThis.addEventListener('error', (event) => {
  event.preventDefault();
});

globalThis.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
});

beforeEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.restoreAllMocks();
});
