import axios from 'axios';

const defaultMessages: Readonly<Record<number, string>> = {
  401: 'Please sign in again.',
  403: 'You do not have permission to perform this action.',
  409: 'This action conflicts with an existing record.',
};

export function toApiError(
  error: unknown,
  messages: Readonly<Partial<Record<number, string>>>,
): Error {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  const message =
    status === undefined
      ? undefined
      : (messages[status] ?? defaultMessages[status]);

  return new Error(message ?? 'An error occurred. Please try again later.', {
    cause: error,
  });
}
