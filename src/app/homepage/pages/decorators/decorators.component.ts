import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BasePageComponent } from "../page/page.component";

@Component({
  selector: 'app-decorator',
  templateUrl: './decorators.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecoratorsComponent extends BasePageComponent{}