import { Component, OnInit } from '@angular/core';
import { DataCalculatorService } from '../services/data-calculator.service';
import { DataProviderService } from '../services/data-provider.service';

@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.css'],
})
export class DashboardContainerComponent implements OnInit {
  constructor(private dataCalculatorService: DataCalculatorService) {}

  ngOnInit(): void {
    this.dataCalculatorService.dataProcess();
  }
}
