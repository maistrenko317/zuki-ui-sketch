import {ChangeDetectorRef, OnDestroy, Pipe, PipeTransform, WrappedValue} from '@angular/core';
import {animateNumber, NumAnim} from "@snowl/base-app/util";
import {EasingFunctions} from "@snowl/base-app/animations";
import {Subscription} from "rxjs";

@Pipe({
  name: 'shAnimateNumber',
  pure: false
})
export class BaseAnimateNumberPipe implements PipeTransform, OnDestroy {
  private animatingTo?: number;
  private lastSentValue: number;

  private animation: NumAnim;
  private subscription: Subscription;
  constructor(private cdr: ChangeDetectorRef) {

  }
  transform(value: number, duration = 300, precision = 0): any {
    if (value === this.animatingTo) {
      return this.lastSentValue;
    } else if (this.animatingTo === undefined) {
      this.animatingTo = value;
      this.lastSentValue = value;
      return value;
    } else {
      this.clearAnimation();

      this.animatingTo = value;

      this.animation = animateNumber(this.lastSentValue, value, duration, precision, EasingFunctions.easeInOutQuad);

      this.subscription = this.animation.subscribe((animatedNumber) => {
        this.lastSentValue = animatedNumber;
        this.cdr.markForCheck();

        if (this.animation.finished) {
          this.clearAnimation();
        }
      });

      return this.lastSentValue;
    }
  }

  ngOnDestroy(): void {
    this.clearAnimation();
  }

  private clearAnimation(): void {
    if (this.animation) {
      this.animation.cancel();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
