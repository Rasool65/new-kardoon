export interface IProductsResultModel {
  id: number;
  title?: string;
  name?: string;
  description?: string;
  logoUrl?: string;
  backgroundImageUrl?: string;
  sortOrder?: number;
  subProducts?: IProductsResultModel[];
}
