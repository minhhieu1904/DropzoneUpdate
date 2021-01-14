import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleListGuard } from 'src/app/_core/_guard/article-list.guard';
import { ArticleListResolver } from 'src/app/_core/_resolver/article-list.resolver';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [ArticleListGuard],
        data: { title: 'Article List' },
        resolve: { articles: ArticleListResolver },
        component: ListComponent
    },
    {
        path: 'add',
        canActivate: [ArticleListGuard],
        data: { title: 'Article Add' },
        component: AddComponent
    },
    {
        path: 'edit',
        canActivate: [ArticleListGuard],
        data: { title: 'Article Edit' },
        component: AddComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ArticleRoutingModule { }