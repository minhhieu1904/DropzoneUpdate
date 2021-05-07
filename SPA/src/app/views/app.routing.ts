import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from '../containers';
import { AuthGuard } from '../_core/_guard/auth.guard';
import { LoginComponent } from './login/login.component';
import { Page_404_2_Component } from './page-404-2/page-404-2.component';
import { Page404Component } from './page-404/page-404.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: '404 Page'
    }
  },
  {
    path: '404-2',
    component: Page_404_2_Component,
    data: {
      title: '404 Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: { title: 'DASHBOARD' },
    canActivate: [AuthGuard],
    children: [
      {
        path: 'settings',
        children: [
          {
            path: 'user-list',
            loadChildren: () => import('../views/user/user.module')
              .then(m => m.UserModule)
          }
        ]
      },
      {
        path: 'article-cate',
        children: [
          {
            path: 'list',
            loadChildren: () => import('../views/article-category/article-category.module')
              .then(m => m.ArticleCategoryModule)
          }
        ]
      },
      {
        path: 'article',
        children: [
          {
            path: '',
            loadChildren: () => import('../views/article/article.module')
              .then(m => m.ArticleModule)
          }
        ]
      },
      {
        path: 'product-cate',
        children: [
          {
            path: 'list',
            loadChildren: () => import('../views/product-category/product-category.module')
              .then(m => m.ProductCategoryModule)
          }
        ]
      },
      {
        path: 'product',
        children: [
          {
            path: '',
            loadChildren: () => import('../views/product/product.module')
              .then(m => m.ProductModule)
          }
        ]
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
