import { ApiError } from '@/utils/ApiError';

export const baseUrl = '/api';

export const createCancelableRequest = () => {
  const abortController = new AbortController();
  const request = <T>(input: RequestInfo, init?: RequestInit): Promise<T> =>
    fetch(input, {
      ...init,
      headers: { 'content-type': 'application/json', ...init?.headers },
      signal: abortController.signal,
    })
      .then(async (response) => {
        const responseData = response.headers.get('content-type')?.includes('application/json')
          ? await response.json()
          : await response.text();

        if (response.status >= 400) {
          throw new ApiError(responseData);
        }

        return responseData;
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          throw err;
        }

        return undefined;
      });

  request.cancel = () => abortController.abort();

  return request;
};
