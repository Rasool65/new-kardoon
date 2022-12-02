export interface ICountryDivisionResultModel {
  id: 1;
  persianTitle: string;
  englishTitle?: string;
  countryDivisionType?: string;
  centroid?: number;
  polygon?: string;
  image?: string;
  imageFileName?: string;
  shortDescription?: string;
  description?: string;
  parentId?: number;
  parentName?: string;
  parent?: IParentModel;
}

interface IParentModel {
  id?: number;
  persianTitle?: string;
  englishTitle?: string;
  countryDivisionType?: string;
  centroid?: string;
  polygon?: string;
  image?: string;
  imageFileName?: string;
  shortDescription?: string;
  description?: string;
  parentId?: number;
  parentName?: string;
  parent?: number;
}
