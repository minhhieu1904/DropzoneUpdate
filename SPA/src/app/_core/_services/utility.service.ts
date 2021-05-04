import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FunctionUtility } from '../_utility/fucntion-utility';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  baseUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private functionUtility: FunctionUtility
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

  // Converting "String" to javascript "File Object"
  convertToFile(listFile: string[], urlFolder: string, file: File[]) {
    // ***Here is the code for converting "String" to "Base64".***
    listFile.forEach(element => {
      if (element !== '') {
        let url = urlFolder + element;
        const toDataURL = url => fetch(url)
          .then(response => response.blob())
          .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          }));

        // *** Calling both function ***
        toDataURL(url).then(dataUrl => {
          var fileData = dataURLtoFile(dataUrl, element);
          file.push(fileData);
        });

        // ***Here is code for converting "Base64" to javascript "File Object".***
        function dataURLtoFile(dataurl, filename) {
          var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new File([u8arr], filename, { type: mime });
        }
      }
    });
  }
  // End Converting "String" to javascript "File Object"

  // Export excel with Params
  exportExcelParams(params: HttpParams, urlController: string, nameString: string) {
    return this.http.get(this.baseUrl + urlController, { responseType: 'blob', params })
      .subscribe((result: Blob) => {
        const blob = new Blob([result]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        const currentTime = new Date();

        let filename = nameString + currentTime.getFullYear().toString() +
          (currentTime.getMonth() + 1) + currentTime.getDate() +
          currentTime.toLocaleTimeString().replace(/[ ]|[,]|[:]/g, '').trim() + '.xlsx';

        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
      });
  }
  // End export excel with Params

  // Export excel with checkExport
  exportExcelWithCheckExport(params: HttpParams, urlController: string, nameString: string, checkExport: number) {
    return this.http.get(this.baseUrl + urlController, { responseType: 'blob', params })
      .subscribe((result: Blob) => {
        const blob = new Blob([result]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        const currentTime = new Date();

        let fileExtension = checkExport === 1 ? '.xlsx' : '.pdf';
        let filename = nameString + currentTime.getFullYear().toString() +
          (currentTime.getMonth() + 1) + currentTime.getDate() +
          currentTime.toLocaleTimeString().replace(/[ ]|[,]|[:]/g, '').trim();

        link.href = url;
        link.setAttribute('download', filename + fileExtension);
        document.body.appendChild(link);
        link.click();
      });
  }
  // End export excel with checkExport
}
