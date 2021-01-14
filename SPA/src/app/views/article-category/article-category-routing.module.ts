import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleCategoryListGuard } from 'src/app/_core/_guard/article-category-list.guard';
import { ArticleCategoryListResolver } from 'src/app/_core/_resolver/article-category-list.resolver';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [ArticleCategoryListGuard],
        data: { title: 'Article Category List' },
        resolve: { articleCates: ArticleCategoryListResolver },
        component: ListComponent
    },
    {
        path: 'add',
        data: { title: 'Article Category Add' },
        component: AddComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ArticleCategoryRoutingModule { }