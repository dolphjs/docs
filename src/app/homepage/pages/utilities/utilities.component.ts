import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BasePageComponent } from '../page/page.component';

@Component({
  selector: 'app-utilities',
  templateUrl: './utilities.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UtilitiesComponent extends BasePageComponent {} 