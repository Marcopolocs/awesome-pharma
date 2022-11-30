import { Component } from '@angular/core';
import { map } from 'rxjs';
import { SalesPerson } from 'src/app/shared/xlsx-data.interface';
import { DataCalculatorService } from '../../services/data-calculator.service';

@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.css'],
})
export class DashboardContainerComponent {
  image: string = './assets/awsome-logo.png';
  aggregatedData$ = this.dataCalculatorService.aggregateData();
  salesPersonDetails$ = this.dataCalculatorService.salesPersonDetails$.pipe(
    map((data: SalesPerson[]) => data.slice(0, 3))
  );

  constructor(private dataCalculatorService: DataCalculatorService) {}

  setSortCondition(sortCondition: string) {
    this.dataCalculatorService.sortSalesPersonsByCondition(sortCondition);
  }
}
