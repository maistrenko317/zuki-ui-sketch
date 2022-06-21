import {Injectable} from "@angular/core";
import {animateNumber, NumAnim} from "@snowl/base-app/util";
import {VxDialogDef} from 'vx-components-base';

@Injectable()
export abstract class BaseTieBreakerComponent extends VxDialogDef<Date> {
  countdown$: NumAnim;

  startCountdown(toTime: Date): void {
    const time = toTime.getTime() - Date.now();
    this.countdown$ = animateNumber(time / 1000 + 1, 1, time);
  }
}
