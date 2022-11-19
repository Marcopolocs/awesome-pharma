import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  retry,
  Subject,
  switchMap,
  take,
} from 'rxjs';
import * as XLSX from 'xlsx';
import { Order, Product, SalesPerson } from '../shared/xlsx-data.interface';

@Injectable({
  providedIn: 'root',
})
export class DataProviderService {
  dataFile: string = 'assets/DW_Mini_case.xlsx';
  reader: FileReader = new FileReader();

  salesPersonData$ = new Subject<SalesPerson[]>();
  ordersData$ = new Subject<Order[]>();
  productsData$ = new Subject<Product[]>();

  constructor(private http: HttpClient) {}

  accessDataFromXlsx() {
    this.http
      .get(this.dataFile, { responseType: 'blob' })
      // Check these operators later if they have any utility here
      .pipe(
        take(1),
        retry(2),
        switchMap((data) => {
          return this.readXlsxData(data).pipe(
            map((data) => {
              this.salesPersonData$.next(
                this.transformSalesPersonData(data[0] || [])
              );
              this.ordersData$.next(this.transformOrdersData(data[1] || []));
              this.productsData$.next(
                this.transformProductsData(data[2] || [])
              );
            })
          );
        })
      )
      .subscribe();
  }

  readXlsxData(data: Blob): Observable<any> {
    this.reader.readAsBinaryString(data);

    return new Observable((observer) => {
      this.reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, {
          type: 'binary',
          cellDates: true,
        });

        const allSheetsData: any = [];
        wb.SheetNames.forEach((wsname) => {
          const worksheet: XLSX.WorkSheet = wb.Sheets[wsname];
          allSheetsData.push(XLSX.utils.sheet_to_json(worksheet));
        });
        observer.next(allSheetsData);
      };
    });
  }

  transformSalesPersonData(data: any): SalesPerson[] {
    const newSalesPersonArr: SalesPerson[] = data.map((personObject: any) => {
      return {
        personId: personObject.Id,
        personName: personObject.Name,
      };
    });
    return newSalesPersonArr;
  }

  transformOrdersData(data: any): Order[] {
    const newOrdersArr: Order[] = data.map((orderObject: any) => {
      return {
        customerAccountName: orderObject.Account,
        accountType: orderObject['Account type'],
        salesPersonId: orderObject['Salesperson ID'],
        orderStatus: orderObject['Order status'],
        orderDate: orderObject['Order date'],
        productId: orderObject['Product Id'],
        soldProductsNumber: orderObject['Number of product sold'],
      };
    });
    return newOrdersArr;
  }
  transformProductsData(data: any): Product[] {
    const newProductsArr: Product[] = data.map((productObject: any) => {
      return {
        productName: productObject['Product Name'],
        productId: productObject['Product Id'],
        unitPrice: productObject['Unit price'],
        currency: productObject.Currency,
      };
    });
    return newProductsArr;
  }
}
