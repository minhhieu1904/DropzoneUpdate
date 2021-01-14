import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Article } from '../_models/article';
import { ArticleCategory } from '../_models/article-category';
import { OperationResult } from '../_utility/operation-result';
import { PaginationResult } from '../_utility/pagination';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  baseUrl = environment.apiUrl;
  articleSource = new BehaviorSubject<Object>({});
  currentArticle = this.articleSource.asObservable();
  flagSource = new BehaviorSubject<string>('0');
  currentFlag = this.flagSource.asObservable();
  constructor(private http: HttpClient) { }

  create(article: Article) {
    return this.http.post<OperationResult>(this.baseUrl + 'Article', article);
  }

  getByID(articleCateID: string, articleID: string) {
    let params = new HttpParams();
    params = params.append('articleCateID', articleCateID);
    params = params.append('articleID', articleID);
    return this.http.get<Article>(this.baseUrl + 'Article', { params })
  }

  getArticleList() {
    return this.http.get<any>(this.baseUrl + 'Article/all');
  }

  getArticleListByArticleCateID(articleCateID: string) {
    let params = new HttpParams();
    params = params.append('articleCateID', articleCateID);
    return this.http.get<any>(this.baseUrl + 'Article/articleID', { params });
  }

  getDataPaginations(page?, itemsPerPage?, text?): Observable<PaginationResult<Article>> {
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    params = params.append('text', text);

    return this.http.get<PaginationResult<Article>>(this.baseUrl + 'Article/pagination', { params });
  }

  searchDataPaginations(page?, itemsPerPage?, articleCateID?, articleName?): Observable<PaginationResult<Article>> {
    articleCateID = articleCateID === 'all' ? '' : articleCateID;
    articleName = articleName === 'all' ? '' : articleName;
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    params = params.append('articleCateID', articleCateID);
    params = params.append('articleName', articleName);

    return this.http.get<PaginationResult<Article>>(this.baseUrl + 'Article/search', { params });
  }

  update(article: Article) {
    return this.http.put<OperationResult>(this.baseUrl + 'Article', article);
  }

  changeStatus(article: Article) {
    return this.http.put<OperationResult>(this.baseUrl + 'Article/changeStatus', article);
  }

  remove(articleCateID: string, articleID: string) {
    let params = new HttpParams();
    params = params.append('articleCateID', articleCateID);
    params = params.append('articleID', articleID);
    return this.http.delete<OperationResult>(this.baseUrl + 'Article', { params });
  }

  changeArticle(article: Article) {
    this.articleSource.next(article);
  }

  changeFlag(flag: string) {
    this.flagSource.next(flag);
  }
}
