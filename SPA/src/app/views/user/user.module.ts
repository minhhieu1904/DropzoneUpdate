import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { UserListGuard } from '../../_core/_guard/user-list.guard';
import { UserListResolver } from 'src/app/_core/_resolver/user-list.resolver';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { UserComponent } from './list/user.component';

@NgModule({
  declarations: [
    UserComponent,
    AddComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [
    UserListResolver,
    UserListGuard
  ]
})
export class UserModule { }
