import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleRoutingModule } from './article-routing.module';
import { ArticleListResolver } from 'src/app/_core/_resolver/article-list.resolver';
import { ArticleListGuard } from 'src/app/_core/_guard/article-list.guard';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  imports: [
    CommonModule,
    ArticleRoutingModule,
    FormsModule,
    NgSelect2Module,
    NgxDropzoneModule,
    PaginationModule.forRoot(),
  ],
  declarations: [
    ListComponent,
    AddComponent
  ],
  providers: [
    ArticleListResolver,
    ArticleListGuard
  ]
})
export class ArticleModule { }
