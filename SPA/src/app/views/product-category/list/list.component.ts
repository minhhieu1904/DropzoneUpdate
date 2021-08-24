import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SnotifyPosition } from 'ng-snotify';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeUntil } from 'rxjs/operators';
import { MailContent } from 'src/app/_core/_models/mailContent';
import { ProductCategory } from 'src/app/_core/_models/product-category';
import { AlertUtilityService } from 'src/app/_core/_services/alert-utility.service';
import { DestroyService } from 'src/app/_core/_services/destroy.service';
import { ProductCategoryService } from 'src/app/_core/_services/product-category.service';
import { SignalRService } from 'src/app/_core/_services/signal-r.service';
import { Pagination, PaginationResult } from 'src/app/_core/_utility/pagination';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [DestroyService]
})
export class ListComponent implements OnInit {
  @ViewChild('addProductCateModal') addUserModal: ModalDirective;
  productCates: ProductCategory[];
  productCateAll: ProductCategory[];
  productCate: any = {};
  pagination: Pagination;
  text: string = '';
  flag: number = 0;
  mailContent: MailContent;
  curentPage: number;
  checkboxAll: boolean = false;
  listProductCate: ProductCategory[] = [];

  fileImportExcel: File = null;
  constructor(
    private route: ActivatedRoute,
    private productCateService: ProductCategoryService,
    private spinner: NgxSpinnerService,
    private alertUtility: AlertUtilityService,
    private signalRService: SignalRService,
    private destroyService: DestroyService
  ) { }

  ngOnInit() {
    this.route.data.pipe(takeUntil(this.destroyService.destroys$)).subscribe(data => {
      this.productCateAll = data['productCates'].result;
      this.pagination = data['productCates'].pagination;
      this.productCates = this.productCateAll.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.pageSize * this.pagination.currentPage);
    });
    this.signalRService.startConnection();
    if (this.signalRService.hubConnection) {
      this.signalRService.hubConnection.on('LoadDataProductCate', () => {
        this.getDataPaginations();
      });
    }
  }

  save() {
    if (this.flag === 0) {
      this.productCateService.create(this.productCate)
        .pipe(takeUntil(this.destroyService.destroys$))
        .subscribe(res => {
          if (res.success) {
            this.alertUtility.success('Success!', res.message);
            this.getDataPaginations();
          } else {
            this.alertUtility.error('Error!', res.message);
          }
        },
          error => {
            console.log(error);
          }
        );
    } else {
      this.productCateService.update(this.productCate)
        .pipe(takeUntil(this.destroyService.destroys$))
        .subscribe(res => {
          if (res.success) {
            this.alertUtility.success('Success!', res.message);
            this.getDataPaginations();
          } else {
            this.alertUtility.error('Error!', res.message);
          }
        },
          error => {
            console.log(error);
          }
        );
    }
  }

  changeStatus(productCate: ProductCategory) {
    this.productCateService.changeStatus(productCate)
      .pipe(takeUntil(this.destroyService.destroys$))
      .subscribe(res => {
        if (res.success) {
          this.alertUtility.success('Success!', res.message);
          this.getDataPaginations();
        } else {
          this.alertUtility.error('Error!', res.message);
        }
      },
        error => {
          console.log(error);
        }
      );
  }

  getDataPaginations() {
    this.productCateService.getDataPaginations(this.pagination.currentPage, this.pagination.pageSize, this.text)
      .pipe(takeUntil(this.destroyService.destroys$))
      .subscribe((res: PaginationResult<ProductCategory>) => {
        this.productCateAll = res.result;
        this.pagination = res.pagination;
        this.productCates = this.productCateAll.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.pageSize * this.pagination.currentPage);
        this.checkboxAll = false;
      }), error => {
        this.alertUtility.error('Error!', error);
      };
  }

  edit(productCate: ProductCategory) {
    this.productCate = { ...productCate };
  }

  cancel() {
    if (this.flag === 0) {
      this.productCate = {};
    }
  }

  setFlag(flag: number) { // 0: Add; 1: Edit
    this.flag = flag;
    this.cancel();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.productCates = this.productCateAll.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.pageSize * this.pagination.currentPage);
  }

  setPageCurrent() {
    this.pagination.currentPage = this.curentPage;
  }

  remove(productCategory: ProductCategory) {
    this.listProductCate.push(productCategory);
    this.checkDelete(this.listProductCate, "Are you sure delete item " + "'" + productCategory.product_Cate_ID + "'" + " ?");
  }

  removeMulti() {
    const productCates = this.productCateAll.filter(item => {
      return item.checked === true;
    });
    if (productCates.length === 0) {
      return this.alertUtility.error('Error', 'Please choose item to delete');
    }
    this.checkDelete(productCates, "Are you sure delete " + productCates.length + " items?");
  }

  checkDelete(listProductCate: ProductCategory[], alert: string) {
    this.alertUtility.confirmDelete(alert, SnotifyPosition.rightCenter, () => {
      this.productCateService.remove(listProductCate)
        .pipe(takeUntil(this.destroyService.destroys$))
        .subscribe(res => {
          if (res.success) {
            this.alertUtility.success('Success!', res.message);
            this.listProductCate = [];
            this.text = '';
            this.getDataPaginations();
          }
          else {
            this.alertUtility.error('Error!', res.message);
          }
        },
          error => {
            console.log(error);
          });
    });
  }

  success() {
    this.alertUtility.asyncLoadingSuccess('Success!', 'Success');
  }

  error() {
    this.alertUtility.asyncLoadingError('Error!', 'Error');
  }

  html() {
    this.alertUtility.htmlAnimation('Test', 'Try me', SnotifyPosition.centerCenter, 'error', { enter: 'animate__bounceInLeft2', exit: 'animate__bounceInLeft2', time: 10000 });
  }

  sendMail() {
    this.mailContent = {
      to: 'exemple@gmail.com',
      subject: 'Test',
      body: '<p><strong>Say hello me!!!</strong></p>'
    };
    this.productCateService.sendMailKit(this.mailContent)
      .pipe(takeUntil(this.destroyService.destroys$))
      .subscribe(res => {
        if (res.success) {
          this.alertUtility.asyncLoadingSuccess('Success!', res.message, SnotifyPosition.centerCenter);
        }
        else {
          this.alertUtility.asyncLoadingError('Error!', res.message, SnotifyPosition.centerCenter);
        }
      });
  }

  import() {
    if (this.fileImportExcel === null) {
      this.alertUtility.warning('Warning', 'Please choose file upload!', SnotifyPosition.centerTop);
      return;
    }

    this.alertUtility.confirmDelete('Are you sure import file?', SnotifyPosition.centerCenter, () => {
      this.productCateService.importExcel(this.fileImportExcel)
        .pipe(takeUntil(this.destroyService.destroys$))
        .subscribe((res) => {
          if (res.success) {
            this.alertUtility.success('Success!', 'Import file successfuly');
          } else {
            this.alertUtility.error('Error!', 'Import file failse');
          }
          this.onRemoveFile();
          this.getDataPaginations();
        }, error => {
          this.alertUtility.error('Error', 'Upload Data Fail!');
        });
    });
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url
      const file = event.target.files[0];
      // check file name extension
      const fileNameExtension = event.target.files[0].name.split('.').pop();
      if (fileNameExtension != 'xlsx' && fileNameExtension != 'xlsm') {
        this.alertUtility.warning('Warning', "Please select a file '.xlsx' or '.xls'", SnotifyPosition.centerCenter);
        return;
      }

      this.fileImportExcel = file;
    }
  }

  onRemoveFile() {
    (<HTMLInputElement>document.getElementById("input_uploadFile")).value = null;
    this.fileImportExcel = null;
  }

  export() {
    if (this.productCateAll.length > 0 && this.productCates.length > 0)
      return this.productCateService.export(this.pagination.currentPage, this.pagination.pageSize, this.text);
    else
      return this.alertUtility.warning('Warning', 'No data');
  }

  exportAspose(checkExport: number) {
    if (this.productCateAll.length > 0 && this.productCates.length > 0)
      return this.productCateService.exportAspose(this.pagination.currentPage, this.pagination.pageSize, this.text, checkExport);
    else
      return this.alertUtility.warning('Warning', 'No data');
  }

  downloadExcelTemplate() {
    window.location.href = '../../../../assets/fileExcelTemplate/product_category.xlsx';
  }

  checkAll(e) {
    if (e.target.checked) {
      this.productCateAll.forEach(element => {
        element.checked = true;
      });
    }
    else {
      this.productCateAll.forEach(element => {
        element.checked = false;
      });
    }
  }

  checkElement() {
    let countProductCateCheckBox = this.productCateAll.filter(x => x.checked !== true).length;
    if (countProductCateCheckBox === 0) {
      this.checkboxAll = true;
    } else {
      this.checkboxAll = false;
    }
  }
}
