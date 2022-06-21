import {BaseReferralEventListComponent} from '@snowl/base-app/home';
import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Referral3TierDTO, ReferralTierDTO, ReferrerEventData } from './referral-table/types';
import { rangeRandom } from './utils';
import { Subscriber } from './types';

@Component({
  selector: 'sh-referral-event-list',
  templateUrl: 'referral-event-list.component.html',
  styleUrls: ['referral-event-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferralEventListComponent extends BaseReferralEventListComponent implements OnInit {

  @Output() copyToClipboard = new EventEmitter<void>();  
  referralTierDTO: ReferralTierDTO = {moneyEarned:0, peopleReferred:0}
  selectedSubscriber?: Subscriber;
  level: number = 0;  
  nickname: string;
  zeroLevelNickName: string;

  onReferralBackClick: () => void;

  ngOnInit(): void {
    this.zeroLevelNickName = (() => {
      // const subscriber: any = JSON.parse(localStorage.getItem("sub") || "{}");
      // return subscriber.nickname;
      return "23";
    })(); // or 23
  }

  public onReferrerEvent(eventData: ReferrerEventData) {
    const subscriber = eventData.subscriber;
    const index = rangeRandom(0, 64) | 0;
    const actualUrl = subscriber.photoUrl ||  `/assets/img/people/person-${index}.png`;    
    this.nickname = eventData.level === 0 ? this.zeroLevelNickName : eventData.subscriber.nickname;
    this.level = eventData.level;
    this.onReferralBackClick = () => eventData.onReferralBackClick ();

    this.selectedSubscriber = {
      ...subscriber,
      photoUrl: actualUrl
    }
  }

  onProfileBackClick () {
    return ((nickname?: string):void => {
      this.onReferralBackClick.call(null);  
    })
  }

  public onBackClick() {
    this.onReferralBackClick.call(null);
  }

  public onReferral3TierDTOEvent(referral3TierDTOList: Referral3TierDTO[]) {
    
    const summary: Referral3TierDTO = referral3TierDTOList.reduce(
      (overall: Referral3TierDTO, item: Referral3TierDTO) => {
        const {tier1, tier2, tier3} = overall;
        const tier = (a : ReferralTierDTO, b: ReferralTierDTO) => ({
          moneyEarned: a.moneyEarned + b.moneyEarned,
          peopleReferred: a.peopleReferred + b.peopleReferred,          
        });

        return {
          nickname: overall.nickname,
          tier1: tier(tier1, item.tier1),
          tier2: tier(tier2, item.tier2),
          tier3: tier(tier3, item.tier3),
        };
      },
      {
        nickname: "",
        tier1: { moneyEarned: 0, peopleReferred: 0},
        tier2: { moneyEarned: 0, peopleReferred: 0},
        tier3: { moneyEarned: 0, peopleReferred: 0},
      }
    );

    const {tier1, tier2, tier3} = summary;

    this.referralTierDTO = {
      ...this.referralTierDTO,
      moneyEarned:  tier1.moneyEarned + tier2.moneyEarned + tier3.moneyEarned,
      peopleReferred: tier1.peopleReferred + tier2.peopleReferred + tier3.peopleReferred + referral3TierDTOList.length
    }
  }
}
