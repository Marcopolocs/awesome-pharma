export interface SalesPerson {
  personId: string;
  personName: string;
  totalItemsSold?: number;
  totalRevenue?: number;
}

export interface Product {
  productName: string;
  productId: number;
  unitPrice: number;
  currency: string;
}

export interface Order {
  customerAccountName: string;
  accountType: string;
  salesPersonId: string;
  orderStatus: string;
  orderDate: Date;
  productId: number;
  soldProductsNumber: number;
}

export interface MonthlySales {
  month: number;
  totalSalesInMonth: number;
}

export interface PurchasedNumberPerCustomer {
  customerName: string;
  numberOfPurchases: number;
}
