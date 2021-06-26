import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { SnotifyPosition } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeUntil } from 'rxjs/operators';
import { AlertUtilityService } from 'src/app/_core/_services/alert-utility.service';
import { DestroyService } from 'src/app/_core/_services/destroy.service';
import { ProductCategoryService } from 'src/app/_core/_services/product-category.service';
import { ProductService } from 'src/app/_core/_services/product.service';
import { UtilityService } from 'src/app/_core/_services/utility.service';
import { commonPerFactory } from 'src/app/_core/_utility/common-fer-factory';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  providers: [DestroyService]
})
export class AddComponent implements OnInit {
  product: any = {};
  flag = '0';
  productCateList: Array<Select2OptionData>;
  fileImages: File[] = [];
  fileVideos: File[] = [];
  urlImage = commonPerFactory.imageProductUrl;
  urlVideo = commonPerFactory.videoProductUrl;
  listFileImage: string[] = [];
  listFileVideo: string[] = [];
  fileSize = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private alertUtility: AlertUtilityService,
    private utilityService: UtilityService,
    private destroyService: DestroyService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.productService.currentProduct
      .pipe(takeUntil(this.destroyService.destroys$))
      .subscribe(product => {
        this.product = product;
        if (this.product.from_Date_Sale !== null)
          this.product.from_Date_Sale = new Date(this.product.from_Date_Sale);
        if (this.product.to_Date_Sale !== null)
          this.product.to_Date_Sale = new Date(this.product.to_Date_Sale);
        if (this.product.fileImages != null)
        {
          this.listFileImage = this.product.fileImages.split(';');
          // ***Here is the code for converting "String" to "File"
          this.utilityService.convertToFile(this.listFileImage, this.urlImage, this.fileImages);
        }

        if (this.product.fileVideos != null)
        {
          this.listFileVideo = this.product.fileVideos.split(';');
          // ***Here is the code for converting "String" to "File"
          this.utilityService.convertToFile(this.listFileVideo, this.urlVideo, this.fileVideos);
        }

      });
    this.productService.currentFlag.pipe(takeUntil(this.destroyService.destroys$)).subscribe(flag => this.flag = flag);
    if (this.flag === '0') {
      this.cancel();
    }
    if (this.flag === '1') {
      this.product.new = this.product.new === true ? '1' : '0';
      this.product.hot_Sale = this.product.new === true ? '1' : '0';
      this.product.isSale = this.product.new === true ? '1' : '0';
      this.product.status = this.product.new === true ? '1' : '0';
    }
    this.getProductCateList();
  }

  backList() {
    this.router.navigate(['/product/list']);
  }

  saveAndNext() {
    this.spinner.show();
    this.product.new = this.product.new === '1' ? true : false;
    this.product.hot_Sale = this.product.new === '1' ? true : false;
    this.product.isSale = this.product.new === '1' ? true : false;
    this.product.status = this.product.new === '1' ? true : false;
    this.productService.create(this.product, this.fileImages, this.fileVideos)
      .pipe(takeUntil(this.destroyService.destroys$))
      .subscribe(res => {
        if (res.success) {
          this.alertUtility.success('Success!', res.message);
          this.cancel();
          this.spinner.hide();
        }
        else {
          this.alertUtility.error('Error!', res.message);
          this.spinner.hide();
        }
      },
        error => {
          console.log(error);
          this.spinner.hide();
        });
  }

  save() {
    this.spinner.show();
    this.product.new = this.product.new === '1' ? true : false;
    this.product.hot_Sale = this.product.new === '1' ? true : false;
    this.product.isSale = this.product.new === '1' ? true : false;
    this.product.status = this.product.new === '1' ? true : false;
    if (this.flag === '0') {
      this.productService.create(this.product, this.fileImages, this.fileVideos)
        .pipe(takeUntil(this.destroyService.destroys$))
        .subscribe(res => {
          if (res.success) {
            this.alertUtility.success('Success!', res.message);
            this.backList();
            this.spinner.hide();
          }
          else {
            this.alertUtility.error('Error!', res.message);
            this.spinner.hide();
          }
        },
          error => {
            console.log(error);
            this.spinner.hide();
          });
    }
    else {
      this.productService.update(this.product, this.fileImages, this.fileVideos)
        .pipe(takeUntil(this.destroyService.destroys$))
        .subscribe(res => {
          if (res.success) {
            this.alertUtility.success('Success!', res.message);
            this.backList();
            this.spinner.hide();
          }
          else {
            this.alertUtility.error('Error!', res.message);
            this.spinner.hide();
          }
        },
          error => {
            console.log(error);
            this.spinner.hide();
          });
    }
  }

  cancel() {
    this.product.product_Name = this.product.content = this.product.from_Date_Sale = this.product.to_Date_Sale = null;
    this.product.new = this.product.hot_Sale = this.product.isSale = '0';
    this.product.status = '1';
    this.product.price = this.product.discount = this.product.time_Sale = this.product.amount = 0;
    this.fileImages = [];
    this.fileVideos = [];
  }

  getProductCateList() {
    this.productCategoryService.getIdAndName()
      .pipe(takeUntil(this.destroyService.destroys$)).subscribe(res => {
        this.productCateList = res.map(item => {
          return { id: item.id, text: item.name };
        });
        if (res.length > 0 && this.flag === '0') {
          this.product.product_Cate_ID = this.productCateList[0].id;
        }
      });
  }

  changeIsSale(event) {
    this.product.isSale = event;
    this.clearTimeAndDaySale();
  }

  clearTimeAndDaySale() {
    this.product.time_Sale = 0;
    this.product.from_Date_Sale = this.product.to_Date_Sale = null;
  }

  // Dropzone import multi file images or videos
  onSelectImages(event) {
    // Kiểm tra rejectedFiles ( file không hợp lệ )
    if (event.rejectedFiles && event.rejectedFiles[0]) {
      return this.alertUtility.warning('Error', 'Please select file images', SnotifyPosition.rightCenter);
    }

    // Kiểm tra tổng dung lượng của tất cả file import
    // if (event.addedFiles && event.addedFiles[0]) {
    //   event.addedFiles.forEach(element => {
    //     this.fileSize += element.size;
    //   });
    //   if (this.fileSize > 8388608) {
    //     this.alertUtility.warning('Error', 'Sum all image file size upload can't more than 8MB');
    //     return;
    //   }
    // }

    this.fileImages.push(...event.addedFiles);
  }

  onRemoveImages(event) {
    this.fileImages.splice(this.fileImages.indexOf(event), 1);
  }

  onSelectVideos(event) {
    // Kiểm tra rejectedFiles ( file không hợp lệ )
    if (event.rejectedFiles && event.rejectedFiles[0]) {
      return this.alertUtility.warning('Error', 'Please select file videos', SnotifyPosition.rightCenter);
    }

    // Kiểm tra tổng dung lượng của tất cả file import
    // if (event.addedFiles && event.addedFiles[0]) {
    //   event.addedFiles.forEach(element => {
    //     this.fileSize += element.size;
    //   });
    //   if (this.fileSize > 20971520) {
    //     this.alertUtility.warning('Error', 'Sum all video file size upload can't more than 20MB');
    //     return;
    //   }
    // }

    this.fileVideos.push(...event.addedFiles);
  }

  onRemoveVideos(event) {
    this.fileVideos.splice(this.fileVideos.indexOf(event), 1);
  }

  exportAspose(checkExport: number) {
    this.spinner.show();
    return this.productService.exportAspose(this.product.product_Cate_ID, this.product.product_ID, checkExport);
  }
}
