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
  articleCates: ArticleCategory[];
  articleCate: any = {};
  pagination: Pagination;
  text: string = '';
  flag: number = 0;
  fileImportExcel: any = null;
  constructor(
    private route: ActivatedRoute,
    private articleCateService: ArticleCategoryService,
    private spinner: NgxSpinnerService,
    private alertUtility: AlertUtilityService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.articleCates = data['articleCates'].result;
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
        this.articleCates = res.result;
        this.pagination = res.pagination;
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
    this.getDataPaginations();
  }

  remove(articleCategory: ArticleCategory) {
    this.alertUtility.confirmDelete('Are you sure delete item?', SnotifyPosition.rightCenter, () => {
      this.articleCateService.remove(articleCategory).subscribe(res => {
        if (res.success) {
          this.alertUtility.success('Success!', res.message);
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
}
