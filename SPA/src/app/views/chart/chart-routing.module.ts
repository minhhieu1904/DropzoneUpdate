import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApexchartsComponent } from './apexcharts/apexcharts.component';
import { Ng2ChartComponent } from './ng2-chart/ng2-chart.component';

const routes: Routes = [
  {
    path: 'apexcharts',
    data: { title: 'Chart' },
    component: ApexchartsComponent
  },
  {
    path: 'ng2Chart',
    data: { title: 'Chart' },
    component: Ng2ChartComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartRoutingModule { }
