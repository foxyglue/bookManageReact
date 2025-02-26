import { useCallback, useEffect, useRef, useState } from "react";
import AxiosHelper from "./AxiosHelper";
import {
  FetchDataHelperState,
  FetchDataHelperProps,
} from "../interfaces/fetch-data-helper.interface";
import { CanceledError } from "axios";

export function useFetchData<T>(): {
  data: T | null;
  error: boolean;
  loading: boolean;
  success: boolean;
  errorResponse: Error | null;
  fetchData: (props: FetchDataHelperProps) => Promise<void>;
} {
  const [state, setState] = useState<FetchDataHelperState<T>>({
    data: null,
    error: false,
    loading: false,
    success: false,
    errorResponse: null,
  });

  // Ref to store the current AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleValidationSuccess = (validatedData: T) => {
    setState((prev) => ({
      ...prev,
      data: validatedData,
      loading: false,
      success: true,
      error: false,
      errorResponse: null,
    }));
  };

  const handleValidationError = (validationError: Error) => {
    setState((prev) => ({
      ...prev,
      errorResponse: validationError,
      loading: false,
      error: true,
      success: false,
    }));
  };

  const handleApiError = (error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown API error occurred";

    setState((prev) => ({
      ...prev,
      errorResponse: new Error(errorMessage),
      loading: false,
      error: true,
      success: false,
    }));
  };

  const fetchData = useCallback(
    async ({
      url,
      method = "GET",
      apiUrl,
      schema,
      axiosConfig,
    }: FetchDataHelperProps) => {
      try {
        abortControllerRef.current = new AbortController();
        setState((prev) => ({ ...prev, loading: true, error: false }));
        const baseURL = apiUrl ?? import.meta.env.VITE_API_URL;
        const axiosInstance = new AxiosHelper(baseURL).getAxios();
        const response = await axiosInstance.request({
          url,
          method,
          ...axiosConfig,
          signal: abortControllerRef.current.signal,
        });

        const validationResult = schema.safeParse(response.data);
        if (!validationResult.success) {
          const messages = validationResult.error.errors
            .map((e) => `${e.path} ${e.message}`)
            .join(", ");
          handleValidationError(
            new Error(`Data validation failed: ${messages}`)
          );
          return;
        }
        handleValidationSuccess(validationResult.data);
      } catch (error) {
        if (error instanceof CanceledError) {
          console.log("Request canceled");
          return;
        }
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Request aborted");
          return;
        }
        handleApiError(error);
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { ...state, fetchData };
}
