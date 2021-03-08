import { Injectable } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { Roles } from '../_constants/roles.constant';
import { AlertUtilityService } from '../_services/alert-utility.service';
import { SnotifyPosition } from 'ng-snotify';

@Injectable({
  providedIn: 'root'
})
export class UserListGuard {
  constructor(
    private router: Router,
    private alertUtility: AlertUtilityService
  ) { }
  canActivate(): boolean {
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (user.role.includes(Roles.sets_UserList)) {
      return true;
    } else {
      this.alertUtility.warning('Warning', "You can't access the system", SnotifyPosition.centerTop);
      this.router.navigate(['/dashboard']);
    }
  }
}
