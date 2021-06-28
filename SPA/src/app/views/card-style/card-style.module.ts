import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardStyleRoutingModule } from './card-style-routing.module';
import { MainComponent } from './main/main.component';


@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    CardStyleRoutingModule
  ]
})
export class CardStyleModule { }
