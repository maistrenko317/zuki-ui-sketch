import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BaseReferralComponent} from '@snowl/base-app/home/';
import {VxToast} from 'vx-components';
import {copyTextToClipboardWEBONLY} from '@snowl/base-app/util';

@Component({
  selector: 'sh-referral',
  templateUrl: 'referral.component.html',
  styleUrls: ['referral.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferralComponent extends BaseReferralComponent {
  constructor(cdr: ChangeDetectorRef, private toast: VxToast) {
    super(cdr);
  }


  copyToClipboard(): void {
    if (this.referralUrl) {
      const resp = copyTextToClipboardWEBONLY(this.referralUrl);
      if (resp) {
        this.toast.open({
          type: 'info',
          title: 'Success!',
          text: 'Copied to Clipboard!',
          duration: 60000
        })
      } else {
        this.toast.open({
          type: 'error',
          title: 'Error',
          text: 'Unable to Copy to Clipboard.'
        })
      }

    }
  }
}
