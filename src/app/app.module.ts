import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { NgChartsModule } from 'ng2-charts';
import { MatTableModule } from '@angular/material/table';

import { AppComponent } from './app.component';
import { DashboardContainerComponent } from './components/dashboard/dashboard-container.component';
import { SalesPersonComponent } from './components/dashboard/sales-person/sales-person.component';
import { MonthlySalesComponent } from './components/dashboard/monthly-sales/monthly-sales.component';
import { CustomerPurchasesComponent } from './components/dashboard/customer-purchases/customer-purchases.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardContainerComponent,
    SalesPersonComponent,
    MonthlySalesComponent,
    CustomerPurchasesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgChartsModule,
    MatTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
