import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

type ClerkErrorMessageOptions = {
  includeNativeError?: boolean;
};

export function getClerkErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
  options: ClerkErrorMessageOptions = {},
) {
  if (isClerkAPIResponseError(error)) {
    return (
      error.errors[0]?.longMessage ?? error.errors[0]?.message ?? fallback
    );
  }

  if (options.includeNativeError && error instanceof Error) {
    return error.message;
  }

  return fallback;
}
