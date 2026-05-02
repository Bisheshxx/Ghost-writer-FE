import { ApiResponse } from "@/shared/types/global.types";
import { AxiosRequestConfig } from "axios";
import { ApiErrorHandler } from "./Api-Error-Handler";
import { api } from "./api";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestOptions<TRequest = Record<string, unknown>> {
  method: HttpMethod;
  url: string;
  data?: TRequest; // for POST/PUT
  params?: Record<string, unknown>;
  config?: AxiosRequestConfig;
}

export async function request<
  TResponse = Record<string, unknown>,
  TRequest = Record<string, unknown>,
>({
  method,
  url,
  data,
  params,
  config,
}: RequestOptions<TRequest>): Promise<ApiResponse<TResponse>> {
  try {
    const response = await api.request<ApiResponse<TResponse>>({
      url,
      method,
      data,
      params,
      headers: {
        ...config?.headers,
      },
    });

    const apiResponse = response?.data as ApiResponse<TResponse> | undefined;
    const isSuccess = apiResponse?.success ?? true;
    if (!isSuccess && apiResponse) {
      throw new ApiErrorHandler(apiResponse as ApiResponse<null>);
    }

    return response.data;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    const apiResponse = error?.response?.data as ApiResponse<null> | undefined;
    const errorMessage =
      apiResponse?.message ||
      (error?.message === "Network Error"
        ? "Could not connect to the server"
        : "An unexpected error occurred");
    throw new ApiErrorHandler({
      success: false,
      message: errorMessage,
      error: apiResponse?.error,
      timestamp: new Date().toISOString(),
    });
  }
}
