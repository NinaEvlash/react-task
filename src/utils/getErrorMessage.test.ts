import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { describe, it, expect } from 'vitest';
import { getErrorMessage } from './getErrorMessage';

describe('getErrorMessage', () => {
  it('returns empty string when error is undefined', () => {
    expect(getErrorMessage(undefined)).toBe('');
  });

  it('returns Pokémon not found for 404 error', () => {
    const error: FetchBaseQueryError = { status: 404, data: 'Not found' };

    expect(getErrorMessage(error)).toBe('Pokémon not found');
  });

  it('returns server error for 500+ status', () => {
    const error: FetchBaseQueryError = { status: 500, data: 'Server error' };

    expect(getErrorMessage(error)).toBe('Server error. Please try again later.');
  });

  it('returns network error for FETCH_ERROR', () => {
    const error: FetchBaseQueryError = {
      status: 'FETCH_ERROR',
      error: 'Failed to connect',
    };

    expect(getErrorMessage(error)).toBe('Network error. Please check your connection.');
  });

  it('returns Pokémon not found for PARSING_ERROR', () => {
    const error: FetchBaseQueryError = {
      status: 'PARSING_ERROR',
      originalStatus: 200,
      data: 'Invalid JSON',
      error: 'Invalid JSON',
    };

    expect(getErrorMessage(error)).toBe('Pokémon not found');
  });

  it('returns timeout message for TIMEOUT_ERROR', () => {
    const error: FetchBaseQueryError = {
      status: 'TIMEOUT_ERROR',
      error: 'Request timed out',
    };

    expect(getErrorMessage(error)).toBe('Request timeout. Please try again later.');
  });

  it('returns data string when available', () => {
    const error: FetchBaseQueryError = { status: 400, data: 'Bad request' };

    expect(getErrorMessage(error)).toBe('Bad request');
  });

  it('returns error field when present', () => {
    const error: FetchBaseQueryError = {
      status: 'CUSTOM_ERROR',
      error: 'Bad request details',
      data: undefined,
    };

    expect(getErrorMessage(error)).toBe('Bad request details');
  });

  it('returns message for normal error object', () => {
    expect(getErrorMessage({ message: 'Custom error' })).toBe('Custom error');
  });

  it('returns fallback message for unknown error', () => {
    expect(getErrorMessage({})).toBe('Something went wrong');
  });
});
