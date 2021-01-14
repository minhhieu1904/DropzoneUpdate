import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductCategory } from 'src/app/_core/_models/product-category';
import { AlertifyService } from 'src/app/_core/_services/alertify.service';
import { ProductCategoryService } from 'src/app/_core/_services/product-category.service';
import { SweetAlertService } from 'src/app/_core/_services/sweet-alert.service';
import { Pagination, PaginationResult } from 'src/app/_core/_utility/pagination';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild('addProductCateModal') addUserModal: ModalDirective;
  productCates: ProductCategory[];
  productCate: any = {};
  pagination: Pagination;
  text: string = '';
  flag: number = 0;
  constructor(
    private route: ActivatedRoute,
    private productCateService: ProductCategoryService,
    private sweetAlert: SweetAlertService,
    private spinner: NgxSpinnerService,
    private alertify: AlertifyService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.productCates = data['productCates'].result;
      this.pagination = data['productCates'].pagination;
    });
    this.getDataPaginations();
  }

  save() {
    if (this.flag === 0) {
      this.productCateService.create(this.productCate).subscribe(res => {
        debugger
        if (res.success) {
          this.sweetAlert.success('Success!', res.message);
          this.getDataPaginations();
        } else {
          this.sweetAlert.error('Error!', res.message);
        }
      },
        error => {
          console.log(error);
        }
      );
    } else {
      this.productCateService.update(this.productCate).subscribe(res => {
        if (res.success) {
          this.sweetAlert.success('Success!', res.message);
          this.getDataPaginations();
        } else {
          this.sweetAlert.error('Error!', res.message);
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
        this.sweetAlert.success('Success!', res.message);
        this.getDataPaginations();
      } else {
        this.sweetAlert.error('Error!', res.message);
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
        this.alertify.error(error);
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
}
