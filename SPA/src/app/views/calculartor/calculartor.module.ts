import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalculartorRoutingModule } from './calculartor-routing.module';
import { TemplateComponent } from './template/template.component';


@NgModule({
  declarations: [TemplateComponent],
  imports: [
    CommonModule,
    CalculartorRoutingModule
  ]
})
export class CalculartorModule { }
