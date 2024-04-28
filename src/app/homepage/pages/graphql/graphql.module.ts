import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../../src/app/shared/shared.module';
import { GraphqlOverViewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: 'overview',
    component: GraphqlOverViewComponent,
    data: { title: 'Overview' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, SharedModule],
  declarations: [],
})
export class GraphqlModule {}
