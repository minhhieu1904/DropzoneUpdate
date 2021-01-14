import { Injectable } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) { }
  canActivate(): boolean {
      if (this.authService.loggedIn()) {
        return true;
      }
      else {
        this.router.navigate(['/login']);
      }
  }
}
