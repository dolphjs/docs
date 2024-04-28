import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BasePageComponent } from '../../page/page.component';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatabaseComponent extends BasePageComponent {}
