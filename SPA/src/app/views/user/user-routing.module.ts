import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListResolver } from 'src/app/_core/_resolver/user-list.resolver';
import { UserListGuard } from '../../_core/_guard/user-list.guard';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { UserComponent } from './list/user.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [UserListGuard],
    data: { title: 'User List' },
    resolve: { users: UserListResolver },
    component: UserComponent
  },
  {
    path: 'add',
    data: { title: 'User Add' },
    component: AddComponent
  },
  {
    path: 'edit',
    data: { title: 'User Edit' },
    component: EditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }