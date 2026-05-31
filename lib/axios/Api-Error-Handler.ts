import {
  ApiResponse,
  IError,
} from "../../shared/types/global.types";

/**
 * API Error Handler for mapping server errors to client-side exceptions
 * Handles both general errors and field-level validation errors
 */
export class ApiErrorHandler extends Error {
  public response: ApiResponse<null>;
  public error?: IError;
  public validationErrors?: unknown[];

  constructor(response: ApiResponse<null>) {
    let errorMessage = response.message || "An error occurred";

    // Handle the error object
    if (response.error) {
      errorMessage = response.error.message;
    }

    super(errorMessage);
    this.name = "ApiError";
    this.response = response;

    // Set error and validation errors after super()
    if (response.error) {
      this.error = response.error;
      if (
        response.error.validationErrors &&
        response.error.validationErrors.length > 0
      ) {
        this.validationErrors = response.error.validationErrors;
      }
    }
    this.name = "ApiError";
    this.response = response;
  }

  /**
   * Get validation errors grouped by field name for form error mapping
   * Useful for react-hook-form setError() calls
   *
   * @example
   * const errorsByField = error.getValidationErrorsByField();
   * // { endDate: ["End date cannot be earlier than start date"] }
   * errorsByField['endDate'].forEach(msg => {
   *   setError('endDate', { message: msg });
   * });
   */
  public getValidationErrorsByField(): Record<string, string[]> {
    const errorsByField: Record<string, string[]> = {};

    if (this.validationErrors) {
      this.validationErrors.forEach((validationError) => {
        if (!isFieldValidationError(validationError)) return;

        const fieldName = validationError.field.name;
        if (!errorsByField[fieldName]) {
          errorsByField[fieldName] = [];
        }
        errorsByField[fieldName].push(validationError.message);
      });
    }

    return errorsByField;
  }

  /**
   * Get all validation errors as a flat array
   */
  public getAllValidationErrors(): unknown[] {
    return this.validationErrors || [];
  }
}

function isFieldValidationError(
  validationError: unknown,
): validationError is { field: { name: string }; message: string } {
  if (!validationError || typeof validationError !== "object") return false;

  const error = validationError as {
    field?: { name?: unknown };
    message?: unknown;
  };

  return (
    typeof error.field?.name === "string" &&
    typeof error.message === "string"
  );
}
