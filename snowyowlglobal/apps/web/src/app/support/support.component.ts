import { Component, OnInit } from '@angular/core';
import {getIsDeviceMobile} from "../shared/store/selectors/device.selectors";
import { select, Store } from '@ngrx/store';
import {getIsLoggedIn} from "@snowl/app-store/selectors";
import {BackAction} from "@snowl/app-store/actions";
import {getValue} from "@snowl/base-app/util";

@Component({
  selector: 'sh-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent {
  isMobile$ = this.store.pipe(select(getIsDeviceMobile));

  constructor(private store: Store<any>) {

  }

  goBack(): void {
    const loggedIn = getValue(this.store.pipe(select(getIsLoggedIn)));
    this.store.dispatch(new BackAction(loggedIn ? '/user' : '/auth/login'));
  }
}
