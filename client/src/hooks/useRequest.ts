import { useState, useCallback, useRef, useEffect } from 'react';
import { createCancelableRequest } from '@/services/api';

type CancelableRequest = ReturnType<typeof createCancelableRequest>;

export const useRequest = () => {
  const requestRef = useRef<CancelableRequest>();
  const [loading, setLoading] = useState(false);
  const cancel = useCallback(() => requestRef.current?.cancel(), []);

  useEffect(() => cancel, []);

  return {
    loading,
    cancel,
    submit: useCallback(async <T>(...args: Parameters<CancelableRequest>) => {
      try {
        setLoading(true);

        requestRef.current = createCancelableRequest();

        const response = await requestRef.current<T>(...args);

        return response;
      } finally {
        setLoading(false);
      }
    }, []),
  };
};
