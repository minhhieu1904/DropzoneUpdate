import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Roles } from '../_constants/roles.constant';
import { User } from '../_models/user';

@Injectable({
    providedIn: 'root'
})
export class ProductListGuard {
    constructor(private router: Router) { }
    canActivate(): boolean {
        const user: User = JSON.parse(localStorage.getItem('user'));
        if (user.role.includes(Roles.sets_Product)) {
            return true;
        } else {
            this.router.navigate(['/dashboard']);
        }
    }
}