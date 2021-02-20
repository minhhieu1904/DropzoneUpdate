import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { SnotifyPosition } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertUtilityService } from 'src/app/_core/_services/alert-utility.service';
import { ArticleCategoryService } from 'src/app/_core/_services/article-category.service';
import { ArticleService } from 'src/app/_core/_services/article.service';
import { UtilityService } from 'src/app/_core/_services/utility.service';
import { commonPerFactory } from 'src/environments/environment';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  article: any = {};
  flag = '0';
  articleCateList: Array<Select2OptionData>;
  fileImages: File[] = [];
  fileVideos: File[] = [];
  urlImage = commonPerFactory.imageArticleUrl;
  urlVideo = commonPerFactory.videoArticleUrl;
  listFileImage: string[] = [];
  listFileVideo: string[] = [];
  fileSize = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private articleCategoryService: ArticleCategoryService,
    private spinner: NgxSpinnerService,
    private alertUtility: AlertUtilityService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.articleService.currentArticle.subscribe(article => {
      this.article = article;

      if (this.article.fileImages != null)
        this.listFileImage = this.article.fileImages.split(';');

      // ***Here is the code for converting "String" to "File"
      this.utilityService.convertToFile(this.listFileImage, this.urlImage, this.fileImages);

      if (this.article.fileVideos != null)
        this.listFileVideo = this.article.fileVideos.split(';');

      // ***Here is the code for converting "String" to "File"
      this.utilityService.convertToFile(this.listFileVideo, this.urlVideo, this.fileVideos);
    }).unsubscribe();
    this.articleService.currentFlag.subscribe(flag => this.flag = flag).unsubscribe();
    if (this.flag === '0') {
      this.cancel();
    }
    if (this.flag === '1') {
      if (this.article.status === true)
        this.article.status = '1';
      else
        this.article.status = '0';
    }
    this.getArticleCateList();
  }

  backList() {
    this.router.navigate(['/article']);
  }

  saveAndNext() {
    this.checkStatus();
    this.articleService.create(this.article, this.fileImages, this.fileVideos).subscribe(res => {
      if (res.success) {
        this.alertUtility.success('Success!', res.message, SnotifyPosition.rightTop);
        this.cancel();
      }
      else {
        this.alertUtility.error('Error!', res.message, SnotifyPosition.rightTop);
      }
    },
      error => {
        console.log(error);
      });
  }

  save() {
    this.checkStatus();
    if (this.flag === '0') {
      this.articleService.create(this.article, this.fileImages, this.fileVideos).subscribe(res => {
        if (res.success) {
          this.alertUtility.success('Success!', res.message, SnotifyPosition.rightTop);
          this.backList();
        }
        else {
          this.alertUtility.error('Error!', res.message, SnotifyPosition.rightTop);
        }
      },
        error => {
          console.log(error);
        });
    }
    else {
      this.checkStatus();
      this.articleService.update(this.article, this.fileImages, this.fileVideos).subscribe(res => {
        if (res.success) {
          this.alertUtility.success('Success!', res.message, SnotifyPosition.rightTop);
          this.backList();
        }
        else {
          this.alertUtility.error('Error!', res.message, SnotifyPosition.rightTop);
        }
      },
        error => {
          console.log(error);
        });
    }
  }

  checkStatus() {
    if (this.article.status === '1')
      this.article.status = true;
    if (this.article.status === '0')
      this.article.status = false;
  }

  cancel() {
    this.article.article_Name = '';
    this.article.status = '1';
    this.article.content = '';
    this.article.link = '';
    this.article.alias = '';
  }

  getArticleCateList() {
    this.articleCategoryService.getIdAndName().subscribe(res => {
      this.articleCateList = res.map(item => {
        return { id: item.id, text: item.name };
      });
      if (res.length > 0 && this.flag === '0') {
        this.article.article_Cate_ID = this.articleCateList[0].id;
      }
    });
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
    this.fileVideos.splice(this.fileVideos.indexOf(event), 1);
  }
}
