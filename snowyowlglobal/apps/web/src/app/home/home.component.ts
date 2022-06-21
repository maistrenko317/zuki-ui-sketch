import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseHomeComponent } from '@snowl/base-app/home/';
import { Subject } from 'rxjs';
import { getValue } from '@snowl/base-app/util';

@Component({
  selector: 'sh-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends BaseHomeComponent {
  refresh(sub: Subject<void>) {
    const tab = getValue(this.$currentTab);
    if (tab === 'games') this.refreshGames(() => sub.next());
    else if (tab === 'me') this.refreshMe(() => sub.next());
    else if (tab === 'referrals') this.refreshReferrals(() => sub.next());
    else sub.next();
  }
}
