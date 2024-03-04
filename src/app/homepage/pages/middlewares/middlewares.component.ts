import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BasePageComponent } from "../page/page.component";

@Component({
  selector: 'app-middleware',
  templateUrl: './middlewares.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiddlewaresComponent extends BasePageComponent{}