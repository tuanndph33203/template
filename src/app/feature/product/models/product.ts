export interface IProductDetail {
  Id: string;
  Name: string;
  Code: string;
  UnitName: string;
  TimeUsed: number;
  Price: number;
  VatRate: number;
  IsDelete: boolean;
  UrlImage: string | null;
}
export interface IProductPayload {
  Id: string;
  MerchantIds: string[];
  Name: string;
  Code: string;
  UnitName: string;
  TimeUsed: number;
  Price: number;
  VatRate: number;
  UrlImage: string;
}
export interface IProductCart extends IProductDetail {
  qty: number;
}
