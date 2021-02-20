import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { SnotifyPosition } from 'ng-snotify';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Article } from '../_models/article';
import { AlertUtilityService } from '../_services/alert-utility.service';
import { ArticleService } from '../_services/article.service';

@Injectable()
export class ArticleListResolver implements Resolve<Article[]> {
  pageNumber = 1;
  pageSize = 10;
  text = '';
  constructor(
    private articleService: ArticleService,
    private router: Router,
    private alertUtility: AlertUtilityService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Article[]> {
    this.text = this.text === '' ? '' : this.text;
    return this.articleService.getDataPaginations(this.pageNumber, this.pageSize, this.text).pipe(
      catchError(error => {
        this.alertUtility.error('Error', 'Problem retrieving data', SnotifyPosition.rightTop);
        this.router.navigate(['/dashboard']);
        return of(null);
      })
    );
  }
}