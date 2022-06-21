import { Component, OnInit } from '@angular/core';
import { BaseAddMoneyComponent } from '@snowl/base-app/user';
import { getIsDeviceMobile } from '../../shared/store/selectors/device.selectors';
import {select} from "@ngrx/store";

@Component({
  selector: 'sh-add-money',
  templateUrl: './add-money.component.html',
  styleUrls: ['./add-money.component.scss']
})
export class AddMoneyComponent extends BaseAddMoneyComponent {
  isMobile$ = this.store.pipe(select(getIsDeviceMobile));
}
