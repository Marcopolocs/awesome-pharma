import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import {
  MonthlySales,
  PurchasedNumberPerCustomer,
  SalesPerson,
} from 'src/app/shared/xlsx-data.interface';
import { DataCalculatorService } from '../../services/data-calculator.service';

@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.css'],
})
export class DashboardContainerComponent implements OnInit, OnDestroy {
  image: string = './assets/awsome-logo.png';
  subscribeToDataCalculation!: Subscription;

  unitsSoldPerMonth$: Observable<MonthlySales[]> =
    this.dataCalculatorService.soldUnitsPerMonth$;

  salesPersonDetails$: Observable<SalesPerson[]> =
    this.dataCalculatorService.salesPersonDetails$.pipe(
      map((list: SalesPerson[]) => list.slice(0, 3))
    );

  customerMonthlyPurchases$: Observable<PurchasedNumberPerCustomer[]> =
    this.dataCalculatorService.purchasedNumbersByCustomer$;

  constructor(private dataCalculatorService: DataCalculatorService) {}

  ngOnInit(): void {
    this.subscribeToDataCalculation = this.dataCalculatorService
      .aggregateData()
      .subscribe();
  }

  setSortCondition(sortCondition: string) {
    this.dataCalculatorService.sortSalesPersonsByCondition(sortCondition);
  }

  ngOnDestroy(): void {
    this.subscribeToDataCalculation.unsubscribe();
  }
}
