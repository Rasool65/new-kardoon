export interface IOutputResult<T extends object> {
  data: T;
  isSuccess: boolean;
  statusCode: string;
  message: string;
}
