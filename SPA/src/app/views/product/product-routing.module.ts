import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListGuard } from 'src/app/_core/_guard/product-list.guard';
import { ProductListResolver } from 'src/app/_core/_resolver/product-list.resolver';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [ProductListGuard],
        data: { title: 'Product List' },
        resolve: { products: ProductListResolver },
        component: ListComponent
    },
    {
        path: 'add',
        data: { title: 'Product Add' },
        component: AddComponent
    },
    {
        path: 'edit',
        data: { title: 'Product Edit' },
        component: AddComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule { }