import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyPosition } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertUtilityService } from 'src/app/_core/_services/alert-utility.service';
import { AuthService } from 'src/app/_core/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: any = {};

  constructor(
    private authService: AuthService,
    private spinnerService: NgxSpinnerService,
    private alertUtility: AlertUtilityService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    this.spinnerService.show();
    this.authService.login(this.user.userName, this.user.password).subscribe(
      (next) => {
        this.alertUtility.success('Success', 'Login Success!!', SnotifyPosition.rightTop);
        this.spinnerService.hide();
      },
      (error) => {
        this.alertUtility.error('Error', 'Username or Password incorrect!!', SnotifyPosition.rightTop);
        this.spinnerService.hide();
      },
      () => {
        this.spinnerService.hide();
        this.router.navigate(['/dashboard']);
      }
    );
  }
}
