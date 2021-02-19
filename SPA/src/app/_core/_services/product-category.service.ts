import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductCategory } from '../_models/product-category';
import { OperationResult } from '../_utility/operation-result';
import { PaginationResult } from '../_utility/pagination';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  baseUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private utilityService: UtilityService
  ) { }

  create(productCategory: ProductCategory) {
    return this.http.post<OperationResult>(this.baseUrl + 'ProductCategory', productCategory);
  }

  getByID(productCateID: string) {
    let params = new HttpParams();
    params = params.append('productCateID', productCateID)
    return this.http.get<OperationResult>(this.baseUrl + 'ProductCategory', { params });
  }

  getProductCateList() {
    return this.http.get<ProductCategory>(this.baseUrl + 'ProductCategory/all');
  }

  getIdAndName() {
    return this.http.get<any>(this.baseUrl + 'ProductCategory/name');
  }

  getDataPaginations(page?, itemsPerPage?, text?): Observable<PaginationResult<ProductCategory>> {
    let params = this.utilityService.getParamSearchPagination(page, itemsPerPage, text);

    return this.http.get<PaginationResult<ProductCategory>>(this.baseUrl + 'ProductCategory/pagination', { params });
  }

  update(productCategory: ProductCategory) {
    return this.http.put<OperationResult>(this.baseUrl + 'ProductCategory', productCategory);
  }

  changeStatus(productCategory: ProductCategory) {
    return this.http.put<OperationResult>(this.baseUrl + 'ProductCategory/changeStatus', productCategory);
  }

  remove(productCategory: ProductCategory) {
    return this.http.post<OperationResult>(this.baseUrl + 'ProductCategory/delete', productCategory);
  }
}
