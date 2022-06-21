import {
  Input,
  OnChanges,
  OnDestroy,
  Pipe,
  PipeTransform,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

import {Directive} from '@angular/core';
import {Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '@snowl/app-store/reducers';
import {getSubscriber} from '@snowl/app-store/selectors';
import {getValue} from '@snowl/base-app/util';
import {Subscriber} from '@snowl/base-app/model';

@Directive({
  selector: '[shRole]'
})
export class BaseRoleDirective implements OnDestroy, OnChanges {
  @Input()
  shRole: string;

  subscriber$ = this.store.pipe(select(getSubscriber));

  private showing = false;
  private subscription: Subscription;
  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private store: Store<AppState>) {
    this.subscription = this.subscriber$.subscribe((sub) => {
      this.check(sub);
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.check(getValue(this.subscriber$));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  check(sub?: Subscriber): void {
    const canShow = sub && sub.roles && sub.roles.includes(this.shRole);

    if (canShow && !this.showing) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.showing = true;
    } else if (!canShow && this.showing) {
      this.viewContainer.clear();
      this.showing = false;
    }
  }
}
