import {ChangeDetectorRef, Injectable, OnDestroy} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '@snowl/app-store/reducers';
import {Game, GamePayoutLevel, GamePayouts, PayoutModelRound} from '@snowl/base-app/model';
import {Observable, Subject, Subscription} from 'rxjs';
import {getGameEntities} from '@snowl/app-store/selectors';
import {debounceTime, distinctUntilChanged, filter, map, switchMap, take, tap} from 'rxjs/operators';
import {getValue} from '@snowl/base-app/util';
import {LoadGamePayoutsAction} from '@snowl/app-store/actions';
import {BaseGameService} from '@snowl/base-app/shared/services';
import {VxDialogDef} from 'vx-components-base';

@Injectable()
export abstract class BasePayoutSliderComponent extends VxDialogDef<Game> implements OnDestroy {
  payoutLevels: PayoutModelRound[] = [];
  abstract game: Game;
  sliderValue = 0;
  sliderValue$ = new Subject<number>();

  loading = false;
  min = 2;

  private subscription?: Subscription;
  constructor(protected store: Store<AppState>,
              private gameService: BaseGameService,
              private cdr: ChangeDetectorRef) {
    super()

  }

  init(): void {
    this.subscription = this.sliderValue$.pipe(
      filter(num => !!num),
      map(num => Math.round(num)),
      distinctUntilChanged(),
      tap((num) => {
        this.sliderValue = num;
        this.loading = true;
        this.cdr.markForCheck();
      }),
      debounceTime(300),
      switchMap((value) => {
        return this.gameService.scalePayoutTable(this.game.extras.payoutModelId, this.game.extras.minimumPayoutAmount, value);
      })
    ).subscribe(rounds => {
      this.payoutLevels = rounds;
      this.loading = false;
      this.cdr.markForCheck();
    });

    this.sliderValue$.next(this.game.maximumPlayerCount);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }
}
