import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { NgChartsModule } from 'ng2-charts';

import { CustomerPurchasesComponent } from './customer-purchases/customer-purchases.component';
import { DashboardContainerComponent } from './dashboard-container.component';
import { MonthlySalesComponent } from './monthly-sales/monthly-sales.component';
import { SalesPersonComponent } from './sales-person/sales-person.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [
    DashboardContainerComponent,
    SalesPersonComponent,
    MonthlySalesComponent,
    CustomerPurchasesComponent,
  ],
  imports: [
    CommonModule,
    NgChartsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTableModule,
    DashboardRoutingModule,
  ],
  exports: [DashboardContainerComponent],
})
export class DashboardModule {}
