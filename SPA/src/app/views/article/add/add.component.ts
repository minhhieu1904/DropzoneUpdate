import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService } from 'src/app/_core/_services/alertify.service';
import { ArticleCategoryService } from 'src/app/_core/_services/article-category.service';
import { ArticleService } from 'src/app/_core/_services/article.service';
import { SweetAlertService } from 'src/app/_core/_services/sweet-alert.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  article: any = {};
  flag = '0';
  articleCateList: Array<Select2OptionData>;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private articleCategoryService: ArticleCategoryService,
    private sweetAlert: SweetAlertService,
    private spinner: NgxSpinnerService,
    private alertify: AlertifyService
  ) { }

  ngOnInit() {
    this.articleService.currentArticle.subscribe(article => this.article = article).unsubscribe();
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
    this.articleService.create(this.article).subscribe(res => {
      if (res.success) {
        this.sweetAlert.success('Success!', res.message);
        this.cancel();
      }
      else {
        this.sweetAlert.error('Error!', res.message);
      }
    },
      error => {
        console.log(error);
      });
  }

  save() {
    this.checkStatus();
    if (this.flag === '0') {
      this.articleService.create(this.article).subscribe(res => {
        if (res.success) {
          this.sweetAlert.success('Success!', res.message);
          this.backList();
        }
        else {
          this.sweetAlert.error('Error!', res.message);
        }
      },
        error => {
          console.log(error);
        });
    }
    else {
      this.checkStatus();
      this.articleService.update(this.article).subscribe(res => {
        if (res.success) {
          this.sweetAlert.success('Success!', res.message);
          this.backList();
        }
        else {
          this.sweetAlert.error('Error!', res.message);
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

  // Dropzone import multi files
  files: File[] = [];

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }
}
