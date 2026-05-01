export interface ApiResponse<T> {
  data: T | undefined;
  success: boolean;
  message?: string;
  error?: IError[];
}

export interface IError {
  message: string;
  code: string;
  validationErrors?: IValidationError[];
}

interface IValidationError {
  field: {
    index: number | null;
    name: string;
  };
  message: string;
  code: string;
}
