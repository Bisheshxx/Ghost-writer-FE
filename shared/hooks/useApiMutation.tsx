"use client";

import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { ApiResponse } from "../types/global.types";
import { toast } from "sonner";
import { ApiErrorHandler } from "../../lib/axios/Api-Error-Handler";

type MutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<ApiResponse<TData>, ApiErrorHandler, TVariables>,
  "mutationFn"
>;

type IOptions<T, F> = {
  invalidateQueries?: string[];
  showToast?: boolean;
} & MutationOptions<T, F>;

export const useApiMutation = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options?: IOptions<TData, TVariables>,
) => {
  const queryClient = useQueryClient();
  const {
    onError: userOnError,
    onSuccess: userOnSuccess,
    ...restOptions
  } = options || {};
  const showToast = options?.showToast ?? true;

  return useMutation<ApiResponse<TData>, ApiErrorHandler, TVariables>({
    mutationFn,
    onError: (error, variables, onMutateResult, context) => {
      if (showToast) {
        toast.error(error?.response?.message || "Something went wrong", {
          description:
            error?.response?.message ||
            "Please try again or try refreshing the page",
        });
      }

      if (typeof userOnError === "function") {
        userOnError(error, variables, onMutateResult, context);
      }
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      toast.success(data.message);
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        );
      }
      if (typeof userOnSuccess === "function") {
        userOnSuccess(data, variables, onMutateResult, context);
      }
    },
    ...restOptions,
  });
};
