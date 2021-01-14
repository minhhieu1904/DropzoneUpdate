import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListResolver } from 'src/app/_core/_resolver/user-list.resolver';
import { UserListGuard } from '../../_core/_guard/user-list.guard';
import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [UserListGuard],
    data: { title: 'User List' },
    resolve: { users: UserListResolver },
    component: UserComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }