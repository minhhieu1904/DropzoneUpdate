import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListResolver } from 'src/app/_core/_resolver/product-list.resolver';
import { ProductListGuard } from 'src/app/_core/_guard/product-list.guard';
import { ProductRoutingModule } from './product-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgSelect2Module } from 'ng-select2';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  imports: [
    CommonModule,
    ProductRoutingModule,
    FormsModule,
    NgSelect2Module,
    NgxDropzoneModule,
    BsDatepickerModule,
    PaginationModule.forRoot(),
  ],
  declarations: [
    ListComponent,
    AddComponent
  ],
  providers: [
    ProductListResolver,
    ProductListGuard
  ]
})
export class ProductModule { }
