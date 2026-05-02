export interface ApiResponse<T = any> {
  data?: T;
  success: boolean;
  message?: string;
  error?: IError;
  timestamp?: string;
}

export interface IError {
  message: string;
  code: string;
  validationErrors?: IValidationError[];
}

export interface IValidationError {
  field: {
    index?: number | null;
    name: string;
  };
  message: string;
  code: string;
}
