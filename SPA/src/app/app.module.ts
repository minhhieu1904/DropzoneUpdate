import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { environment } from '../environments/environment';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthGuard } from './_core/_guard/auth.guard';
import { LoginComponent } from './views/login/login.component';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { commonPerFactory } from './_core/_utility/common-fer-factory';
import { UserModule } from './views/user/user.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Import containers
import { DefaultLayoutComponent } from './containers';
import { ErrorInterceptorProvider } from './_core/_services/error.interceptor';
import { AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule } from '@coreui/angular';
import { AppRoutingModule } from './views/app.routing';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];


// get token in localstore
export function tokenGetter() {
  return localStorage.getItem('token');
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ...APP_CONTAINERS
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    AkitaNgRouterStoreModule.forRoot(),
    FormsModule,
    NgxSpinnerModule,
    ModalModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [commonPerFactory.serverSentTokenInAppModule],
        disallowedRoutes: [commonPerFactory.linkSentTokenInAppModule]
      }
    }),
    HttpClientModule,
    UserModule,
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    AuthGuard,
    ErrorInterceptorProvider
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
