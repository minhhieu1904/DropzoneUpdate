import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategoryListResolver } from 'src/app/_core/_resolver/product-category-list.resolver';
import { ProductCategoryListGuard } from 'src/app/_core/_guard/product-category-list.guard';
import { ProductCategoryRoutingModule } from './product-category-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import {NgxPrintModule} from 'ngx-print';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  imports: [
    CommonModule,
    ProductCategoryRoutingModule,
    FormsModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    NgxPrintModule
  ],
  declarations: [
    ListComponent,
    AddComponent
  ],
  providers: [
    ProductCategoryListResolver,
    ProductCategoryListGuard
  ]
})
export class ProductCategoryModule { }
