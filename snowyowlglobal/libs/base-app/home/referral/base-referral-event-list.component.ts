import {EventEmitter, Injectable, Input, Output} from '@angular/core';
import {ParsedReferredPerson} from './base-referral.component';

@Injectable()
export class BaseReferralEventListComponent {
  @Input() person: ParsedReferredPerson | undefined;
  @Input() meNickname: string;
  @Input() referralUrl: string;

  get isMe(): boolean {
    return !!this.person && this.meNickname === this.person.nickname;
  }

  @Output() readonly childSelected = new EventEmitter<ParsedReferredPerson>();
  @Output() readonly goBack = new EventEmitter<void>();
}
