import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../../src/app/shared/shared.module';
import { CorsComponent } from './cors/cors.component';
import { HelmetComponent } from './helmet/helmet.component';
import { EncryptionAndHashingComponent } from './encryption-and-hashing/encryption-and-hashing.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { RateLimitingComponent } from './rate-limiting/rate-limiting.component';

const routes: Routes = [
  {
    path: 'authentication',
    component: AuthenticationComponent,
    data: { title: 'Authentication' },
  },
  {
    path: 'authorization',
    component: AuthorizationComponent,
    data: { title: 'Authorization' },
  },
  {
    path: 'encryption-and-hashing',
    data: { title: 'Encryption and hashing' },
    component: EncryptionAndHashingComponent,
  },
  {
    path: 'helmet',
    data: { title: 'Helmet' },
    component: HelmetComponent,
  },
  {
    path: 'cors',
    data: { title: 'Cors' },
    component: CorsComponent,
  },
  {
    path: 'rate-limiting',
    data: { title: 'Rate limiting' },
    component: RateLimitingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, SharedModule],
  declarations: [],
})
export class SecurityModule {}
