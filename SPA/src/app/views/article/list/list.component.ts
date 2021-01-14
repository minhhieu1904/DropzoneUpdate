import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Article } from 'src/app/_core/_models/article';
import { AlertifyService } from 'src/app/_core/_services/alertify.service';
import { ArticleCategoryService } from 'src/app/_core/_services/article-category.service';
import { ArticleService } from 'src/app/_core/_services/article.service';
import { SweetAlertService } from 'src/app/_core/_services/sweet-alert.service';
import { Pagination, PaginationResult } from 'src/app/_core/_utility/pagination';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  articles: Article[];
  article: any = {};
  text: string = '';
  flag: string = '0';
  pagination: Pagination;
  articleCateList: Array<Select2OptionData>;
  articleCateID: string = 'all';
  articleList: Array<Select2OptionData>;
  article_Name: string = 'all';
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
    this.route.data.subscribe(data => {
      this.articles = data['articles'].result;
      this.pagination = data['articles'].pagination;
    });
    this.getDataPaginations();
    this.getArticleCateList();
  }

  addNew() {
    this.articleService.changeArticle(this.article);
    this.articleService.changeFlag('0');
    this.router.navigate(['/article/add']);
  }

  edit(article: Article) {
    this.articleService.changeArticle(article);
    this.articleService.changeFlag('1');
    this.router.navigate(['/article/edit']);
  }

  getDataPaginations() {
    this.articleService.getDataPaginations(this.pagination.currentPage, this.pagination.pageSize, this.text)
      .subscribe((res: PaginationResult<Article>) => {
        this.articles = res.result;
        this.pagination = res.pagination;
      }), error => {
        this.alertify.error(error);
      };
  }

  searchDataPaginations() {
    this.articleService.searchDataPaginations(this.pagination.currentPage, this.pagination.pageSize, this.articleCateID, this.article_Name)
      .subscribe((res: PaginationResult<Article>) => {
        this.articles = res.result;
        this.pagination = res.pagination;
      }), error => {
        this.alertify.error(error);
      };
  }

  changeStatus(article: Article) {
    this.articleService.changeStatus(article).subscribe(res => {
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

  getArticleCateList() {
    this.articleCategoryService.getIdAndName().subscribe(res => {
      this.articleCateList = res.map(item => {
        return { id: item.id, text: item.name };
      });
      this.articleCateList.unshift({ id: 'all', text: 'All' });
    });
  }

  getArticleListByArticleCateID() {
    this.articleService.getArticleListByArticleCateID(this.articleCateID).subscribe(res => {
      this.articleList = res.map(item => {
        return { id: item.id, text: item.name };
      });
      this.articleList.unshift({ id: 'all', text: 'All' });
    });
  }

  changeArticleCateID(event) {
    this.articleCateID = event;
    this.getArticleListByArticleCateID();
  }
}
