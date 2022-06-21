import {ChangeDetectorRef, Injectable, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ReferralTransaction} from '@snowl/base-app/model/referral-transaction';
import {ReferredSubscriber} from '@snowl/base-app/model/referred-subscriber';
import {getSubscriber} from '@snowl/app-store/selectors';

@Injectable()
export class BaseReferralComponent implements OnChanges {
  @Input() loading: boolean;
  @Input() referralUrl?: string;

  @Input() referralTransactions: ReferralTransaction[] = [];
  @Input() referredSubscribers: ReferredSubscriber[] = [];

  @Input() nickname?: string;

  me?: ParsedReferredPerson;
  tier1?: ParsedReferredPerson;
  tier2?:ParsedReferredPerson;
  tier3?:ParsedReferredPerson;

  get currentPerson(): ParsedReferredPerson | undefined {
    switch(this.selectedPage) {
      case 0:
        return this.me;
      case 1:
        return this.tier1;
      case 2:
        return this.tier2;
      case 3:
        return this.tier3;
      default:
        return;
    }
  }

  selectedPage = 0;

  private referredPeople: Dict<ParsedReferredPerson> = {};

  constructor(protected cdr: ChangeDetectorRef) {

  }

  back(): void {
    this.selectedPage --;
    this.cdr.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.referralTransactions || changes.referredSubscribers) {
      let directEarnings: number = 0;  
      let referralEarnings: number = 0;

      this.referredPeople = {};
      
      for (const sub of this.referredSubscribers) {
        const referrer = this.ensureReferredPerson(sub.referrerNickname);
        const referred = this.ensureReferredPerson(sub.nickname);
        referrer.children.push(referred);
        referred.date = sub.date;
        referred.parent = referrer;
      }


      for (const transaction of this.referralTransactions) {
        const person = this.ensureReferredPerson(transaction.nickname);
        person.events.push(transaction);
        person.amount = +(person.amount + transaction.amount).toFixed(2);
      }

      this.me = this.referredPeople[this.nickname || '_'];
      if (this.me) {
        this.adjustPerson(this.me);
      }

      if (this.tier2) {
        this.tier2 = this.referredPeople[this.tier2.nickname];
      }
      if (this.tier3) {
        this.tier3 = this.referredPeople[this.tier3.nickname];
      }
      this.cdr.markForCheck();
    }
  }

  onChildSelected(child: ParsedReferredPerson): void {
    switch (this.selectedPage) {
      case 0:
        this.tier1 = child;
        break;
      case 1:
        this.tier2 = child;
        break;
      case 2:
        this.tier3 = child;
        break;
      default:
        break;
    }

    this.selectedPage++;
    this.cdr.markForCheck();

  }

  private ensureReferredPerson(nickname: string): ParsedReferredPerson {
    return this.referredPeople[nickname] = this.referredPeople[nickname] || new ParsedReferredPerson(nickname);
  }

  /**
   * Calculates the numChildren and the amount for a referred person
   * @param person
   */
  private adjustPerson(person: ParsedReferredPerson): void {
    person.numChildren = person.children.length;
    for (const child of person.children) {
      this.adjustPerson(child);
      person.numChildren += child.numChildren;
      person.amount += child.amount;
    }
  }
}

export class ParsedReferredPerson {
  parent?: ParsedReferredPerson;
  children: ParsedReferredPerson[] = [];
  date: Date;

  amount = 0;
  numChildren = 0;


  events: ReferralEvent[] = [];

  constructor(public readonly nickname: string) {}
}

export interface ReferralEvent {
  date: Date;
  nickname: string;
  amount?: number;
}
