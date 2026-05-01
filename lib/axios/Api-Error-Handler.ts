import { ApiResponse, IError } from "../../shared/types/global.types";

export class ApiErrorHandler extends Error {
  response: ApiResponse<null>;

  constructor(response: {
    data: undefined;
    success: boolean;
    message: string;
    error?: IError[];
  }) {
    let errorMessage = response.message;
    if (
      response.error &&
      Array.isArray(response.error) &&
      response.error.length > 0
    ) {
      // Combine all error messages
      errorMessage = response.error.map((e) => e.message).join("; ");
      // Collect all validation errors
      const allValidationErrors = response.error.flatMap(
        (e) => e.validationErrors || [],
      );
      if (allValidationErrors.length > 0) {
        const validationMsgs = allValidationErrors
          .map(
            (v) =>
              `${v.field.name}${v.field.index !== null ? `[${v.field.index}]` : ""}: ${v.message}`,
          )
          .join("; ");
        errorMessage += ` | Validation: ${validationMsgs}`;
      }
    }

    super(errorMessage);
    this.name = "ApiError";
    this.response = response;
  }
}
