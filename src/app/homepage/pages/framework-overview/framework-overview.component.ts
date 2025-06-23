import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BasePageComponent } from '../page/page.component';

@Component({
  selector: 'app-framework-overview',
  templateUrl: './framework-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameworkOverviewComponent extends BasePageComponent {} 