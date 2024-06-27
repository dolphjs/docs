import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BasePageComponent } from '../../page/page.component';

@Component({
  selector: 'app-encryption-and-hashing',
  templateUrl: './encryption-and-hashing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EncryptionAndHashingComponent extends BasePageComponent {}
