export type CommonResponse<T> = {
  issuccess: boolean;
  statusCode: number;
  message: string;
  data: T;
};
