import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ArticleCategory } from '../_models/article-category';
import { OperationResult } from '../_utility/operation-result';
import { PaginationResult } from '../_utility/pagination';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleCategoryService {
  baseUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private utilityService: UtilityService
  ) { }

  create(articleCategory: ArticleCategory) {
    return this.http.post<OperationResult>(this.baseUrl + 'ArticleCategory', articleCategory);
  }

  getByID(articleCateID: string) {
    let params = new HttpParams();
    params = params.append('articleCateID', articleCateID);
    return this.http.get<OperationResult>(this.baseUrl + 'ArticleCategory', { params })
  }

  getArticleCateList() {
    return this.http.get<ArticleCategory>(this.baseUrl + 'ArticleCategory/all');
  }

  getIdAndName() {
    return this.http.get<any>(this.baseUrl + 'ArticleCategory/name');
  }

  getDataPaginations(page?, itemsPerPage?, text?): Observable<PaginationResult<ArticleCategory>> {
    let params = this.utilityService.getParamSearchPagination(page, itemsPerPage, text);

    return this.http.get<PaginationResult<ArticleCategory>>(this.baseUrl + 'ArticleCategory/pagination', { params });
  }

  update(articleCategory: ArticleCategory) {
    return this.http.put<OperationResult>(this.baseUrl + 'ArticleCategory', articleCategory);
  }

  changeStatus(articleCategory: ArticleCategory) {
    return this.http.put<OperationResult>(this.baseUrl + 'ArticleCategory/changeStatus', articleCategory);
  }

  remove(articleCategory: ArticleCategory) {
    return this.http.post<OperationResult>(this.baseUrl + 'ArticleCategory/delete', articleCategory);
  }

  importExcel(fileImportExcel) {
    const formData = new FormData();
    formData.append('files', fileImportExcel);
    return this.http.post<OperationResult>(this.baseUrl + 'ArticleCategory/import', formData);
  }

  export(page?, itemsPerPage?, text?) {
    let params = this.utilityService.getParamSearchPagination(page, itemsPerPage, text);

    return this.utilityService.exportExcelParams(params, 'ArticleCategory/exportExcelEpplus', 'Article_Category_');
  }

  exportAspose(page?, itemsPerPage?, text?, checkExport?: number) {
    let params = this.utilityService.getParamSearchPagination(page, itemsPerPage, text);
    params = params.append("checkExport", checkExport.toString());

    return this.utilityService.exportExcelAuditWithCheckExport(params, 'ArticleCategory/exportExcelAspose', 'Article_Category_', checkExport);
  }
}
