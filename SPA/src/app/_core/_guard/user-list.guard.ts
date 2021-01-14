import { Injectable } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { Roles } from '../_constants/roles.constant';

@Injectable({
  providedIn: 'root'
})
export class UserListGuard {
  constructor(private router: Router) { }
  canActivate(): boolean {
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (user.role.includes(Roles.sets_UserList)) {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
