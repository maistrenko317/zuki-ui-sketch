import {BaseWithdrawComponent} from "@snowl/base-app/user/base-withdraw.component";
import {ChangeDetectionStrategy, Component} from "@angular/core";
import {getIsDeviceMobile} from "../../shared/store/selectors/device.selectors";
import {Subject} from "rxjs";
import {createNumberMask} from "text-mask-addons/dist/textMaskAddons";
import {select} from "@ngrx/store";

@Component({
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WithdrawComponent extends BaseWithdrawComponent {
  numberMask = createNumberMask({allowDecimal: true});
  isMobile$ = this.store.pipe(select(getIsDeviceMobile));

  refresh(refresher: Subject<any>) {
    this.refreshMe(() => refresher.next());
  }

  // ngDoCheck(): void {
    // debugger;
  // }
}
