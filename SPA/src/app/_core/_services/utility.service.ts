import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(

  ) { }

  getFormData(product: any, fileImages: File[], fileVideos: File[]) {
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
    return formData;
  }

  getFormDataArticle(article: any, fileImages: File[], fileVideos: File[]) {
    const formData = new FormData();
    formData.append('Article_Cate_ID', article.article_Cate_ID);
    formData.append('Article_Name', article.article_Name);
    formData.append('Content', article.content);
    formData.append('Status', article.status);
    formData.append('Link', article.link);
    formData.append('Alias', article.alias);
    for (var i = 0; i < fileImages.length; i++) {
      formData.append('Images', fileImages[i]);
    }
    for (var i = 0; i < fileVideos.length; i++) {
      formData.append('Videos', fileVideos[i]);
    }
    return formData;
  }

  getParamPagination(page?, itemsPerPage?) {
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    return params;
  }

  getParamSearchPagination(page?, itemsPerPage?, text?) {
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    params = params.append('text', text);
    return params;
  }
}
