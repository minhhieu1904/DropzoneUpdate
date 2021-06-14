import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RoleUserAuthorize } from 'src/app/_core/_models/role-user-authorize';
import { User } from 'src/app/_core/_models/user';
import { UserService } from 'src/app/_core/_services/user.service';
import { Pagination, PaginationResult } from 'src/app/_core/_utility/pagination';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AlertUtilityService } from 'src/app/_core/_services/alert-utility.service';
import { SnotifyPosition } from 'ng-snotify';
import { FormBuilder } from '@angular/forms';
import { commonPerFactory } from 'src/app/_core/_utility/common-fer-factory';
import { DestroyService } from 'src/app/_core/_services/destroy.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [DestroyService]
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
  imageUserUrl = commonPerFactory.imageUserUrl;
  imageUser: any = '';
  registrationForm = this.fb.group({
    file: [null]
  });
  editFile: boolean = true;
  removeUpload: boolean = false;
  file: File;
  currentUser: User = JSON.parse(localStorage.getItem('user'));

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private spinnerService: NgxSpinnerService,
    private alertUtility: AlertUtilityService,
    public fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private destroyService: DestroyService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.spinnerService.show();
    this.route.data.pipe(takeUntil(this.destroyService.destroys$)).subscribe(data => {
      this.users = data.users.result;
      this.pagination = data.users.pagination;
      this.spinnerService.hide();
    }, error => {
      console.log(error);
      this.spinnerService.hide();
    });
  }

  loadUserUpdate(): void {
    this.spinnerService.show();
    this.userService.getUsers(this.pagination.currentPage, this.pagination.pageSize)
      .pipe(takeUntil(this.destroyService.destroys$))
      .subscribe((res: PaginationResult<User>) => {
        this.users = res.result;
        this.pagination = res.pagination;
        let user = this.users.find(x => x.factory_ID === this.currentUser.factory_ID && x.user_Account === this.currentUser.user_Account);
        this.resetLocalStore(user);
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
        .pipe(takeUntil(this.destroyService.destroys$))
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
        .pipe(takeUntil(this.destroyService.destroys$))
        .subscribe((res: PaginationResult<User>) => {
          this.users = res.result;
          this.pagination = res.pagination;
        }, error => {
          console.log(error);
        });
    } else {
      this.userService.searchUser(this.pagination.currentPage, this.pagination.pageSize, this.text)
        .pipe(takeUntil(this.destroyService.destroys$))
        .subscribe((res: PaginationResult<User>) => {
          this.users = res.result;
          this.pagination = res.pagination;
        }, error => {
          console.log(error);
        });
    }
  }

  resetLocalStore(user: any) {
    this.currentUser.image = user.image;
    localStorage.removeItem('user');
    localStorage.setItem('user', JSON.stringify(this.currentUser));
    setInterval(() => {
      location.reload();
    }, 4000);
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
      this.userService.addUser(this.user, this.file)
        .pipe(takeUntil(this.destroyService.destroys$))
        .subscribe(res => {
          this.spinnerService.hide();
          if (res.success) {
            this.alertUtility.success('Success!', res.message);
            this.loadUsers();
            this.addUserModal.hide();
          } else {
            this.alertUtility.error('Error!', res.message);
          }
        }, error => {
          console.log(error);
          this.spinnerService.hide();
        });
    } else { // Case Edit User
      this.spinnerService.show();
      if (this.user.password === undefined)
        this.user.password = null;
      if (this.file === undefined)
        this.file = null;
      this.userService.updateUser(this.user, this.file)
        .pipe(takeUntil(this.destroyService.destroys$))
        .subscribe(res => {
          this.spinnerService.hide();
          if (this.user.factory_ID === this.currentUser.factory_ID && this.user.user_Account === this.currentUser.user_Account) {
            this.alertUtility.warning('Wating', 'User updating, please wating page reload');
            this.loadUserUpdate();
          }
          else if (res.success) {
            this.loadUsers();
            this.alertUtility.success('Success!', res.message);
            this.addUserModal.hide();
          } else {
            this.alertUtility.error('Error!', res.message);
          }
        }, error => {
          console.log(error);
          this.spinnerService.hide();
        });
    }
  }

  deleteUser(factoryID: string, userAccount: string) {
    this.alertUtility.confirmDelete("Are you sure you want to delete account '" + userAccount.toUpperCase() + "' ?", SnotifyPosition.rightCenter, () => {
      // Prevent from deleting current user
      const currentUser: User = JSON.parse(localStorage.getItem('user'));
      if (factoryID === currentUser.factory_ID && userAccount === currentUser.user_Account) {
        this.alertUtility.error('Error!', 'The current user cannot be deleted.');
      } else {
        // Execute delete user
        this.spinnerService.show();
        this.userService.deleteUser(factoryID, userAccount)
          .pipe(takeUntil(this.destroyService.destroys$))
          .subscribe(res => {
            this.spinnerService.hide();
            if (res.success) {
              this.loadUsers();
              this.alertUtility.success('Deleted!', res.message);
            } else {
              this.alertUtility.error('Error!', res.message);
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
    this.imageUser = user.image !== null ? this.imageUserUrl + user.image
      : commonPerFactory.imageUserDefault;
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
    this.user.image = null;
    this.imageUser = commonPerFactory.imageUserDefault;
  }

  setAuthorizeList() {
    this.spinnerService.show();
    this.userService.getRoleByUser(this.user.factory_ID, this.user.user_Account)
      .pipe(takeUntil(this.destroyService.destroys$))
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
    this.userService.saveUserRole(this.roles)
      .pipe(takeUntil(this.destroyService.destroys$))
      .subscribe(res => {
        this.spinnerService.hide();
        if (res.success) {
          this.alertUtility.success('Success!', res.message);
          this.authorizeModal.hide();
          this.loadUsers();
        } else {
          this.alertUtility.error('Oops!', res.message);
        }
      }, error => {
        console.log(error);
        this.spinnerService.hide();
      });
  }

  validate() {
    if (this.user.factory_ID === null || this.user.factory_ID.trim() === '') {
      this.alertUtility.error('Error!', 'Invalid Factory'); return false;
    }
    if (this.user.user_Account === null || this.user.user_Account.trim() === '') {
      this.alertUtility.error('Error!', 'Invalid User Account'); return false;
    }
    if (this.user.user_Name === null || this.user.user_Name.trim() === '') {
      this.alertUtility.error('Error!', 'Invalid User Name'); return false;
    }
    if (this.user.email === null || this.user.email.trim() === '') {
      this.alertUtility.error('Error!', 'Invalid Email'); return false;
    }

    this.user.factory_ID = this.user.factory_ID.trim();
    this.user.user_Account = this.user.user_Account.trim();
    this.user.user_Name = this.user.user_Name.trim();
    this.user.email = this.user.email.trim();

    return true;
  }

  uploadFile(event) {
    this.file = event.target.files[0];
    let reader = new FileReader(); // HTML5 FileReader API
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(this.file);

      //When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUser = reader.result;
        this.registrationForm.patchValue({
          file: reader.result
        });
        this.editFile = false;
        this.removeUpload = true;
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }

  // Function to remove uploaded file
  removeUploadedFile() {
    if (this.user.image === undefined)
      this.user.image = null;
    this.imageUser = this.user.image !== null ? this.imageUserUrl + this.user.image
                                              : commonPerFactory.imageUserDefault;
    this.editFile = true;
    this.removeUpload = false;
    this.registrationForm.patchValue({
      file: [null]
    });
  }
}
