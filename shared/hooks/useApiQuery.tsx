"use client";

import {
  useSuspenseQuery,
  type UseSuspenseQueryOptions,
} from "@tanstack/react-query";

import type { ApiResponse } from "../types/global.types";
import { ApiErrorHandler } from "../../lib/axios/Api-Error-Handler";

type UseApiQueryOptions<TData, TQueryKey extends readonly unknown[]> = Omit<
  UseSuspenseQueryOptions<
    ApiResponse<TData>,
    ApiErrorHandler,
    ApiResponse<TData>,
    TQueryKey
  >,
  "select"
>;

export const useApiQuery = <
  TData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
>(
  options: UseApiQueryOptions<TData, TQueryKey>,
) => {
  const response = useSuspenseQuery<
    ApiResponse<TData>,
    ApiErrorHandler,
    ApiResponse<TData>,
    TQueryKey
  >({
    ...options,
    retry: 1,
  });

  return {
    ...response,
    data: response.data?.data,
  };
};
