import { Component } from '@angular/core';
import { BasePrivacyComponent } from '@snowl/base-app/legal';
import { getIsLoggedIn } from '@snowl/app-store/selectors';
import { BackAction } from '@snowl/app-store/actions';
import { getValue } from '@snowl/base-app/util';
import { map } from 'rxjs/operators';
import { getIsDeviceMobile } from '../shared/store/selectors/device.selectors';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'sh-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent extends BasePrivacyComponent {
  isMobile$ = this.store.pipe(select(getIsDeviceMobile));

  parsedDoc$ = this.privacyDoc$.pipe(
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
