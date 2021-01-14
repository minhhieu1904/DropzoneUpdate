import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ArticleCategory } from 'src/app/_core/_models/article-category';
import { RoleUserAuthorize } from 'src/app/_core/_models/role-user-authorize';
import { AlertifyService } from 'src/app/_core/_services/alertify.service';
import { ArticleCategoryService } from 'src/app/_core/_services/article-category.service';
import { SweetAlertService } from 'src/app/_core/_services/sweet-alert.service';
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
  constructor(
    private route: ActivatedRoute,
    private articleCateService: ArticleCategoryService,
    private sweetAlert: SweetAlertService,
    private spinner: NgxSpinnerService,
    private alertify: AlertifyService
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
      this.articleCateService.update(this.articleCate).subscribe(res => {
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

  changeStatus(articleCate: ArticleCategory) {
    this.articleCateService.changeStatus(articleCate).subscribe(res => {
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
    this.articleCateService.getDataPaginations(this.pagination.currentPage, this.pagination.pageSize, this.text)
      .subscribe((res: PaginationResult<ArticleCategory>) => {
        this.articleCates = res.result;
        this.pagination = res.pagination;
      }), error => {
        this.alertify.error(error);
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
}
