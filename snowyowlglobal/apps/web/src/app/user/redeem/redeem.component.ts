import {BaseWithdrawComponent} from "@snowl/base-app/user/base-withdraw.component";
import {ChangeDetectionStrategy, Component} from "@angular/core";
import {getIsDeviceMobile} from "../../shared/store/selectors/device.selectors";
import {Subject} from "rxjs";
import {createNumberMask} from "text-mask-addons/dist/textMaskAddons";
import {select} from "@ngrx/store";
import {BaseRedeemComponent} from '@snowl/base-app/user';

@Component({
  templateUrl: './redeem.component.html',
  styleUrls: ['./redeem.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedeemComponent extends BaseRedeemComponent {
  isMobile$ = this.store.pipe(select(getIsDeviceMobile));
}
