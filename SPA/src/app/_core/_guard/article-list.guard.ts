import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyPosition } from 'ng-snotify';
import { Roles } from '../_constants/roles.constant';
import { User } from '../_models/user';
import { AlertUtilityService } from '../_services/alert-utility.service';

@Injectable({
    providedIn: 'root'
})
export class ArticleListGuard {
    constructor(
        private router: Router,
        private alertUtility: AlertUtilityService
    ) { }
    canActivate(): boolean {
        const user: User = JSON.parse(localStorage.getItem('user'));
        if (user.role.includes(Roles.sets_Article)) {
            return true;
        } else {
            this.alertUtility.warning('Warning', "You can't access the system", SnotifyPosition.centerTop);
            this.router.navigate(['/dashboard']);
        }
    }
}