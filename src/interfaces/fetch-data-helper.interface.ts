import { AxiosRequestConfig } from "axios";
import { ZodSchema } from "zod";

export interface FetchDataHelperState<T> {
  data: T | null;
  errorResponse: Error | null;
  error: boolean;
  loading: boolean;
  success: boolean;
}

export interface FetchDataHelperProps {
  url: string;
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  schema: ZodSchema;
  apiUrl?: string;
  axiosConfig?: AxiosRequestConfig;
}
