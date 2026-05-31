export interface ApiResponse<T = any, TMeta = unknown> {
  data?: T;
  meta?: TMeta;
  success: boolean;
  message?: string;
  error?: IError;
  timestamp?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface IError {
  message: string;
  code?: string;
  validationErrors?: unknown[];
}

export interface IValidationError {
  field: {
    index?: number | null;
    name: string;
  };
  message: string;
  code: string;
}
