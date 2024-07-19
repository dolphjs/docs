import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BasePageComponent } from '../page/page.component';

@Component({
  selector: 'app-shields',
  templateUrl: './shields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShieldsComponent extends BasePageComponent {}
