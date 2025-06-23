import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BasePageComponent } from '../page/page.component';

@Component({
  selector: 'app-exceptions',
  templateUrl: './exceptions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExceptionsComponent extends BasePageComponent {} 