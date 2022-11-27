import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardContainerComponent } from './dashboard-container.component';

const dashboardRoutes: Routes = [
  { path: 'dashboard', component: DashboardContainerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
})
export class DashboardRoutingModule {}
