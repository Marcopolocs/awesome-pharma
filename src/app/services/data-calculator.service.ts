import { Injectable } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { Order, Product, SalesPerson } from '../shared/xlsx-data.interface';
import { DataProviderService } from './data-provider.service';

@Injectable({
  providedIn: 'root',
})
export class DataCalculatorService {
  constructor(private dataProviderService: DataProviderService) {}

  dataProcess() {
    this.dataProviderService.accessDataFromXlsx();
    combineLatest([
      this.dataProviderService.salesPersonData$,
      this.dataProviderService.ordersData$,
      this.dataProviderService.productsData$,
    ])
      .pipe(
        map(([salesPersons, orders, products]) => {
          this.salesPersonsDetails(salesPersons, orders, products);
          this.calculateSoldUnitsPerMonth(orders);
          this.allCustomerPurchases(orders);
          console.log(this.allCustomerPurchases(orders));
        })
      )
      .subscribe();
  }

  salesPersonsDetails(
    salesP: SalesPerson[],
    orders: Order[],
    products: Product[]
  ) {
    const personData: SalesPerson[] = [];
    salesP.forEach((person: SalesPerson) => {
      const salesPerPerson = orders.filter(
        (order: any) => order.salesPersonId === person.personId
      );
      let totalItemsSold = 0;
      let totalRevenue = 0;
      salesPerPerson.forEach((sale: any) => {
        totalItemsSold += sale.soldProductsNumber;
        const product = products.find(
          (prod: Product) => prod.productId === sale.productId
        );
        const incomeFromSale = product
          ? product.unitPrice * sale.soldProductsNumber
          : 0;
        totalRevenue += incomeFromSale;
      });
      personData.push({
        ...person,
        totalItemsSold,
        totalRevenue,
      });
    });
    return personData;
  }

  calculateSoldUnitsPerMonth(
    orders: Order[]
  ): { month: number; totalSalesInMonth: number }[] {
    const soldUnitsPerMonth: { month: number; totalSalesInMonth: number }[] =
      [];
    const months: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    months.forEach((month: number) => {
      const totalSalesInMonth = orders
        .filter((order: Order) => {
          if (order.orderDate.getFullYear() !== 2018) return;
          return order.orderDate.getMonth() === month;
        })
        .reduce((acc: number, cur: Order) => acc + cur.soldProductsNumber, 0);

      soldUnitsPerMonth.push({
        month,
        totalSalesInMonth,
      });
    });
    return soldUnitsPerMonth;
  }

  allCustomerPurchases(
    orders: Order[]
  ): { customerName: string; numberOfPurchases: number }[] {
    const customerList: string[] = [];
    orders.filter((order: Order) => {
      if (customerList.includes(order.customerAccountName)) return;
      return customerList.push(order.customerAccountName);
    });

    const allCustomerPurchases: {
      customerName: string;
      numberOfPurchases: number;
    }[] = [];
    customerList.forEach((custName: string) => {
      const customerPurchases = orders
        .filter((order: Order) => custName === order.customerAccountName)
        .reduce((acc: number, cur: Order) => acc + cur.soldProductsNumber, 0);
      allCustomerPurchases.push({
        customerName: custName,
        numberOfPurchases: customerPurchases,
      });
    });
    return allCustomerPurchases;
  }
}
