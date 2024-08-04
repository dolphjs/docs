import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BasePageComponent } from '../../page/page.component';

@Component({
  selector: 'app-model-view-controller',
  templateUrl: './model-view-controller.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelViewControllerComponent extends BasePageComponent {}
