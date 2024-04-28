import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BasePageComponent } from '../../page/page.component';

@Component({
  selector: 'app-socketio',
  templateUrl: './socketio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocketIoComponent extends BasePageComponent {}
