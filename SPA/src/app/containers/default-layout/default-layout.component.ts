import { Component } from '@angular/core';
// import { navItems } from '../../_nav';
import { NavItem } from '../../_nav';
import { User } from '../../_core/_models/user';
import { AuthService } from '../../_core/_services/auth.service';
import { AlertifyService } from '../../_core/_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  // public navItems = navItems;
  public navItems = [];
  currentUser: User = JSON.parse(localStorage.getItem('user'));
  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private router: Router,
    private nav: NavItem
  ) {
    this.navItems = this.nav.getNav();
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.alertify.message('Logged out');
    this.router.navigate(['/login']);
  }
}
