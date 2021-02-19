import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../_models/product';
import { AlertUtilityService } from '../_services/alert-utility.service';
import { ProductService } from '../_services/product.service';

@Injectable()
export class ProductListResolver implements Resolve<Product[]> {
  pageNumber = 1;
  pageSize = 10;
  text = '';
  constructor(
    private productService: ProductService,
    private router: Router,
    private alertUtility: AlertUtilityService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Product[]> {
    this.text = this.text === '' ? '' : this.text;
    return this.productService.getDataPaginations(this.pageNumber, this.pageSize, this.text).pipe(
      catchError(error => {
        this.alertUtility.error('Error', 'Problem retrieving data');
        this.router.navigate(['/dashboard']);
        return of(null);
      })
    );
  }
}