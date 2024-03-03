import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BasePageComponent } from "../page/page.component";

@Component({
    selector: 'app-services',
  templateUrl: './services.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesComponent extends BasePageComponent{}