import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../../src/app/shared/shared.module';
import { SocketIoComponent } from './socketio/socketio.component';

const routes: Routes = [
  {
    path: 'socketio',
    component: SocketIoComponent,
    data: { title: 'Socket IO' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, SharedModule],
  declarations: [],
})
export class WebsocketsModule {}
