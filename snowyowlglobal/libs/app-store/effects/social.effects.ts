import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {BaseDialogService, DialogContent} from '@snowl/base-app/shared';
import {GetLocalStorageSuccessAction, InviteFriendsAction, SetLocalStorageAction} from '@snowl/app-store/actions';
import {debounceTime, distinctUntilChanged, filter, map, switchMap, tap} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, merge, of, Subject, zip} from 'rxjs';
import {BaseToolService} from '@snowl/base-app/user/base-tool.service';
import {getValue} from '@snowl/base-app/util';
import {AppState} from '@snowl/app-store/reducers';
import {select, Store} from '@ngrx/store';
import {getIsLoggedIn, getReferralUrl, getSubscriber} from '@snowl/app-store/selectors';
import {Subscriber} from '@snowl/base-app/model';

@Injectable()
export class SocialEffects {

  @Effect({dispatch: false})
  inviteFriends$ = this.actions.pipe(
    ofType<InviteFriendsAction>(InviteFriendsAction.type),
    tap((action) => {
      const content: DialogContent[] = [
        new DialogContent('text', {text: 'Your Url', center: true, bolded: true, fontSize: 16}),
        new DialogContent('spinner', {mTop: 15}),
        new DialogContent('text', {text: '1. You share your link', mTop: 15, fontSize: 16}),
        new DialogContent('text', {text: '2. Others sign up with your link', fontSize: 16}),
        new DialogContent('text', {text: '3. When they play a game you win!', fontSize: 16}),
      ];
      const content$ = new BehaviorSubject<DialogContent[]>(content);

      const dialog = this.dialog.open({
        title: 'Invite Friends',
        content: content$,
        buttons: ['Copy Url', 'Close']
      });


      let url: string;
      let needsLoad = true;
      if (!action.game) {
        url = `play/auth/signup?r=${encodeURIComponent(action.sub ? action.sub.nickname : '')}`;
        const refUrl = getValue(this.store.pipe(select(getReferralUrl)));
        if (refUrl) {
          url = refUrl;
          needsLoad = false;
        }
      } else if (action.sub && action.sub.subscriberId && action.sub.nickname) {
        url = `play/game/${action.game.id}?r=${encodeURIComponent(action.sub.nickname)}`;
      } else {
        url = `play/game/${action.game.id}`;
      }

      const loader = needsLoad ? this.toolService.shortenUrl(url) : of(url);
      loader.subscribe(newUrl => {
        url = newUrl;
        content[1] = new DialogContent('link', {
          text: url,
          link: url,
          mTop: 15,
          bolded: true,
          center: true
        });

        content$.next(content);
      });

      dialog.onClose.subscribe((resp) => {
        content$.complete();

        if (resp === 'Copy Url') {
          this.toolService.copyToClipboard(url);
        }
      })

    })
  );

  @Effect()
  loadReferralUrl$ = combineLatest(
    this.store.pipe(select(getIsLoggedIn)),
    this.store.pipe(select(getReferralUrl))
  ).pipe(
    filter(([loggedIn, url]) => {
      return loggedIn && !url
    }),
    map(() => getValue(this.store.pipe(select(getSubscriber)))),
    filter((sub): sub is Subscriber => !!sub),
    switchMap(sub => {
      const  url = `play/auth/signup?r=${encodeURIComponent(sub.nickname)}`;
      return this.toolService.shortenUrl(url);
    }),
    map(url => new SetLocalStorageAction({referralUrl: url}))
  );

  constructor(private actions: Actions, private dialog: BaseDialogService, private toolService: BaseToolService, private store: Store<AppState>) {

  }
}
