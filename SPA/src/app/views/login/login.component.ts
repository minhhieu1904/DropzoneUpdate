import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService } from 'src/app/_core/_services/alertify.service';
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
    private alertifyService: AlertifyService,
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
        this.alertifyService.success('Login Success!!');
        this.spinnerService.hide();
      },
      (error) => {
        this.alertifyService.error('Login failed!!');
        this.spinnerService.hide();
      },
      () => {
        this.spinnerService.hide();
        this.router.navigate(['/dashboard']);
      }
    );
  }
}
