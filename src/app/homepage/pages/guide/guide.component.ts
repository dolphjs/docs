import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BasePageComponent } from "../page/page.component";

@Component({
    selector: 'app-guide',
    templateUrl: './guide.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideComponent extends BasePageComponent{}