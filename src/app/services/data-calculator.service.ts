import { Injectable } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import {
  MonthlySales,
  Order,
  Product,
  PurchasedNumberPerCustomer,
  SalesPerson,
} from '../shared/xlsx-data.interface';
import { DataProviderService } from './data-provider.service';

@Injectable({
  providedIn: 'root',
})
export class DataCalculatorService {
  constructor(private dataProviderService: DataProviderService) {}

  aggregateData() {
    this.dataProviderService.accessDataFromXlsx().subscribe();
    return combineLatest([
      this.dataProviderService.salesPersonData$,
      this.dataProviderService.ordersData$,
      this.dataProviderService.productsData$,
    ]).pipe(
      map(([salesPersons, orders, products]) => {
        console.log(
          this.calcSalesPersonDetails(salesPersons, orders, products)
        );
        console.log(this.calcSoldUnitsPerMonth(orders));
        this.calcPurchasedProductsByCustomer(orders);
      })
    );
  }

  calcSalesPersonDetails(
    salesP: SalesPerson[],
    orders: Order[],
    products: Product[]
  ): SalesPerson[] {
    const personData = salesP.map((person: SalesPerson) => {
      const salesPerPerson = orders.filter(
        (order: any) => order.salesPersonId === person.personId
      );

      const soldProductNumberPerPerson = salesPerPerson.reduce(
        (acc: number, cur: Order) => acc + cur.soldProductsNumber,
        0
      );

      const totalRevenue = salesPerPerson
        .map((sale: Order) => {
          const product = products.find(
            (prod: Product) => prod.productId === sale.productId
          );
          return product ? product.unitPrice * sale.soldProductsNumber : 0;
        })
        .reduce((acc: number, cur: number) => acc + cur, 0);

      return {
        ...person,
        totalItemsSold: soldProductNumberPerPerson,
        totalRevenue,
      };
    });
    return personData;
  }

  calcSoldUnitsPerMonth(orders: Order[]): MonthlySales[] {
    const months: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    const soldUnitsPerMonth: MonthlySales[] = months.map((month: number) => {
      const totalSalesInMonth = orders
        .filter((order: Order) => {
          if (order.orderDate.getFullYear() !== 2018) return;
          return order.orderDate.getMonth() === month;
        })
        .reduce((acc: number, cur: Order) => acc + cur.soldProductsNumber, 0);
      return {
        month,
        totalSalesInMonth,
      };
    });
    return soldUnitsPerMonth;
  }

  calcPurchasedProductsByCustomer(
    orders: Order[]
  ): PurchasedNumberPerCustomer[] {
    const customerList: string[] = [];
    orders.forEach((order: Order) => {
      if (customerList.includes(order.customerAccountName)) return;
      customerList.push(order.customerAccountName);
    });

    const allCustomerPurchases: PurchasedNumberPerCustomer[] = customerList.map(
      (custName: string) => {
        const customerPurchases = orders
          .filter((order: Order) => custName === order.customerAccountName)
          .reduce((acc: number, cur: Order) => acc + cur.soldProductsNumber, 0);
        return {
          customerName: custName,
          numberOfPurchases: customerPurchases,
        };
      }
    );
    return allCustomerPurchases;
  }
}
