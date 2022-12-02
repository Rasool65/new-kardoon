export interface IPageListOutputResult<T extends object> {
  data: T;
  message: string;
  statusCode: string;
  isSuccess: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalSize: number;
}
