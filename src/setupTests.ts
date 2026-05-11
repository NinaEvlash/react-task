import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.spyOn(console, 'error').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});

window.addEventListener('error', (event) => {
  event.preventDefault();
});

window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
});

beforeEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.restoreAllMocks();
});
