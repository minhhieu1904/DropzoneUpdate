import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ArticleCategory } from '../_models/article-category';
import { AlertifyService } from '../_services/alertify.service';
import { ArticleCategoryService } from '../_services/article-category.service'

@Injectable()
export class ArticleCategoryListResolver implements Resolve<ArticleCategory[]> {
  pageNumber = 1;
  pageSize = 10;
  text = '';
  constructor(
    private articleCategoryService: ArticleCategoryService,
    private router: Router,
    private alertify: AlertifyService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<ArticleCategory[]> {
    this.text = this.text === '' ? '' : this.text;
    return this.articleCategoryService.getDataPaginations(this.pageNumber, this.pageSize, this.text).pipe(
      catchError(error => {
        this.alertify.error('Problem retrieving data');
        this.router.navigate(['/dashboard']);
        return of(null);
      })
    );
  }
}