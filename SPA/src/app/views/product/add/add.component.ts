import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { SnotifyPosition } from 'ng-snotify';
import { Product } from 'src/app/_core/_models/product';
import { ProductCategory } from 'src/app/_core/_models/product-category';
import { AlertUtilityService } from 'src/app/_core/_services/alert-utility.service';
import { ProductCategoryService } from 'src/app/_core/_services/product-category.service';
import { ProductService } from 'src/app/_core/_services/product.service';
import { UtilityService } from 'src/app/_core/_services/utility.service';
import { commonPerFactory } from 'src/environments/environment';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
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
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.productService.currentProduct.subscribe(product => {
      this.product = product;
      if (this.product.from_Date_Sale !== null)
        this.product.from_Date_Sale = new Date(this.product.from_Date_Sale);
      if (this.product.to_Date_Sale !== null)
        this.product.to_Date_Sale = new Date(this.product.to_Date_Sale);
      if (this.product.fileImages != null)
        this.listFileImage = this.product.fileImages.split(';');

      // ***Here is the code for converting "String" to "File"
      this.utilityService.convertToFile(this.listFileImage, this.urlImage, this.fileImages);

      if (this.product.fileVideos != null)
        this.listFileVideo = this.product.fileVideos.split(';');

      // ***Here is the code for converting "String" to "File"
      this.utilityService.convertToFile(this.listFileVideo, this.urlVideo, this.fileVideos);
    }).unsubscribe();
    this.productService.currentFlag.subscribe(flag => this.flag = flag).unsubscribe();
    if (this.flag === '0') {
      this.cancel();
    }
    if (this.flag === '1') {
      if (this.product.new === true)
        this.product.new = '1';
      else
        this.product.new = '0';

      if (this.product.hot_Sale === true)
        this.product.hot_Sale = '1';
      else
        this.product.hot_Sale = '0';

      if (this.product.isSale === true)
        this.product.isSale = '1';
      else
        this.product.isSale = '0';

      if (this.product.status === true)
        this.product.status = '1';
      else
        this.product.status = '0';
    }
    this.getProductCateList();
  }

  backList() {
    this.router.navigate(['/product/list']);
  }

  saveAndNext() {
    this.checkNew();
    this.checkHotSale();
    this.checkIsSale();
    this.checkStatus();
    this.productService.create(this.product, this.fileImages, this.fileVideos).subscribe(res => {
      if (res.success) {
        this.alertUtility.success('Success!', res.message);
        this.cancel();
      }
      else {
        this.alertUtility.error('Error!', res.message);
      }
    },
      error => {
        console.log(error);
      });
  }

  save() {
    this.checkNew();
    this.checkHotSale();
    this.checkIsSale();
    this.checkStatus();
    if (this.flag === '0') {
      this.productService.create(this.product, this.fileImages, this.fileVideos).subscribe(res => {
        if (res.success) {
          this.alertUtility.success('Success!', res.message);
          this.backList();
        }
        else {
          this.alertUtility.error('Error!', res.message);
        }
      },
        error => {
          console.log(error);
        });
    }
    else {
      this.productService.update(this.product, this.fileImages, this.fileVideos).subscribe(res => {
        if (res.success) {
          this.alertUtility.success('Success!', res.message);
          this.backList();
        }
        else {
          this.alertUtility.error('Error!', res.message);
        }
      },
        error => {
          console.log(error);
        });
    }
  }

  checkNew() {
    if (this.product.new === '1')
      this.product.new = true;
    if (this.product.new === '0')
      this.product.new = false;
  }

  checkHotSale() {
    if (this.product.hot_Sale === '1')
      this.product.hot_Sale = true;
    if (this.product.hot_Sale === '0')
      this.product.hot_Sale = false;
  }

  checkIsSale() {
    if (this.product.isSale === '1')
      this.product.isSale = true;
    if (this.product.isSale === '0')
      this.product.isSale = false;
  }

  checkStatus() {
    if (this.product.status === '1')
      this.product.status = true;
    if (this.product.status === '0')
      this.product.status = false;
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
    this.productCategoryService.getIdAndName().subscribe(res => {
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
      this.alertUtility.warning('Error', 'Please select file images', SnotifyPosition.rightCenter);
      return;
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
    debugger
    // Kiểm tra rejectedFiles ( file không hợp lệ )
    if (event.rejectedFiles && event.rejectedFiles[0]) {
      this.alertUtility.warning('Error', 'Please select file videos', SnotifyPosition.rightCenter);
      return;
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
    debugger
    this.fileVideos.splice(this.fileVideos.indexOf(event), 1);
    let a = event;
  }

  exportAspose(checkExport: number) {
    return this.productService.exportAspose(this.product.product_Cate_ID, this.product.product_ID, checkExport);
  }
}
