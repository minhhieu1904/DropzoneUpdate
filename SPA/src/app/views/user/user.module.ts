import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { UserListGuard } from '../../_core/_guard/user-list.guard';
import { UserListResolver } from 'src/app/_core/_resolver/user-list.resolver';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    UserListResolver,
    UserListGuard
  ]
})
export class UserModule { }
