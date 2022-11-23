import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { map, Observable, switchMap } from 'rxjs';
import { MonthlySales } from 'src/app/shared/xlsx-data.interface';

@Component({
  selector: 'app-monthly-sales',
  templateUrl: './monthly-sales.component.html',
  styleUrls: ['./monthly-sales.component.css'],
})
export class MonthlySalesComponent implements OnInit, AfterViewInit {
  @Input() soldUnitsPerMonth!: Observable<MonthlySales[]>;
  @ViewChild('chart')
  private chartRef!: ElementRef;
  private chart!: Chart;

  public barChartLegend = true;
  public barChartPlugins = [];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.setChart().subscribe();
  }

  setChart() {
    return this.soldUnitsPerMonth.pipe(
      switchMap((items) => {
        return this.defineChartDetails(items);
      })
    );
  }

  defineChartDetails(items: any) {
    return new Observable((obs) => {
      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(this.chartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: items.map((item: any) => item.month + 1),
          datasets: [
            {
              label: 'Interesting Data',
              data: items.map((item: any) => item.totalSalesInMonth),
            },
          ],
        },
      });
    });
  }
}
