import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class DataProviderService {
  dataFile: string = 'assets/DW_Mini_case.xlsx';
  reader: FileReader = new FileReader();

  constructor(private http: HttpClient) {}

  accessDataFromXlsx() {
    this.http.get(this.dataFile, { responseType: 'blob' }).subscribe((data) => {
      this.readXlsxData(data).subscribe((data) => console.log(data));
    });
  }

  readXlsxData(data: Blob) {
    this.reader.readAsBinaryString(data);

    return new Observable((observer) => {
      this.reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        const allSheetsData: any = [];
        wb.SheetNames.forEach((wsname, i) => {
          const worksheet: XLSX.WorkSheet = wb.Sheets[wsname];
          allSheetsData.push(XLSX.utils.sheet_to_json(worksheet));
        });
        observer.next(allSheetsData);
      };
    });
  }
}
