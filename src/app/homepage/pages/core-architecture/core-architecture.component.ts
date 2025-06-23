import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BasePageComponent } from '../page/page.component';

@Component({
  selector: 'app-core-architecture',
  templateUrl: './core-architecture.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreArchitectureComponent extends BasePageComponent {} 