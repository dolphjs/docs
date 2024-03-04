import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BasePageComponent } from "../page/page.component";


@Component({
  selector: 'app-model',
  templateUrl: './models.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelsComponent extends BasePageComponent{}