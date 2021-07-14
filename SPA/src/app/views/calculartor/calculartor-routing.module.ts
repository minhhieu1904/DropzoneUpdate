import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateComponent } from './template/template.component';

const routes: Routes = [
  {
    path: 'version1',
    data: { title: 'Calculator' },
    component: TemplateComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalculartorRoutingModule { }
