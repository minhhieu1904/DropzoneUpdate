import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from '../containers';
import { AuthGuard } from '../_core/_guard/auth.guard';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: { title: 'QMS' },
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
        loadChildren: () => import('../views/article/article.module')
          .then(m => m.ArticleModule)
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
        loadChildren: () => import('../views/product/product.module')
          .then(m => m.ProductModule)
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
