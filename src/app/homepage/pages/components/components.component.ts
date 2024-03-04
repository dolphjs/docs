import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BasePageComponent } from "../page/page.component";

@Component({
  selector: 'app-component',
  templateUrl: './components.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsComponent extends BasePageComponent{}