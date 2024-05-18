import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../../src/app/shared/shared.module';
import { ConfigurationComponent } from './configuration/configuration.component';
import { DatabaseComponent } from './database/database.component';
import { ValidationComponent } from './validation/validation.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { CookiesComponent } from './cookies/cookies.component';

const routes: Routes = [
  {
    path: 'authentication',
    redirectTo: '/security/authentication',
  },
  {
    path: 'mvc',
    // component:
    data: { title: 'MVC' },
  },
  {
    path: 'logger',
    // component:
    data: { title: 'Logger' },
  },
  {
    path: 'configuration',
    component: ConfigurationComponent,
    data: { title: 'Configuration' },
  },
  {
    path: 'database',
    component: DatabaseComponent,
    data: { title: 'Database' },
  },
  {
    path: 'validation',
    component: ValidationComponent,
    data: { title: 'Validation' },
  },
  {
    path: 'file-upload',
    component: FileUploadComponent,
    data: { title: 'File upload' },
  },
  {
    path: 'cookies',
    component: CookiesComponent,
    data: { title: 'Cookies' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, SharedModule],
  declarations: [],
})
export class TechniquesModule {}
