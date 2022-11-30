import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { FilterEnum, MonthsEnum } from '../shared/filter.enum';
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

  salesPersonDetails$ = new BehaviorSubject<SalesPerson[]>([]);

  public aggregateData(): Observable<{
    soldUnitsPerMonth: MonthlySales[];
    purchasedNumbersByCustomer: PurchasedNumberPerCustomer[];
  }> {
    this.dataProviderService.accessDataFromXlsx().subscribe();
    return combineLatest([
      this.dataProviderService.salesPersonData$,
      this.dataProviderService.ordersData$,
      this.dataProviderService.productsData$,
    ]).pipe(
      map(([salesPersons, orders, products]) => {
        this.salesPersonDetails$.next(
          this.calcSalesPersonDetails(salesPersons, orders, products)
        );
        return {
          soldUnitsPerMonth: this.calcSoldUnitsPerMonth(orders),
          purchasedNumbersByCustomer:
            this.calcPurchasedNumbersByCustomer(orders),
        };
      })
    );
  }

  private calcSalesPersonDetails(
    salesP: SalesPerson[],
    orders: Order[],
    products: Product[]
  ): SalesPerson[] {
    const personData = salesP.map((person: SalesPerson) => {
      const ordersPerPerson = this.filterOrdersPerPerson(orders, person);
      const soldProductNumberPerPerson =
        this.calcSoldProductNumberPerPerson(ordersPerPerson);
      const totalRevenue = this.getTotalRevenue(ordersPerPerson, products);

      return {
        ...person,
        totalItemsSold: soldProductNumberPerPerson,
        totalRevenue,
      };
    });
    this.sortSalesPersonsByRevenue(personData);
    return personData;
  }

  private filterOrdersPerPerson(orders: Order[], person: SalesPerson) {
    return orders.filter(
      (order: Order) => order.salesPersonId === person.personId
    );
  }

  private calcSoldProductNumberPerPerson(ordersPerPerson: any) {
    return ordersPerPerson.reduce(
      (acc: number, cur: Order) => acc + cur.soldProductsNumber,
      0
    );
  }

  private getTotalRevenue(
    ordersPerPerson: Order[],
    products: Product[]
  ): number {
    return ordersPerPerson
      .map((order: Order) => {
        const product = products.find(
          (prod: Product) => prod.productId === order.productId
        );
        return product ? product.unitPrice * order.soldProductsNumber : 0;
      })
      .reduce((acc: number, cur: number) => acc + cur, 0);
  }

  private calcSoldUnitsPerMonth(orders: Order[]): MonthlySales[] {
    const months: MonthsEnum[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    const soldUnitsPerMonth = months.map((month: number) => {
      const totalSalesInMonth = orders
        .filter((order: Order) => {
          if (order.orderDate.getFullYear() !== 2018) return;
          return order.orderDate.getMonth() === month;
        })
        .reduce((acc: number, cur: Order) => acc + cur.soldProductsNumber, 0);

      const monthString = Object.values(MonthsEnum)[month];
      return {
        month: monthString,
        totalSalesInMonth,
      };
    });

    return soldUnitsPerMonth;
  }

  private calcPurchasedNumbersByCustomer(
    orders: Order[]
  ): PurchasedNumberPerCustomer[] {
    const customerList: string[] = [];
    orders.forEach((order: Order) => {
      if (customerList.includes(order.customerAccountName)) return;
      customerList.push(order.customerAccountName);
    });

    return customerList.map((custName: string) => {
      const customerPurchases = this.calcNumberOfCustomerPurchases(
        orders,
        custName
      );
      return {
        customerName: custName,
        numberOfPurchases: customerPurchases,
      };
    });
  }

  private calcNumberOfCustomerPurchases(orders: Order[], custName: string) {
    return orders
      .filter((order: Order) => custName === order.customerAccountName)
      .reduce((acc: number, cur: Order) => acc + cur.soldProductsNumber, 0);
  }

  private sortSalesPersonsByRevenue(personList: SalesPerson[]): SalesPerson[] {
    return personList.sort(
      (a: SalesPerson, b: SalesPerson) => b.totalRevenue - a.totalRevenue
    );
  }

  private sortSalesPersonsByNumberOfItems(
    personList: SalesPerson[]
  ): SalesPerson[] {
    return personList.sort(
      (a: SalesPerson, b: SalesPerson) => b.totalItemsSold - a.totalItemsSold
    );
  }

  public sortSalesPersonsByCondition(filterName: string): void {
    const salesPersonData = this.salesPersonDetails$.getValue();

    if (filterName === FilterEnum.revenue) {
      this.salesPersonDetails$.next(
        this.sortSalesPersonsByRevenue(salesPersonData)
      );
    }

    if (filterName === FilterEnum.numberOfItems) {
      this.salesPersonDetails$.next(
        this.sortSalesPersonsByNumberOfItems(salesPersonData)
      );
    }
  }
}
