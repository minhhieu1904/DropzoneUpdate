import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductCategory } from '../_models/product-category';
import { AlertifyService } from '../_services/alertify.service';
import { ProductCategoryService } from '../_services/product-category.service'

@Injectable()
export class ProductCategoryListResolver implements Resolve<ProductCategory[]> {
  pageNumber = 1;
  pageSize = 10;
  text = '';
  constructor(
    private productCategoryService: ProductCategoryService,
    private router: Router,
    private alertify: AlertifyService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<ProductCategory[]> {
    this.text = this.text === '' ? '' : this.text;
    return this.productCategoryService.getDataPaginations(this.pageNumber, this.pageSize, this.text).pipe(
      catchError(error => {
        this.alertify.error('Problem retrieving data');
        this.router.navigate(['/dashboard']);
        return of(null);
      })
    );
  }
}