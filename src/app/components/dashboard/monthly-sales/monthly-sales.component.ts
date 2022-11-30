import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Chart } from 'chart.js';
import { MonthlySales } from 'src/app/shared/xlsx-data.interface';

@Component({
  selector: 'app-monthly-sales',
  templateUrl: './monthly-sales.component.html',
  styleUrls: ['./monthly-sales.component.css'],
})
export class MonthlySalesComponent implements AfterViewInit {
  @Input() soldUnitsPerMonth!: MonthlySales[];
  @ViewChild('chart')
  private chartRef!: ElementRef;
  private chart!: Chart;

  ngAfterViewInit() {
    this.defineChartDetails(this.soldUnitsPerMonth);
  }

  defineChartDetails(items: MonthlySales[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: items.map(
          (item: any) =>
            item.month.charAt(0).toUpperCase() + item.month.substring(1)
        ),
        datasets: [
          {
            label: 'Products sold per month',
            data: items.map((item: MonthlySales) => item.totalSalesInMonth),
            backgroundColor: [
              'rgb(8, 210, 172, 0.7)',
              'rgb(51, 195, 229, 0.7)',
            ],
          },
        ],
      },
    });
  }
}
