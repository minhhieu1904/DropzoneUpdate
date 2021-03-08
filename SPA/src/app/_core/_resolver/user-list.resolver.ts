import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertUtilityService } from '../_services/alert-utility.service';
import { SnotifyPosition } from 'ng-snotify';

@Injectable()
export class UserListResolver implements Resolve<User[]> {
  pageNumber = 1;
  pageSize = 10;
  constructor(
    private userService: UserService,
    private router: Router,
    private alertUtility: AlertUtilityService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
    debugger
    return this.userService.getUsers(this.pageNumber, this.pageSize).pipe(
      catchError(error => {
        this.alertUtility.error('Error', 'Problem retrieving data', SnotifyPosition.centerTop);
        this.router.navigate(['/dashboard']);
        return of(null);
      })
    );
  }
}
