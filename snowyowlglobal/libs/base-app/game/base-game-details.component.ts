import {
  AfterViewInit,
  ElementRef,
  EventEmitter,
  Injectable,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  Type,
  ViewChild
} from '@angular/core';
import { Game, Round } from '@snowl/base-app/model';
import {Constructor, getNextRound, getPrevRound, getValue, isEmpty} from '@snowl/base-app/util';
import { BaseRoundListComponent } from './base-round-list.component';
import {BaseDialogService, BasePayoutSliderComponent} from "@snowl/base-app/shared";
import {interval, Subject} from "rxjs";
import {startWith, takeUntil} from "rxjs/operators";
import {InviteFriendsAction} from '@snowl/app-store/actions';
import {select, Store} from '@ngrx/store';
import {getSubscriber} from '@snowl/app-store/selectors';
import {AppState} from '@snowl/app-store/reducers';

@Injectable()
export abstract class BaseGameDetailsComponent implements OnDestroy, AfterViewInit {
  nextRound?: Round;

  hasPlayedRound = false;

  poolStatusText: string;
  bracketStatusText: string;
  abstract payoutSliderComponent: Constructor<BasePayoutSliderComponent>;

  @ViewChild('current', {static: true}) current: ElementRef;

  private onDestroy$ = new Subject();
  private shownGameDialog = false;
  constructor(protected dialog: BaseDialogService, private renderer: Renderer2, private store: Store<AppState>) {
  }

  @ViewChild('roundList', {static: true}) roundList: BaseRoundListComponent;

  @Output() joinGame = new EventEmitter();

  @Output() viewResults = new EventEmitter();

  @Output() playNextRound = new EventEmitter();

  @Output() viewRound = new EventEmitter<string>();

  @Input() currentPlayerCount: number;

  private _game: Game;

  @Input()
  get game(): Game {
    return this._game;
  }

  set game(value: Game) {
    this._game = value;
    this.nextRound = getNextRound(value);
    this.hasPlayedRound = value.rounds[0] && value.rounds[0].userJoinedRound;

    if (!this.shownGameDialog && value.gameStatus === 'OPEN') {

    }

    // TODO: make this work
    // setTimeout(() => {
    //   if (this.nextRound)
    //     this.roundList.animateToRound(this.nextRound);
    //   else
    //     this.roundList.animateToRound(this.game.rounds[this.game.rounds.length - 1]);
    // }, 500)
  }

  get showGameGuide(): boolean {
      return (!!this._game.guideUrl && !!this._game.guideUrl.length) || !isEmpty(this._game.guideHtmls);
  }

  showPayoutSlider(): void {
    this.dialog.openComponent(this.payoutSliderComponent, this.game)
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  invite() {
    this.store.dispatch(new InviteFriendsAction(getValue(this.store.pipe(select(getSubscriber))), this.game));
  }

  ngAfterViewInit(): void {
    interval(7000).pipe(takeUntil(this.onDestroy$), startWith(0)).subscribe(() =>{
      if (this.current && this.current.nativeElement) {
        this.renderer.removeClass(this.current.nativeElement, 'flash');
        setTimeout(() => {
          if (this.current && this.current.nativeElement) {
            this.renderer.addClass(this.current.nativeElement, 'flash');
          }
        }, 0);
      }
    })
  }

  explainPool(): void {
    this.dialog.open({
      title: 'Warmup Rounds',
      message: 'A Warmup Round is a practice round that can be played before the tournament starts.',
      buttons: ['Close']
    })
  }
}

interface GameInfoDialogData {
  game: Game;
  nextRound?: Round;
}

type GameInfoDialogResult = 'None' | 'NextRound' | 'JoinGame';
