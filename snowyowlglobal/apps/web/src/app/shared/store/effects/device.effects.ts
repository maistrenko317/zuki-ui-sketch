import { Effect , ofType} from '@ngrx/effects';
import { Observable ,  fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { DeviceResize } from '../actions/device.actions';

export class DeviceEffects {
  @Effect()
  $deviceResize = fromEvent(window, 'resize').pipe(
    debounceTime(500),
    map(() => new DeviceResize({ width: window.innerWidth, height: window.innerHeight }))
  );
}
