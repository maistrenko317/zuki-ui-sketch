import { ChangeDetectionStrategy, Component, AfterViewInit } from '@angular/core';
import { BaseMeComponent } from '@snowl/base-app/home';
import { Game } from '@snowl/base-app/model';
import { environment } from '@snowl/environments/environment';
import axios from 'axios';
import { Referrer } from '../referral-list/referrer-profile/types';
import * as uuid from 'uuid';
import { from } from 'rxjs';

const MAX_DISPLAYED = 4 ;
@Component({
  selector: 'sh-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeComponent extends BaseMeComponent implements AfterViewInit{
  referrer: Referrer;

  get openGames(): Game[] {
    if(this.games) {
      const filtered = [...this.games].sort((a: Game, b: Game) => {
        const x = a.openDate ? a.openDate.getTime() : 0;
        const y = b.openDate ? b.openDate.getTime() : 0;
        
        if(x > y)
          return -1;
        else if(x < y)
          return 1;
        return 0;
      });
      return filtered.length < MAX_DISPLAYED ? filtered : filtered.slice(0, MAX_DISPLAYED - 1)
    }
    return this.games;
  }


  ngAfterViewInit(): void {    
    const promise = (async () => {
      const url = `${environment.zukiURL}/referral/referrer/${this.subscriber.nickname}`;
      const response = await axios.get<Referrer>(url, {headers: {"X-REST-SESSION-KEY": uuid.v4()}})
      const data = (response.data as any).entity as Referrer;
      return data;
    })();   
    
    from(promise).subscribe(response => this.referrer = response);
  }
    
}
