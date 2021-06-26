import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCategoryRoutingModule } from './article-category-routing.module';
import { ArticleCategoryListGuard } from 'src/app/_core/_guard/article-category-list.guard';
import { ArticleCategoryListResolver } from 'src/app/_core/_resolver/article-category-list.resolver';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  imports: [
    CommonModule,
    ArticleCategoryRoutingModule,
    FormsModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    ListComponent,
    AddComponent
  ],
  providers: [
    ArticleCategoryListResolver,
    ArticleCategoryListGuard
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ArticleCategoryModule { }
