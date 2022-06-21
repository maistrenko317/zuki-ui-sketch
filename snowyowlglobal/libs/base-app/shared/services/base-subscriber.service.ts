import {Injectable} from '@angular/core';
import {BaseHttpService} from './base-http.service';
import {decryptAES, getValue, scryptString, sha256} from '../../util';
import {ShoutResponse} from '../../model';
import {from as fromPromise, Observable, of, zip} from 'rxjs';
import {catchError, map, mapTo, switchMap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {AppState, SignupForm} from '@snowl/app-store/reducers';
import {
  fillSubscriberFromJson,
  NormalizedGame,
  Subscriber,
  SubscriberAddress
} from '@snowl/base-app/model';
import {GamePlayer} from '@snowl/base-app/model/game-player';
import {PublicProfile} from '@snowl/base-app/model/public-profile';
import {BaseGameService} from './base-game.service';
import {Country} from '@snowl/base-app/model/country';
import {BaseNotificationService} from "./base-notification.service";
import {getLocalStorage, getRouterState} from '@snowl/app-store/selectors';
import {LogService} from '@snowl/base-app/shared/services/log.service';
import {ShoutErrorResponse} from '@snowl/base-app/error';
import {Result} from 'ts-results';
import {elseMapTo, resultMap} from 'ts-results/rxjs-operators';
import {NormalizedResponse} from '@snowl/app-store/normalizer';

@Injectable()
export class BaseSubscriberService {
  constructor(private http: BaseHttpService, private store: Store<AppState>, private logService: LogService,
              private gameService: BaseGameService, private notificationService: BaseNotificationService) {
  }

  login(email: string, password: string): Observable<Result<SubscriberSession, ShoutErrorResponse<LoginResponse>>> {
    password = sha256(password);

    return this.http
      .sendCollectorRequest<LoginResponse>('/auth/login', {email, password}, true)
      .pipe(resultMap(parseLoginData));
  }

  signup(form: SignupForm): Observable<Result<SubscriberSession, ShoutErrorResponse<SignupResponse>>> {
    const pass = sha256(form.password!);
    return fromPromise(scryptString(pass)).pipe(
      switchMap(password => {
        return this.http
          .sendCollectorRequest<SignupResponse>('/auth/signup', {
            ...form,
            password,
            languageCode: 'en', // TODO: don't hardcode these
            countryCode: 'US',
            referrerNickname: getValue(this.store.pipe(select(getLocalStorage))).referralNickname
          }, true)
          .pipe(resultMap(parseLoginData));
      })
    );
  }

  loadSubscriber(): Observable<Result<Subscriber, ShoutErrorResponse<SubscriberDetailsResponse>>> {
    return this.http.sendCollectorRequest<SubscriberDetailsResponse>('/snowl/subscriber/details').pipe(
      resultMap(resp => {
        const subscriber = resp.profile;
        subscriber.wallet = Math.round(resp.balance);
        subscriber.availableWallet = resp.availableBalance;
        subscriber.gamePlayers = resp.gamePlayers;

        let hasPref = false;
        const ROUND_PREF_TYPE = 13;
        for (const pref of resp.prefs) {
          if (pref.prefType === ROUND_PREF_TYPE) {
            hasPref = true;
            subscriber.notificationPreference = pref.value;
            break;
          }
        }

        if (!hasPref) {
          subscriber.notificationPreference = 'NOT_SET';
        }


        return fillSubscriberFromJson(subscriber);
      })
    );
  }


  loadPublicProfiles(subscriberIds: number[]): Observable<Result<PublicProfile[], ShoutErrorResponse<ProfileResponse>>> {
    return this.http
      .sendCollectorRequest<ProfileResponse>('/subscriber/getPublicProfile', {subscriberIds})
      .pipe(resultMap(resp => resp.profiles));
  }

  loadSubscriberGames(subscriber: Subscriber): Observable<NormalizedGame[]> {
    const gamePlayers = subscriber.gamePlayers.filter(
      gp => gp.determination !== 'INPLAY' && gp.determination !== 'SIDELINES'
    );
    if (!gamePlayers.length) {
      return of([]);
    }

    const grabbers = gamePlayers.map(gp => {
      return this.gameService.getGameById(gp.gameId).pipe(
        catchError(() => of(null))
      )
    });
    return zip(...grabbers).pipe(
      map(responses => responses.filter((r): r is NormalizedResponse => !!r).map(resp => resp.game)),
      map(games => games.sort((a, b) => (a.closedDate! > b.closedDate! ? -1 : 1)))
    );
  }

  update(toUpdate: Partial<Subscriber>): Observable<Result<UpdateSubscriberResponse, ShoutErrorResponse<UpdateSubscriberResponse>>> {
    return this.http.sendCollectorRequest<UpdateSubscriberResponse>('/subscriber/update', toUpdate, true);
  }

  getCountries(): Observable<Country[]> {
    return this.http.getWdsDoc<Country[]>('/countries.json');
  }

  addSubscriberAddress(address: SubscriberAddress): Observable<Result<number, ShoutErrorResponse<AddAddressResponse>>> {
    return this.http
      .sendCollectorRequest<AddAddressResponse>('/subscriber/address/add', {address: JSON.stringify(address)})
      .pipe(resultMap(resp => resp.addressId));
  }

  getEmailsAndAddresses(): Observable<Result<EmailsAddressesResponse, ShoutErrorResponse<EmailsAddressesResponse>>> {
    return this.http.sendCollectorRequest<EmailsAddressesResponse>('/subscriber/getEmailsAndAddresses');
  }

  checkNickname(nickname: string): Observable<boolean> {
    return this.http.sendCollectorRequest<CheckNicknameResponse>('/subscriber/checkUsername', {username: nickname}).pipe(
      resultMap(resp => resp.usernameIsUnique),
      elseMapTo(false)
    );
  }

  requestResetPassword(email: string): Observable<boolean> {
    return this.http.sendCollectorRequest('/subscriber/password/requestReset', {email}).pipe(
      mapTo(true),
      catchError((e) => {
        this.logService.error('An unexpected error occurred requesting a password reset: ', e);
        return of(false)
      })
    );
  }

  resetPassword(resetPasswordCode: string, newPassword: string): Observable<Result<ShoutResponse, ShoutErrorResponse>> {
    return this.http.sendCollectorRequest('/subscriber/password/reset', {c: resetPasswordCode, newPassword});
  }

}

export interface CheckNicknameResponse extends ShoutResponse {
  usernameIsUnique: boolean;
}

export interface SignupResponse extends ShoutResponse<'emailAlreadyUsed' | 'nicknameAlreadyUsed' | 'nicknameInvalid'> {
  sessionKey: string;
  subscriber: string;
}

export interface UpdateSubscriberResponse extends ShoutResponse<'emailAlreadyUsed' | 'nicknameAlreadyUsed' | 'nicknameInvalid'> {
  subscriber: string;
}


export interface LoginResponse extends ShoutResponse<'invalidLogin' | 'accountDeactivated' | 'passwordChangeRequired'> {
  sessionKey: string;
  subscriber: string;
}

export interface SubscriberDetailsResponse extends ShoutResponse {
  prefs: { prefType: number; value: 'NONE' | 'SMS' | 'EMAIL' }[];
  balance: number;
  availableBalance: number;
  gamePlayers: GamePlayer[];
  profile: Subscriber;
}

export interface ProfileResponse extends ShoutResponse {
  profiles: PublicProfile[];
}

export interface AddAddressResponse extends ShoutResponse {
  addressId: number;
}

interface EmailsAddressesResponse extends ShoutResponse {
  emails: string[];
  addresses: SubscriberAddress[];
}

export interface SubscriberSession {
  sessionKey: string,
  subscriber: Subscriber
}

function parseLoginData(resp: SignupResponse | LoginResponse): SubscriberSession {
  const session = decryptAES(resp.ticketResponse!.encryptKey, resp.sessionKey);
  const subscriber = JSON.parse(decryptAES(resp.ticketResponse!.encryptKey, resp.subscriber)) as Subscriber;
  return {sessionKey: session, subscriber: fillSubscriberFromJson(subscriber)};
}
