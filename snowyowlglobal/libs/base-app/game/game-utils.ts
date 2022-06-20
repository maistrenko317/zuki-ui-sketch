import {AppState} from '@snowl/app-store/reducers';
import {NormalizedGame, Game} from '@snowl/base-app/model';
import {select, Store} from '@ngrx/store';
import {formatNumber, getNextRound, getValue} from '@snowl/base-app/util';
import {GoAction, JoinGameAction} from '@snowl/app-store/actions';
import {getIsLoggedIn, getSubscriber} from '@snowl/app-store/selectors';
import {BaseDialogService, DialogContent} from '@snowl/base-app/shared';
import {DecimalPipe} from '@angular/common';
import {Observable, Subject} from 'rxjs';
import {take} from 'rxjs/operators';
import {formatRelative} from "date-fns";

export function confirmAndJoinGame(game: Game | NormalizedGame, store: Store<AppState>, dialog: BaseDialogService): Observable<boolean> {
  const result = new Subject<boolean>();
  const loggedIn = getValue(store.pipe(select(getIsLoggedIn)));

  const purchaseAndJoinGame = (): void => {
    const subscriber = getValue(store.pipe(select(getSubscriber)))!;
    const hasMoney = game.costToJoin <= subscriber.wallet;
    const decimalPipe = new DecimalPipe('EN');

    dialog.open({
      title: hasMoney ? 'Purchase' : 'Not Enough Money',
      message: `The game "${game.gameNames.en}" costs $${decimalPipe.transform(game.costToJoin)} to play. You currently have $${decimalPipe.transform(subscriber.wallet)} in your wallet.`,
      buttons: [hasMoney ? 'Purchase' : 'Add Money to Wallet', 'Cancel']
    }).onClose.subscribe(response => {
      if (response === 'Purchase') {
        store.dispatch(new JoinGameAction(game.id));
        result.next(true);
      } else if (response === 'Add Money to Wallet') {
        store.dispatch(new GoAction(['/user/wallet/add']));
        result.next(false);
      } else {
        result.next(false);
      }
    });
  };

  if (loggedIn) {
    purchaseAndJoinGame();
  } else {
    showShouldBeLoggedIn(dialog, store);
    result.next(false);
  }

  return result.asObservable().pipe(take(1));
}

export function showShouldBeLoggedIn(dialog: BaseDialogService, store: Store<AppState>): void {
  dialog.open({
    title: 'Not Logged In',
    message: 'You need to be logged in to play a game!',
    buttons: ['Login', 'Sign Up', 'Cancel']
  }).onClose.subscribe(resp => {
    if (resp === 'Login') {
      store.dispatch(new GoAction(['/auth/login'])) //{ animated: true, transition: { name: 'slideTop' } }));
    } else if (resp === 'Sign Up') {
      store.dispatch(new GoAction(['/auth/signup']))//, { animated: true, transition: { name: 'slideTop' } }));
    }
  });
}

/**
 * The dialog will close with either 'pool' or 'join' meaning to play next pool round of join game
 * @param game
 */
export function createJoinGameOrPoolDialog(game: Game): DialogContent[] {
  const nextRound = getNextRound(game);

  let joinContent: DialogContent[] = [];
  if (game.userJoinedGame) {
    joinContent = [
      new DialogContent('text', {
        text: 'Congrats on joining the game!',
        fontSize: 16,
        center: true
      }),
      new DialogContent('text', {
        fontSize: 16,
        mTop: 10,
        spans: [
          new DialogContent('text', {
            text: 'Be here ready to play'
          }),
          new DialogContent('text', {
            text: formatRelative(game.expectedStartDateForBracketPlay, new Date()),
            bolded: true
          })
        ]
      }),
    ];
  } else {
    joinContent = [
      new DialogContent('text', {
        fontSize: 18, center: true, text: `This game's tournament is for:`
      }),
      new DialogContent('text', {
        fontSize: 18, center: true, accent: true, mTop: 5,
        text: '$' + formatNumber(game.topPayout),
      }),
      new DialogContent('button', {
        text: 'Join the Tournament!',
        mTop: 10,
        center: true,
        accentGreen: true,
        clickResponse: 'join'
      }),
      new DialogContent('text', {
        fontSize: 14,
        mTop: 10,
        center: true,
        spans: [
          new DialogContent('text', {
            text: 'Tournament starts '
          }),
          new DialogContent('text', {
            text: formatRelative(game.expectedStartDateForBracketPlay, new Date()),
            bolded: true
          })
        ]
      }),
    ]
  }

  let poolContent: DialogContent[] = [];
  if (nextRound) {
    const firstRound = game.rounds.indexOf(nextRound) === 0;
    poolContent = [
      new DialogContent('text', {
        text: game.userJoinedGame ? `You have ${firstRound ? 'a' : 'another'} free Warmup round to play!` :
          `Not ready to join the game yet?`,
        center: true,
        mTop: 20,
        fontSize: 16
      }),
      new DialogContent('link', {
        text: game.userJoinedGame ? `Play Warmup Round` : `Play ${firstRound ? 'A' : 'Another'} Free Warmup Round`,
        mTop: 5,
        fontSize: 16,
        center: true,
        clickResponse: 'pool'
      })
    ]
  } else {
    poolContent = [
      new DialogContent('text', {
        text: `${game.hasPoolRounds ? 'You have finished this game\'s' : 'This game has no'} Warmup Rounds, be sure to join the game so you can play the Tournament!`,
        center: true,
        fontSize: 16,
        mTop: 20
      })
    ]
  }

  return [
    ...joinContent,
    new DialogContent('divider', {mTop: 20}),
    ...poolContent
  ];
}
