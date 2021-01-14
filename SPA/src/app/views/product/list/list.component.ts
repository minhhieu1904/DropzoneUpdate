import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Product } from 'src/app/_core/_models/product';
import { AlertifyService } from 'src/app/_core/_services/alertify.service';
import { ProductCategoryService } from 'src/app/_core/_services/product-category.service';
import { ProductService } from 'src/app/_core/_services/product.service';
import { SweetAlertService } from 'src/app/_core/_services/sweet-alert.service';
import { Pagination, PaginationResult } from 'src/app/_core/_utility/pagination';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  products: Product[];
  product: any = {};
  text: string = '';
  flag: string = '0';
  pagination: Pagination;
  productCateList: Array<Select2OptionData>;
  productCateID: string = 'all';
  productList: Array<Select2OptionData>;
  product_Name: string = 'all';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private sweetAlert: SweetAlertService,
    private spinner: NgxSpinnerService,
    private alertify: AlertifyService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.products = data['products'].result;
      this.pagination = data['products'].pagination;
    });
    this.getDataPaginations();
    this.getProductCateList();
  }

  addNew() {
    this.productService.changeProduct(this.product);
    this.productService.changeFlag('0');
    this.router.navigate(['/product/add']);
  }

  edit(product: Product) {
    this.productService.changeProduct(product);
    this.productService.changeFlag('1');
    this.router.navigate(['/product/edit']);
  }

  getDataPaginations() {
    this.productService.getDataPaginations(this.pagination.currentPage, this.pagination.pageSize, this.text)
      .subscribe((res: PaginationResult<Product>) => {
        this.products = res.result;
        this.pagination = res.pagination;
      }), error => {
        this.alertify.error(error);
      };
  }

  searchDataPaginations() {
    this.productService.searchDataPaginations(this.pagination.currentPage, this.pagination.pageSize, this.productCateID, this.product_Name)
      .subscribe((res: PaginationResult<Product>) => {
        this.products = res.result;
        this.pagination = res.pagination;
      }), error => {
        this.alertify.error(error);
      };
  }

  changeNew(product: Product) {
    this.productService.changeNew(product).subscribe(res => {
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

  changeHotSale(product: Product) {
    this.productService.changeHotSale(product).subscribe(res => {
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

  changeIsSale(product: Product) {
    this.productService.changeIsSale(product).subscribe(res => {
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

  changeStatus(product: Product) {
    this.productService.changeStatus(product).subscribe(res => {
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

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.getDataPaginations();
  }

  getProductCateList() {
    this.productCategoryService.getIdAndName().subscribe(res => {
      this.productCateList = res.map(item => {
        return { id: item.id, text: item.name };
      });
      this.productCateList.unshift({ id: 'all', text: 'All' });
    });
  }

  getProductListByProductCateID() {
    this.productService.getProductListByProductCateID(this.productCateID).subscribe(res => {
      this.productList = res.map(item => {
        return { id: item.id, text: item.name };
      });
      this.productList.unshift({ id: 'all', text: 'All' });
    });
  }

  changeProductCateID(event) {
    this.productCateID = event;
    this.getProductListByProductCateID();
  }
}
