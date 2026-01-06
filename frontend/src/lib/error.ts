/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Extracts a user-friendly error message from various error formats
 * @param error - The error object (can be from API, network, or general errors)
 * @param fallbackMessage - Default message if no error message is found
 * @returns A user-friendly error message string
 */
export const getErrorMessage = (
  error: any,
  fallbackMessage: string = 'An unexpected error occurred.',
): string => {
  // Handle null/undefined
  if (!error) {
    return fallbackMessage;
  }

  // Check for common API error structures
  if (error?.data?.message) {
    return error.data.message;
  }

  // Check for direct message property
  if (error?.message) {
    return error.message;
  }

  // Check for error property
  if (error?.error) {
    if (typeof error.error === 'string') {
      return error.error;
    }
    if (error.error.message) {
      return error.error.message;
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Fallback
  return fallbackMessage;
};
