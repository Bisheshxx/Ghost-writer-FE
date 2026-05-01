import { ApiResponse } from "@/shared/types/global.types";
import { AxiosRequestConfig } from "axios";
import { ApiErrorHandler } from "./Api-Error-Handler";
import { api } from "./api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

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
    const isSuccess = apiResponse?.success ?? apiResponse?.success;
    if (isSuccess === false) {
      throw new ApiErrorHandler({
        success: false,
        data: undefined,
        message: apiResponse?.message || "An unexpected error occurred",
        error: apiResponse?.error ? apiResponse?.error : undefined,
      });
    }

    return response.data;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    const apiResponse = error?.data;
    const errorMessage =
      apiResponse?.message ||
      apiResponse?.Message ||
      (error?.message === "Network Error"
        ? "Could not connect to the server"
        : "An unexpected error occurred");
    throw new ApiErrorHandler({
      success: false,
      data: undefined,
      message: errorMessage,
      error: apiResponse?.error ? apiResponse?.error : undefined,
    });
  }
}
