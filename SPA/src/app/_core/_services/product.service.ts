import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../_models/product';
import { OperationResult } from '../_utility/operation-result';
import { PaginationResult } from '../_utility/pagination';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl = environment.apiUrl;
  productSource = new BehaviorSubject<Object>({});
  currentProduct = this.productSource.asObservable();
  flagSource = new BehaviorSubject<string>('0');
  currentFlag = this.flagSource.asObservable();
  constructor(private http: HttpClient) { }

  create(product: any, fileImages: File[], fileVideos: File[]) {
    const formData = new FormData();
    if (product.from_Date_Sale === null || product.from_Date_Sale === '' || product.from_Date_Sale === undefined) {
      delete product.from_Date_Sale;
    }
    else {
      formData.append('From_Date_Sale', new Date(product.from_Date_Sale).toDateString());
    }
    if (product.to_Date_Sale === null || product.to_Date_Sale === '' || product.to_Date_Sale === undefined) {
      delete product.to_Date_Sale;
    }
    else {
      formData.append('To_Date_Sale', new Date(product.to_Date_Sale).toDateString());
    }
    formData.append('Product_Cate_ID', product.product_Cate_ID);
    formData.append('Product_Name', product.product_Name);
    formData.append('Time_Sale', product.time_Sale);
    formData.append('Content', product.content);
    formData.append('Price', product.price);
    formData.append('Amount', product.amount);
    formData.append('IsSale', product.isSale);
    formData.append('Discount', product.discount);
    formData.append('New', product.new);
    formData.append('Hot_Sale', product.hot_Sale);
    formData.append('Status', product.status);
    for (var i = 0; i < fileImages.length; i++) {
      formData.append('Images', fileImages[i]);
    }
    for (var i = 0; i < fileVideos.length; i++) {
      formData.append('Videos', fileVideos[i]);
    }
    return this.http.post<OperationResult>(this.baseUrl + 'Product/uploadFile', formData);
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
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    params = params.append('text', text);

    return this.http.get<PaginationResult<Product>>(this.baseUrl + 'Product/pagination', { params });
  }

  searchDataPaginations(page?, itemsPerPage?, productCateID?, productName?): Observable<PaginationResult<Product>> {
    productCateID = productCateID === 'all' ? '' : productCateID;
    productName = productName === 'all' ? '' : productName;
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    params = params.append('productCateID', productCateID);
    params = params.append('productName', productName);

    return this.http.get<PaginationResult<Product>>(this.baseUrl + 'Product/search', { params });
  }

  update(product: any, fileImages: File[], fileVideos: File[]) {
    const formData = new FormData();
    if (product.from_Date_Sale === null || product.from_Date_Sale === '' || product.from_Date_Sale === undefined) {
      delete product.from_Date_Sale;
    }
    else {
      formData.append('From_Date_Sale', new Date(product.from_Date_Sale).toDateString());
    }
    if (product.to_Date_Sale === null || product.to_Date_Sale === '' || product.to_Date_Sale === undefined) {
      delete product.to_Date_Sale;
    }
    else {
      formData.append('To_Date_Sale', new Date(product.to_Date_Sale).toDateString());
    }
    formData.append('Product_Cate_ID', product.product_Cate_ID);
    formData.append('Product_ID', product.product_ID);
    formData.append('Product_Name', product.product_Name);
    formData.append('Time_Sale', product.time_Sale);
    formData.append('Content', product.content);
    formData.append('FileImages', product.fileImages);
    formData.append('FileVideos', product.fileVideos);
    formData.append('Price', product.price);
    formData.append('Amount', product.amount);
    formData.append('IsSale', product.isSale);
    formData.append('Discount', product.discount);
    formData.append('New', product.new);
    formData.append('Hot_Sale', product.hot_Sale);
    formData.append('Status', product.status);
    for (var i = 0; i < fileImages.length; i++) {
      formData.append('Images', fileImages[i]);
    }
    for (var i = 0; i < fileVideos.length; i++) {
      formData.append('Videos', fileVideos[i]);
    }
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

  remove(productCateID: string, productID: string) {
    let params = new HttpParams();
    params = params.append('productCateID', productCateID);
    params = params.append('productID', productID);
    return this.http.delete<OperationResult>(this.baseUrl + 'Product', { params });
  }

  changeProduct(product: Product) {
    this.productSource.next(product);
  }

  changeFlag(flag: string) {
    this.flagSource.next(flag);
  }
}
