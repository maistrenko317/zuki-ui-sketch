import { Component, OnInit } from '@angular/core';
import { BaseEditMeComponent } from '@snowl/base-app/user';
import { getIsDeviceMobile } from '../shared/store/selectors/device.selectors';
import { Subject } from 'rxjs';
import {select} from "@ngrx/store";

@Component({
  selector: 'sh-edit-me',
  templateUrl: './edit-me.component.html',
  styleUrls: ['./edit-me.component.scss']
})
export class EditMeComponent extends BaseEditMeComponent {
  isMobile$ = this.store.pipe(select(getIsDeviceMobile));

  refresh(refresher: Subject<any>) {
    this.refreshMe(() => refresher.next());
  }
}
