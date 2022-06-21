import { Component, OnInit } from '@angular/core';
import { BaseTermsComponent } from '@snowl/base-app/legal';
import { getIsLoggedIn } from '@snowl/app-store/selectors';
import { getValue } from '@snowl/base-app/util';
import { map } from 'rxjs/operators';
import { BackAction } from '@snowl/app-store/actions';
import { getIsDeviceMobile } from '../shared/store/selectors/device.selectors';
import {select} from "@ngrx/store";

@Component({
  selector: 'sh-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent extends BaseTermsComponent {
  isMobile$ = this.store.pipe(select(getIsDeviceMobile));

  parsedDoc$ = this.termsDoc$.pipe(
    map((doc = '') =>
      doc
        .replace('<body>', '')
        .replace('</body>', '')
        .replace('<html>', '')
        .replace('</html>', '')
    )
  );

  goBack(): void {
    const loggedIn = getValue(this.store.pipe(select(getIsLoggedIn)));
    this.store.dispatch(new BackAction(loggedIn ? '/user' : '/auth/login'));
  }
}
