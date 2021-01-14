import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Article } from '../_models/article';
import { AlertifyService } from '../_services/alertify.service';
import { ArticleService } from '../_services/article.service';

@Injectable()
export class ArticleListResolver implements Resolve<Article[]> {
  pageNumber = 1;
  pageSize = 10;
  text = '';
  constructor(
    private articleService: ArticleService,
    private router: Router,
    private alertify: AlertifyService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Article[]> {
    this.text = this.text === '' ? '' : this.text;
    return this.articleService.getDataPaginations(this.pageNumber, this.pageSize, this.text).pipe(
      catchError(error => {
        this.alertify.error('Problem retrieving data');
        this.router.navigate(['/dashboard']);
        return of(null);
      })
    );
  }
}