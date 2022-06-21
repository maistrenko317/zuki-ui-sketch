import { Component, OnInit } from '@angular/core';
import { BaseWalletComponent } from '@snowl/base-app/user';
import { getIsDeviceMobile } from '../../shared/store/selectors/device.selectors';
import {select} from "@ngrx/store";

@Component({
  selector: 'sh-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent extends BaseWalletComponent {
  isMobile$ = this.store.pipe(select(getIsDeviceMobile));
}
