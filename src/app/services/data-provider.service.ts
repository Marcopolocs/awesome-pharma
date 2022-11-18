import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, retry, switchMap, take } from 'rxjs';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class DataProviderService {
  dataFile: string = 'assets/DW_Mini_case.xlsx';
  reader: FileReader = new FileReader();

  // Original idea was to create a nested array which includes all the data I want and then work with that
  // but instead I decided to create to every array their own interface and BehaviorSubject

  salesPersonData$ = new BehaviorSubject<any>([]);
  ordersData$ = new BehaviorSubject<any>([]);
  productsData$ = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient) {}

  accessDataFromXlsx() {
    return (
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
                  this.transformSalesPersonData(data[0])
                );
                this.ordersData$.next(this.transformOrdersData(data[1]));
                this.productsData$.next(this.transformProductsData(data[2]));
              })
            );
          })
        )
    );
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

  transformSalesPersonData(data: any): any {
    const newSalesPersonArr = data.map((personObject: any) => {
      return {
        personId: personObject.Id,
        personName: personObject.Name,
      };
    });
    return newSalesPersonArr;
  }

  transformOrdersData(data: any): any {
    const newOrdersArr = data.map((orderObject: any) => {
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
  transformProductsData(data: any): any {
    const newProductsArr = data.map((productObject: any) => {
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
