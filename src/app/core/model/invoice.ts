export interface IInvoiceQuery {
  startDate?: string | null;
  endDate?: string | null;
  merchantId?: string | null;
  documentNumber?: string | null;
  invNo?: string | null;
  customerTax?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  status?: number | null;
  note?: string | null;
  paymentType?: string | null;
  page: number;
  size: number;
}

export interface IInvoice {
  RefId: string;
  MerchantId: string;
  MerchantName: string;
  DocumentDate: string;
  DocumentNumber: string;
  CustomerName: string;
  CustomerCode: string;
  CustomerPhone: string;
  CustomerIdNumber: string;
  CustomerEmployeeName: string;
  CustomerAddress: string;
  CustomerTax: string;
  ContractNo: string;
  TypeService: string;
  TotalSaleAmountOC: number;
  TotalDiscountAmountOC: number;
  TotalAmountWithoutVATOC: number;
  TotalAmountOC: number;
  RevenueAmount: number;
  Status: number;
  Request: string;
  Notes: string;
  InvoiceNumber: string;
  InvoiceDate: string;
  TaxCode: string;
}

export interface IMerchantInvoice {
  Notes: string;
  TaxCode: string;
  Address: string;
  PhoneNumber: string;
  Code: string;
  Email: string;
}

export interface IBuyerInvoice {
  BuyerCode: string;
  BuyerLegalName: string;
  BuyerTaxCode: string;
  BuyerAddress: string;
  BuyerFullName: string;
  BuyerPhoneNumber: string;
  BuyerEmail: string;
  BuyerBankAccount: string | null;
  BuyerBankName: string | null;
  BuyerIdNumber: string;
}

export interface IInvoiceItem {
  ItemType: number;
  SortOrder: number;
  LineNumber: number;
  ItemCode: string;
  ItemName: string;
  UnitName: string;
  Quantity: number;
  UnitPrice: number;
  AmountOC: number;
  Amount: number;
  DiscountRate: number;
  DiscountAmountOC: number;
  DiscountAmount: number;
  AmountWithoutVATOC: number;
  AmountWithoutVAT: number;
  VatRateName: string;
  VatAmountOC: number;
  VatAmount: number;
}

export interface ITaxRate {
  Id: string;
  InvoiceId: string;
  VatRateName: string;
  AmountWithoutVATOC: number;
  VATAmountOC: number;
}

export interface IInvoiceDetail {
  RefId: string;
  IsHaveInoiveFile: boolean;
  UrlFileInvoice: string;
  MerchantInvoice: IMerchantInvoice;
  BuyerInvoice: IBuyerInvoice;
  ListInvoiceItems: IInvoiceItem[];
  ListTaxRates: ITaxRate[];
  InvoiceNumber?: string;
  InvoiceDate?: string;
  AmountOC?: string;
}
