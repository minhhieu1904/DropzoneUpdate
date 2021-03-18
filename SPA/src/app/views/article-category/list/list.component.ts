import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SnotifyPosition } from 'ng-snotify';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ArticleCategory } from 'src/app/_core/_models/article-category';
import { AlertUtilityService } from 'src/app/_core/_services/alert-utility.service';
import { ArticleCategoryService } from 'src/app/_core/_services/article-category.service';
import { Pagination, PaginationResult } from 'src/app/_core/_utility/pagination';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild('addArticleCateModal') addUserModal: ModalDirective;
  articleCateAll: ArticleCategory[];
  articleCates: ArticleCategory[];
  articleCate: any = {};
  pagination: Pagination;
  text: string = '';
  flag: number = 0;
  fileImportExcel: any = null;
  listArticleCate: ArticleCategory[] = [];
  checkboxAll: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private articleCateService: ArticleCategoryService,
    private spinner: NgxSpinnerService,
    private alertUtility: AlertUtilityService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.articleCateAll = data['articleCates'].result;
      this.pagination = data['articleCates'].pagination;
    });
    this.getDataPaginations();
  }

  save() {
    if (this.flag === 0) {
      this.articleCateService.create(this.articleCate).subscribe(res => {
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
      this.articleCateService.update(this.articleCate).subscribe(res => {
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

  changeStatus(articleCate: ArticleCategory) {
    this.articleCateService.changeStatus(articleCate).subscribe(res => {
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
    this.articleCateService.getDataPaginations(this.pagination.currentPage, this.pagination.pageSize, this.text)
      .subscribe((res: PaginationResult<ArticleCategory>) => {
        this.articleCateAll = res.result;
        this.pagination = res.pagination;
        this.articleCates = this.articleCateAll.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.pageSize * this.pagination.currentPage);
        this.checkboxAll = false;
      }), error => {
        this.alertUtility.error('Error!', error);
      };
  }

  edit(articleCate: ArticleCategory) {
    this.articleCate = { ...articleCate };
  }

  cancel() {
    if (this.flag === 0) {
      this.articleCate = {};
    }
  }

  setFlag(flag: number) { // 0: Add; 1: Edit
    this.flag = flag;
    this.cancel();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.articleCates = this.articleCateAll.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.pageSize * this.pagination.currentPage);
  }

  remove(articleCategory: ArticleCategory) {
    this.listArticleCate.push(articleCategory);
    this.checkDelete(this.listArticleCate, 'Are you sure delete article ' + "'" + articleCategory.article_Cate_ID + "'" + " ?");
  }

  removeMulti() {
    const articleCateList = this.articleCateAll.filter(item => {
      return item.checked === true;
    });
    if (articleCateList.length === 0) {
      return this.alertUtility.error('Error', 'Please choose item to delete');
    }
    this.checkDelete(articleCateList, "Are you sure delete " + articleCateList.length + " items?");
  }

  checkDelete(articleCategorys: ArticleCategory[], alert: string) {
    this.alertUtility.confirmDelete(alert, SnotifyPosition.rightCenter, () => {
      this.articleCateService.remove(articleCategorys).subscribe(res => {
        if (res.success) {
          this.alertUtility.success('Success!', res.message);
          this.listArticleCate = [];
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

  import() {
    if (this.fileImportExcel == null) {
      this.alertUtility.warning('Warning', 'Please choose file upload!', SnotifyPosition.centerTop);
      return;
    }

    this.alertUtility.confirmDelete('Are you sure import file?', SnotifyPosition.centerCenter, () => {
      this.articleCateService.importExcel(this.fileImportExcel).subscribe((res) => {
        if (res.success) {
          this.alertUtility.success('Success!', 'Import file successfuly');
        } else {
          this.alertUtility.error('Error!', 'Import file failse');
        }
        this.getDataPaginations();
      }, error => {
        this.alertUtility.error('Error', 'Upload Data Fail!');
      });
    });
  }

  onSelectFile(event, number) {
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

  export() {
    return this.articleCateService.export(this.pagination.currentPage, this.pagination.pageSize, this.text);
  }

  exportAspose(checkExport: number) {
    return this.articleCateService.exportAspose(this.pagination.currentPage, this.pagination.pageSize, this.text, checkExport);
  }

  exportPdfAspose(checkExport: number) {
    return this.articleCateService.exportAspose(this.pagination.currentPage, this.pagination.pageSize, this.text, checkExport);
  }

  downloadExcelTemplate() {
    window.location.href = '../../../../assets/fileExcelTemplate/article_category.xlsx';
  }

  checkAll(e) {
    if (e.target.checked) {
      this.articleCateAll.forEach(element => {
        element.checked = true;
      });
    }
    else {
      this.articleCateAll.forEach(element => {
        element.checked = false;
      });
    }
  }

  checkElement() {
    let countProductCateCheckBox = this.articleCateAll.filter(x => x.checked !== true).length;
    if (countProductCateCheckBox === 0) {
      this.checkboxAll = true;
    } else {
      this.checkboxAll = false;
    }
  }
}
