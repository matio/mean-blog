import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../shared/auth.guard';
import { DraftListComponent } from './draft-list/draft-list.component';
import { DraftDetailComponent } from './draft-detail/draft-detail.component';
import { DraftEditComponent } from './draft-edit/draft-edit.component';

const routes: Routes = [
  {
    path: '',
    component: DraftListComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: ':_id',
        component: DraftDetailComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'new',
    component: DraftEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':_id/edit',
    component: DraftEditComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class DraftsRoutingModule {}
