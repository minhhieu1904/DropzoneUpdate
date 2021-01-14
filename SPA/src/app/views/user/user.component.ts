import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RoleUserAuthorize } from 'src/app/_core/_models/role-user-authorize';
import { User } from 'src/app/_core/_models/user';
import { AlertifyService } from 'src/app/_core/_services/alertify.service';
import { SweetAlertService } from 'src/app/_core/_services/sweet-alert.service';
import { UserService } from 'src/app/_core/_services/user.service';
import { Pagination, PaginationResult } from 'src/app/_core/_utility/pagination';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild('addUserModal') addUserModal: ModalDirective;
  @ViewChild('authorizeModal') authorizeModal: ModalDirective;
  users: User[];
  user: any = {};
  pagination: Pagination;
  text: string = '';
  searchKey: boolean = false;
  factories = ['SHC', 'CB', 'TSH', 'SPC'];
  roles: RoleUserAuthorize[] = [];
  flag: number = 0; // 0: Add; 1: Edit
  isAllRolesChecked: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private sweetAlert: SweetAlertService,
    private spinnerService: NgxSpinnerService,
    private alertifyService: AlertifyService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.spinnerService.show();
    this.route.data.subscribe(data => {
      this.users = data.users.result;
      this.pagination = data.users.pagination;
      this.spinnerService.hide();
    }, error => {
      console.log(error);
      this.spinnerService.hide();
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  searchUser() {
    if (this.text !== '') {
      this.searchKey = true;
      this.pagination.currentPage = 1;
      this.userService.searchUser(this.pagination.currentPage, this.pagination.pageSize, this.text)
        .subscribe((res: PaginationResult<User>) => {
          this.users = res.result;
          this.pagination = res.pagination;
        }, error => {
          console.log(error);
        });
    } else {
      this.searchKey = false;
      this.loadUsers();
    }
  }

  loadUsers() {
    if (this.searchKey === false) {
      this.userService.getUsers(this.pagination.currentPage, this.pagination.pageSize)
        .subscribe((res: PaginationResult<User>) => {
          this.users = res.result;
          this.pagination = res.pagination;
        }, error => {
          console.log(error);
        });
    } else {
      this.userService.searchUser(this.pagination.currentPage, this.pagination.pageSize, this.text)
        .subscribe((res: PaginationResult<User>) => {
          this.users = res.result;
          this.pagination = res.pagination;
        }, error => {
          console.log(error);
        });
    }
  }

  clearSearch() {
    this.pagination.currentPage = 1;
    this.text = '';
    this.searchKey = false;
    this.loadUsers();
  }

  addorEditUser() {
    if (!this.validate()) { return; }
    if (this.flag === 0) { // Case Add User
      this.spinnerService.show();
      this.userService.addUser(this.user).subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.sweetAlert.success('Success!', res.message);
          this.loadUsers();
          this.addUserModal.hide();
        } else {
          this.sweetAlert.error('Error!', res.message);
        }
      }, error => {
        console.log(error);
        this.spinnerService.hide();
      });
    } else { // Case Edit User
      this.spinnerService.show();
      this.userService.updateUser(this.user).subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.loadUsers();
          this.sweetAlert.success('Success!', res.message);
          this.addUserModal.hide();
        } else {
          this.sweetAlert.error('Error!', res.message);
        }
      }, error => {
        console.log(error);
        this.spinnerService.hide();
      });
    }
  }

  deleteUser(factoryID: string, userAccount: string) {
    this.sweetAlert.confirm('Delete User!', 'Are you sure you want to delete this record?', () => {
      // Prevent from deleting current user
      const currentUser: User = JSON.parse(localStorage.getItem('user'));
      if (factoryID === currentUser.factory_ID && userAccount === currentUser.user_Account) {
        this.sweetAlert.error('The current user cannot be deleted.');
      } else {
        // Execute delete user
        this.spinnerService.show();
        this.userService.deleteUser(factoryID, userAccount).subscribe(res => {
          this.spinnerService.hide();
          if (res.success) {
            this.loadUsers();
            this.sweetAlert.success('Deleted!', res.message);
          } else {
            this.sweetAlert.error('Error!', res.message);
          }
        }, error => {
          console.log(error);
          this.spinnerService.hide();
        });
      }
    });
  }

  setUser(user: User) {
    this.user = { ...user };
  }

  setFlag(flag: number) { // 0: Add; 1: Edit
    this.flag = flag;
  }

  resetUser() {
    this.user.factory_ID = this.factories[0];
    this.user.user_Account = '';
    this.user.user_Name = '';
    this.user.email = '';
    this.user.password = '';
  }

  setAuthorizeList() {
    this.spinnerService.show();
    this.userService.getRoleByUser(this.user.factory_ID, this.user.user_Account)
      .subscribe((roles: RoleUserAuthorize[]) => {
        this.roles = roles;
        this.checkIfAllRolesChecked();
        this.spinnerService.hide();
      }, error => {
        console.log(error);
        this.spinnerService.hide();
      });
  }

  handleRoleChanges(role: RoleUserAuthorize) {
    role.status = !role.status;
    this.checkIfAllRolesChecked();
  }

  handleAllRolesChanges() {
    this.isAllRolesChecked = !this.isAllRolesChecked;
    if (this.isAllRolesChecked) {
      this.roles.forEach(role => {
        role.status = true;
      });
    } else {
      this.roles.forEach(role => {
        role.status = false;
      });
    }
  }

  checkIfAllRolesChecked() {
    let isChecked = true;
    this.roles.forEach(role => {
      if (!role.status) {
        isChecked = false;
      }
    });
    if (isChecked) {
      this.isAllRolesChecked = true;
    } else {
      this.isAllRolesChecked = false;
    }
  }

  authorizeSave() {
    this.spinnerService.show();
    this.userService.saveUserRole(this.roles).subscribe(res => {
      this.spinnerService.hide();
      if (res.success) {
        this.sweetAlert.success('Success!', res.message);
        this.authorizeModal.hide();
        this.loadUsers();
      } else {
        this.sweetAlert.error('Oops!', res.message);
      }
    }, error => {
      console.log(error);
      this.spinnerService.hide();
    });
  }

  validate() {
    if (this.user.factory_ID === null || this.user.factory_ID.trim() === '') {
      this.alertifyService.error('Invalid Factory'); return false;
    }
    if (this.user.user_Account === null || this.user.user_Account.trim() === '') {
      this.alertifyService.error('Invalid User Account'); return false;
    }
    if (this.user.user_Name === null || this.user.user_Name.trim() === '') {
      this.alertifyService.error('Invalid User Name'); return false;
    }
    if (this.user.email === null || this.user.email.trim() === '') {
      this.alertifyService.error('Invalid Email'); return false;
    }

    this.user.factory_ID = this.user.factory_ID.trim();
    this.user.user_Account = this.user.user_Account.trim();
    this.user.user_Name = this.user.user_Name.trim();
    this.user.email = this.user.email.trim();

    return true;
  }
}
