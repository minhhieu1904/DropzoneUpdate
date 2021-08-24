import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartRoutingModule } from './chart-routing.module';
import { ApexchartsComponent } from './apexcharts/apexcharts.component';
import { Ng2ChartComponent } from './ng2-chart/ng2-chart.component';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [ApexchartsComponent, Ng2ChartComponent],
  imports: [
    CommonModule,
    ChartRoutingModule,
    ChartsModule
  ]
})
export class ChartModule { }
