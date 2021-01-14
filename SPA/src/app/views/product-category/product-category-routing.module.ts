import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCategoryListGuard } from 'src/app/_core/_guard/product-category-list.guard';
import { ProductCategoryListResolver } from 'src/app/_core/_resolver/product-category-list.resolver';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [ProductCategoryListGuard],
        data: { title: 'Product Category List' },
        resolve: { productCates: ProductCategoryListResolver },
        component: ListComponent
    },
    {
        path: 'add',
        data: { title: 'Product Category Add' },
        component: AddComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductCategoryRoutingModule { }