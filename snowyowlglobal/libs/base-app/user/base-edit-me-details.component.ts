import { EventEmitter, Injectable, Input, Output } from '@angular/core';
import {Subscriber, SubscriberNotificationPreference} from '@snowl/base-app/model';
import { BaseMediaService } from '@snowl/base-app/user';
import { BaseDialogService } from '@snowl/base-app/shared';
import { NgModel } from '@angular/forms';
import { editingState } from '@snowl/user-store/reducers';

@Injectable()
export class BaseEditMeDetailsComponent {
  @Input() subscriber: Subscriber;
  @Input() editingState: editingState;
  @Input() editingError?: string;

  @Output() imageChange = new EventEmitter<any>();
  @Output() updateSubscriber = new EventEmitter<Partial<Subscriber>>();
  @Output() logout = new EventEmitter();

  updateSubscriberField<T extends keyof Subscriber>(field: T, value: Subscriber[T], model: NgModel): void {
    if (model.valid && this.subscriber[field] !== value) this.updateSubscriber.emit({ [field]: value });
  }

  getPrefName(pref: SubscriberNotificationPreference): string {
    switch (pref) {
      case "APP_PUSH":
        return "App Push";
      case "EMAIL":
        return "Email";
      case "NONE":
        return "None";
      case "NOT_SET":
        return "Not Set";
      case "SMS":
        return "Text Message";
    }
  }
}
