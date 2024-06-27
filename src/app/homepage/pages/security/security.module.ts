import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../../src/app/shared/shared.module';
import { CorsComponent } from './cors/cors.component';
import { HelmetComponent } from './helmet/helmet.component';
import { EncryptionAndHashingComponent } from './encryption-and-hashing/encryption-and-hashing.component';

const routes: Routes = [
  {
    path: 'authentication',
    redirectTo: '/security/authentication',
  },
  {
    path: 'authorization',
    // component: ,
    // data: { title: 'Cookies' },
  },
  {
    path: 'encryption-and-hashing',
    data: { title: 'encryption and hashing' },
    component: EncryptionAndHashingComponent,
  },
  {
    path: 'helmet',
    data: { title: 'helmet' },
    component: HelmetComponent,
  },
  {
    path: 'cors',
    data: { title: 'cors' },
    component: CorsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, SharedModule],
  declarations: [],
})
export class SecurityModule {}
