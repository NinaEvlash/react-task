import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type ApiError =
  | FetchBaseQueryError
  | {
      message?: string;
    }
  | undefined;

const HTTP_NOT_FOUND = 404;
const HTTP_SERVER_ERROR = 500;

export function getErrorMessage(error: ApiError): string {
  if (!error) {
    return '';
  }

  if ('status' in error) {
    const status = error.status;

    if (status === HTTP_NOT_FOUND || status === 'PARSING_ERROR') {
      return 'Pokémon not found';
    }

    if (status === 'FETCH_ERROR') {
      return 'Network error. Please check your connection.';
    }

    if (status === 'TIMEOUT_ERROR') {
      return 'Request timeout. Please try again later.';
    }

    if (typeof status === 'number' && status >= HTTP_SERVER_ERROR) {
      return 'Server error. Please try again later.';
    }

    if ('data' in error && typeof error.data === 'string' && error.data.trim()) {
      return error.data;
    }

    if ('error' in error && typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    return 'Something went wrong';
  }

  if ('message' in error && error.message) {
    return error.message;
  }

  return 'Something went wrong';
}
