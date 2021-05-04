import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { SnotifyPosition } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Article } from 'src/app/_core/_models/article';
import { AlertUtilityService } from 'src/app/_core/_services/alert-utility.service';
import { ArticleCategoryService } from 'src/app/_core/_services/article-category.service';
import { ArticleService } from 'src/app/_core/_services/article.service';
import { Pagination, PaginationResult } from 'src/app/_core/_utility/pagination';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  articleAll: Article[];
  articles: Article[];
  article: any = {};
  text: string = '';
  flag: string = '0';
  pagination: Pagination;
  articleCateList: Array<Select2OptionData>;
  articleCateID: string = 'all';
  articleList: Array<Select2OptionData>;
  article_Name: string = 'all';
  listArticle: Article[] = [];
  checkboxAll: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private articleCategoryService: ArticleCategoryService,
    private spinner: NgxSpinnerService,
    private alertUtility: AlertUtilityService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.articleAll = data['articles'].result;
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
        this.articleAll = res.result;
        this.pagination = res.pagination;
        this.articles = this.articleAll.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.pageSize * this.pagination.currentPage);
        this.checkboxAll = false;
      }), error => {
        this.alertUtility.error('Error!', error);
      };
  }

  searchDataPaginations() {
    this.articleService.searchDataPaginations(this.pagination.currentPage, this.pagination.pageSize, this.articleCateID, this.article_Name)
      .subscribe((res: PaginationResult<Article>) => {
        this.articleAll = res.result;
        this.pagination = res.pagination;
        this.articles = this.articleAll.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.pageSize * this.pagination.currentPage);
        this.checkboxAll = false;
      }), error => {
        this.alertUtility.error('Error!', error);
      };
  }

  changeStatus(article: Article) {
    this.articleService.changeStatus(article).subscribe(res => {
      if (res.success) {
        this.alertUtility.success('Success!', res.message);
        this.getDataPaginations();
      } 
      else
        this.alertUtility.error('Error!', res.message);
    },
      error => {
        console.log(error);
      }
    );
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.articles = this.articleAll.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.pageSize * this.pagination.currentPage);
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

  remove(article: Article) {
    this.listArticle.push(article);
    this.checkDelete(this.listArticle, 'Are you sure delete article?');
  }

  removeMulti() {
    const articleList = this.articleAll.filter(item => {
      return item.checked === true;
    });
    if (articleList.length === 0)
      return this.alertUtility.error('Error', 'Please choose item to delete');
    this.checkDelete(articleList, "Are you sure delete " + articleList.length + " items?");
  }

  checkDelete(articleList: Article[], alert: string) {
    this.alertUtility.confirmDelete(alert, SnotifyPosition.rightCenter, () => {
      this.articleService.remove(articleList).subscribe(res => {
        if (res.success) {
          this.alertUtility.success('Success!', res.message);
          this.getDataPaginations();
        }
        else
          this.alertUtility.error('Error!', res.message);
      },
        error => {
          console.log(error);
        });
    });
  }

  exportExcel(checkExport: number) {
    let checkSearch = this.articleCateID === 'all' ? 1 : 2;
    if (this.articleAll.length > 0 && this.articles.length > 0)
      return this.articleService.exportListAspose(this.pagination.currentPage, this.pagination.pageSize, this.text, checkExport, this.articleCateID, this.article_Name, checkSearch);
    else
      return this.alertUtility.warning('Warning', 'No data');
  }

  checkAll(e) {
    if (e.target.checked) {
      this.articleAll.forEach(element => {
        element.checked = true;
      });
    }
    else {
      this.articleAll.forEach(element => {
        element.checked = false;
      });
    }
  }

  checkElement() {
    let countProductCateCheckBox = this.articleAll.filter(x => x.checked !== true).length;
    if (countProductCateCheckBox === 0)
      this.checkboxAll = true;
    else
      this.checkboxAll = false;
  }
}