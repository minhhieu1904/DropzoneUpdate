import { Component } from '@angular/core';
// import { navItems } from '../../_nav';
import { NavItem } from '../../_nav';
import { User } from '../../_core/_models/user';
import { AuthService } from '../../_core/_services/auth.service';
import { Router } from '@angular/router';
import { AlertUtilityService } from 'src/app/_core/_services/alert-utility.service';
import { SnotifyPosition } from 'ng-snotify';
import { commonPerFactory } from 'src/app/_core/_utility/common-fer-factory';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  // public navItems = navItems;
  public navItems = [];
  public imageUser = '';
  currentUser: User = JSON.parse(localStorage.getItem('user'));
  constructor(
    private authService: AuthService,
    private alertUtility: AlertUtilityService,
    private router: Router,
    private nav: NavItem
  ) {
    this.navItems = this.nav.getNav();
    this.imageUser = this.currentUser.image === null ? commonPerFactory.imageUserDefault
                                    : commonPerFactory.imageUserUrl + this.currentUser.image;
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.alertUtility.success('Success', 'Logged out');
    this.router.navigate(['/login']);
  }
}
