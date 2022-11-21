import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataCalculatorService } from '../services/data-calculator.service';
import { DataProviderService } from '../services/data-provider.service';

@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.css'],
})
export class DashboardContainerComponent implements OnInit, OnDestroy {
  subscribeToDataCalculation!: Subscription;
  constructor(private dataCalculatorService: DataCalculatorService) {}

  ngOnInit(): void {
    this.subscribeToDataCalculation = this.dataCalculatorService
      .aggregateData()
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscribeToDataCalculation.unsubscribe();
  }
}
