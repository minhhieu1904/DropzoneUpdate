import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../_models/product';
import { OperationResult } from '../_utility/operation-result';
import { PaginationResult } from '../_utility/pagination';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl = environment.apiUrl;
  productSource = new BehaviorSubject<Object>({});
  currentProduct = this.productSource.asObservable();
  flagSource = new BehaviorSubject<string>('0');
  currentFlag = this.flagSource.asObservable();
  constructor(
    private http: HttpClient,
    private utilityService: UtilityService
  ) { }

  create(product: any, fileImages: File[], fileVideos: File[]) {
    const formData = this.utilityService.getFormData(product, fileImages, fileVideos);
    return this.http.post<OperationResult>(this.baseUrl + 'Product/create', formData);
  }

  getByID(productCateID: string, productID: string) {
    let params = new HttpParams();
    params = params.append('productCateID', productCateID);
    params = params.append('productID', productID);
    return this.http.get<Product>(this.baseUrl + 'Product', { params });
  }

  getProductListByProductCateID(productCateID: string) {
    let params = new HttpParams();
    params = params.append('productCateID', productCateID);
    return this.http.get<any>(this.baseUrl + 'Product/productID', { params });
  }

  getProductList() {
    return this.http.get<Product>(this.baseUrl + 'Product/all');
  }

  getDataPaginations(page?, itemsPerPage?, text?): Observable<PaginationResult<Product>> {
    let params = this.utilityService.getParamSearchPagination(page, itemsPerPage, text);

    return this.http.get<PaginationResult<Product>>(this.baseUrl + 'Product/pagination', { params });
  }

  searchDataPaginations(page?, itemsPerPage?, productCateID?, productName?): Observable<PaginationResult<Product>> {
    productCateID = productCateID === 'all' ? '' : productCateID;
    productName = productName === 'all' ? '' : productName;
    let params = this.utilityService.getParamPagination(page, itemsPerPage);
    params = params.append('productCateID', productCateID);
    params = params.append('productName', productName);

    return this.http.get<PaginationResult<Product>>(this.baseUrl + 'Product/search', { params });
  }

  update(product: any, fileImages: File[], fileVideos: File[]) {
    const formData = this.utilityService.getFormData(product, fileImages, fileVideos);
    formData.append('Product_ID', product.product_ID);
    return this.http.put<OperationResult>(this.baseUrl + 'Product', formData);
  }

  changeNew(product: Product) {
    return this.http.put<OperationResult>(this.baseUrl + 'Product/changeNew', product);
  }

  changeHotSale(product: Product) {
    return this.http.put<OperationResult>(this.baseUrl + 'Product/changeHotSale', product);
  }

  changeIsSale(product: Product) {
    return this.http.put<OperationResult>(this.baseUrl + 'Product/changeIsSale', product);
  }

  changeStatus(product: Product) {
    return this.http.put<OperationResult>(this.baseUrl + 'Product/changeStatus', product);
  }

  remove(product: Product[]) {
    return this.http.post<OperationResult>(this.baseUrl + 'Product/delete', product);
  }

  changeProduct(product: Product) {
    this.productSource.next(product);
  }

  changeFlag(flag: string) {
    this.flagSource.next(flag);
  }

  exportListAspose(page?, itemsPerPage?, text?, checkExport?: number, productCateID?, productName?, checkSearch?: number) {
    productCateID = productCateID === 'all' ? '' : productCateID;
    productName = productName === 'all' ? '' : productName;
    let params = this.utilityService.getParamSearchPagination(page, itemsPerPage, text);
    params = params.append("checkExport", checkExport.toString());
    params = params.append("productCateID", productCateID);
    params = params.append("productName", productName);
    params = params.append("checkSearch", checkSearch.toString());

    return this.utilityService.exportExcelWithCheckExport(params, 'Product/exportExcelListAspose', 'Product_List_', checkExport);
  }

  exportAspose(productCateID: string, productID: number, checkExport?: number) {
    let params = new HttpParams();
    params = params.append("productCateID", productCateID);
    params = params.append("productID", productID.toString());
    params = params.append("checkExport", checkExport.toString());

    return this.utilityService.exportExcelWithCheckExport(params, 'Product/exportExcelDetailAspose', 'Product_Detail_', checkExport);
  }

  print(file: string) {
    return this.http.post(this.baseUrl + 'Product/print', file);
  }

  pdf() {
    debugger
    return this.http.get(this.baseUrl + 'product/PDF', { responseType: 'blob' })
      .subscribe((result: Blob) => {
        debugger
        const blob = new Blob([result]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        const currentTime = new Date();
        let filename = 'PDF_demo_' + currentTime.getFullYear().toString() +
          (currentTime.getMonth() + 1) + currentTime.getDate() +
          currentTime.toLocaleTimeString().replace(/[ ]|[,]|[:]/g, '').trim() + '.pdf';

        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
      });
  }
}
