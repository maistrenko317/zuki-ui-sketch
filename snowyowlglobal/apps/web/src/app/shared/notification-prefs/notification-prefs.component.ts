import {BaseNotificationPrefsComponent} from "@snowl/base-app/shared";
import {Component} from "@angular/core";
import {getIsDeviceMobile} from "../store/selectors/device.selectors";
import {select} from "@ngrx/store";

@Component({
  templateUrl: './notification-prefs.component.html',
  styleUrls: ['./notification-prefs.component.scss']
})
export class NotificationPrefsComponent extends BaseNotificationPrefsComponent {
  isMobile$ = this.store.pipe(select(getIsDeviceMobile));
  phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  codeMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
}
