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

@NgModule({
  imports: [
    CommonModule,
    ProductCategoryRoutingModule,
    FormsModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot()
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
