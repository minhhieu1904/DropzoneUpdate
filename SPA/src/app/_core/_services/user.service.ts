import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { OperationResult } from '../_utility/operation-result';
import { PaginationResult } from '../_utility/pagination';
import { RoleUserAuthorize } from '../_models/role-user-authorize';
import { User } from '../_models/user';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private utilityService: UtilityService
  ) { }

  getUsers(page?, itemsPerPage?): Observable<PaginationResult<User>> {
    let params = this.utilityService.getParamPagination(page, itemsPerPage);
    return this.http.get<PaginationResult<User>>(this.baseUrl + 'User/GetAll', { params });
  }

  searchUser(page?, itemsPerPage?, text?) {
    let params = this.utilityService.getParamPagination(page, itemsPerPage);

    return this.http.get<PaginationResult<User>>(this.baseUrl + 'User/Search/' + text, { params });
  }

  addUser(user: any, file: File) {
    const formData = this.utilityService.getFormDataUser(user, file);
    return this.http.post<OperationResult>(this.baseUrl + 'User/Create', formData);
  }

  deleteUser(factory_ID: string, user_Account: string) {
    let params = new HttpParams();
    params = params.append('factory_ID', factory_ID);
    params = params.append('user_Account', user_Account);

    return this.http.delete<OperationResult>(this.baseUrl + 'User', { params });
  }

  updateUser(user: any, file: File) {
    const formData = this.utilityService.getFormDataUser(user, file);
    return this.http.put<OperationResult>(this.baseUrl + 'User', formData);
  }

  getRoleByUser(factory_ID: string, user_Account: string) {
    let params = new HttpParams();
    params = params.append('factory_ID', factory_ID);
    params = params.append('user_Account', user_Account);

    return this.http.get(this.baseUrl + 'User/GetRoles', { params });
  }

  saveUserRole(roles: RoleUserAuthorize[]) {
    return this.http.post<OperationResult>(this.baseUrl + 'User/SaveRoles', roles);
  }

  updateLastLogin(factory_ID: string, user_Account: string) {
    let params = new HttpParams();
    params = params.append('factory_ID', factory_ID);
    params = params.append('user_Account', user_Account);

    return this.http.get(this.baseUrl + 'User/UpdateLastLogin', { params });
  }
}
