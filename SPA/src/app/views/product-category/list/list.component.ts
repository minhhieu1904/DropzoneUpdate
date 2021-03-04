import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SnotifyPosition } from 'ng-snotify';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { MailContent } from 'src/app/_core/_models/mailContent';
import { ProductCategory } from 'src/app/_core/_models/product-category';
import { AlertUtilityService } from 'src/app/_core/_services/alert-utility.service';
import { ProductCategoryService } from 'src/app/_core/_services/product-category.service';
import { Pagination, PaginationResult } from 'src/app/_core/_utility/pagination';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
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

  fileImportExcel: any = null;
  files: File[] = [];
  removed: EventEmitter<any> = new EventEmitter();
  constructor(
    private route: ActivatedRoute,
    private productCateService: ProductCategoryService,
    private spinner: NgxSpinnerService,
    private alertUtility: AlertUtilityService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.productCates = data['productCates'].result;
      this.pagination = data['productCates'].pagination;
    });
    this.getDataPaginations();
    this.getDataAll();
  }

  save() {
    if (this.flag === 0) {
      this.productCateService.create(this.productCate).subscribe(res => {
        if (res.success) {
          this.alertUtility.success('Success!', res.message, SnotifyPosition.rightTop);
          this.getDataPaginations();
        } else {
          this.alertUtility.error('Error!', res.message, SnotifyPosition.rightTop);
        }
      },
        error => {
          console.log(error);
        }
      );
    } else {
      this.productCateService.update(this.productCate).subscribe(res => {
        if (res.success) {
          this.alertUtility.success('Success!', res.message, SnotifyPosition.rightTop);
          this.getDataPaginations();
        } else {
          this.alertUtility.error('Error!', res.message, SnotifyPosition.rightTop);
        }
      },
        error => {
          console.log(error);
        }
      );
    }
  }

  changeStatus(productCate: ProductCategory) {
    this.productCateService.changeStatus(productCate).subscribe(res => {
      if (res.success) {
        this.alertUtility.success('Success!', res.message, SnotifyPosition.rightTop);
        this.getDataPaginations();
      } else {
        this.alertUtility.error('Error!', res.message, SnotifyPosition.rightTop);
      }
    },
      error => {
        console.log(error);
      }
    );
  }

  getDataPaginations() {
    this.productCateService.getDataPaginations(this.pagination.currentPage, this.pagination.pageSize, this.text)
      .subscribe((res: PaginationResult<ProductCategory>) => {
        this.productCates = res.result;
        this.pagination = res.pagination;
      }), error => {
        this.alertUtility.error('Error!', error, SnotifyPosition.rightTop);
      };
  }

  getDataAll() {
    this.productCateService.getDataAll(this.pagination.currentPage, this.pagination.pageSize, this.text)
      .subscribe((res: PaginationResult<ProductCategory>) => {
        this.productCateAll = res.result;
        this.pagination = res.pagination;
      }), error => {
        this.alertUtility.error('Error!', error, SnotifyPosition.rightTop);
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
    this.getDataPaginations();
  }

  remove(productCategory: ProductCategory) {
    this.alertUtility.confirmDelete("Are you sure delete item '" + productCategory.product_Cate_ID + "' ?", SnotifyPosition.rightCenter, () => {
      this.productCateService.remove(productCategory).subscribe(res => {
        if (res.success) {
          this.alertUtility.success('Success!', res.message, SnotifyPosition.rightTop);
          this.getDataPaginations();
        }
        else {
          this.alertUtility.error('Error!', res.message, SnotifyPosition.rightTop);
        }
      },
        error => {
          console.log(error);
        });
    });
  }

  success() {
    this.alertUtility.asyncLoadingSuccess('Success!', 'Success', SnotifyPosition.rightTop);
  }

  error() {
    this.alertUtility.asyncLoadingError('Error!', 'Error', SnotifyPosition.rightTop);
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
    this.productCateService.sendMailKit(this.mailContent).subscribe(res => {
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
      this.productCateService.importExcel(this.fileImportExcel).subscribe((res) => {
        if (res.success) {
          this.alertUtility.success('Success!', 'Import file successfuly', SnotifyPosition.rightTop);
        } else {
          this.alertUtility.error('Error!', 'Import file failse', SnotifyPosition.rightTop);
        }
        this.getDataPaginations();
      }, error => {
        this.alertUtility.error('Error', 'Upload Data Fail!', SnotifyPosition.rightTop);
      });
    });
  }

  onSelectFile(event, number) {
    debugger
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url
      this.fileImportExcel = event.target.files[0];
      // check file name extension
      const fileNameExtension = event.target.files[0].name.split('.').pop();
      if (fileNameExtension != 'xlsx' && fileNameExtension != 'xlsm') {
        this.alertUtility.warning('Warning', "Please select a file '.xlsx' or '.xls'", SnotifyPosition.centerCenter);
        return;
      }

      this.files.push(this.fileImportExcel);
    }
  }

  onRemoveFile(event) {
    debugger
    this.files.splice(this.files.indexOf(event, 1));
    this.removed.emit(this.fileImportExcel);
  }

  export() {
    return this.productCateService.export(this.pagination.currentPage, this.pagination.pageSize, this.text);
  }

  exportAspose(checkExport: number) {
    return this.productCateService.exportAspose(this.pagination.currentPage, this.pagination.pageSize, this.text, checkExport);
  }

  exportPdfAspose(checkExport: number) {
    return this.productCateService.exportAspose(this.pagination.currentPage, this.pagination.pageSize, this.text, checkExport);
  }

  downloadExcelTemplate() {
    window.location.href = '../../../../assets/fileExcelTemplate/product_category.xlsx';
  }
}
