import * as CryptoJS from 'crypto-js/core';
import 'crypto-js/sha256';
import 'crypto-js/enc-utf8';
import 'crypto-js/aes';
import * as scrypt from 'scrypt-async';
import * as base64 from 'base-64';
import {Observable, Subject, BehaviorSubject, interval, of, NEVER} from 'rxjs';
import {distinct, map, take, takeUntil, tap, startWith, switchMap} from 'rxjs/operators';
import {Game, GameStatus, NormalizedGame, Round} from '@snowl/base-app/model';
import {Action, ActionReducer} from '@ngrx/store';
import {createAnimation, EasingFunctions} from "@snowl/base-app/animations";
import {DecimalPipe} from '@angular/common';
import {Type} from '@angular/core';
import {VxDialogDef} from 'vx-components';

export function scryptString(str: string): Promise<string> {
  const salt = create64BitSalt();
  const logN = 12;
  const r = 8;
  const dkLen = 32;
  return new Promise(resolve => {
    scrypt(
      str,
      salt,
      logN,
      r,
      dkLen,
      (key: any) => {
        const params = ((logN << 16) | (r << 8) | 1).toString(16);
        resolve(`$s0$${params}$${base64.encode(salt)}$${key}`);
      },
      'base64'
    );
  });
}

export function decryptAES(decryptKey: string, text: string): string {
  const all = CryptoJS.enc.Utf8.parse(decryptKey);
  const key = CryptoJS.lib.WordArray.create(all.words.slice(0, 4)) as any;
  const ivWords = CryptoJS.lib.WordArray.create(all.words.slice(4, 8)) as any;
  const secretWords = CryptoJS.enc.Utf8.parse(text);
  const decrypted = CryptoJS.AES.decrypt(secretWords.toString(CryptoJS.enc.Latin1), key, {iv: ivWords});
  return CryptoJS.enc.Utf8.stringify(decrypted);
}

export function sha256(str: string): string {
  return CryptoJS.SHA256(str).toString();
}

export function immutablePop<T>(arr: T[], num = 1): T[] {
  return arr.slice(0, -num);
}

export function getValue<T>(x: Observable<T>): T {
  let val: T;
  x.pipe(take(1)).subscribe(v => (val = v));
  return val!;
}

export function keyBy<T, X extends keyof T, K extends T[X] & string>(obj: T[], prop: X): { [F in K]: T } {
  const result: any = {};
  for (const item of obj) {
    if (item[prop]) {
      result[item[prop]] = item;
    }
  }
  return result;
}

export function findInArr<T, X extends keyof T>(arr: T[], prop: X, value: T[X]): T | undefined {
  for (const item of arr) {
    if (item[prop] === value) return item;
  }
}

export function isEmpty(obj: any): boolean {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

export function getNextRound(game: Game): Round | undefined {
  if (game.gameStatus !== 'OPEN')
    return;

  let nextRound;

  // TODO: make this more robust
  for (const round of game.rounds) {
    if (round.roundStatus === "CANCELLED" || round.roundStatus === "FULL")
      return;

    if ((round.roundStatus === 'OPEN' || round.roundStatus === 'INPLAY') && !round.finished) {
      nextRound = round;
      break;
    }
  }

  return nextRound;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function getPrevRound(game: Game): Round | undefined {
  let lastRound;
  for (const round of game.rounds) {
    if (round.userJoinedRound) {
      lastRound = round;
    }
  }

  return lastRound;
}

export function shouldShowGame(game: Game | NormalizedGame): boolean {
  let result = true;
  const hiddenStatuses: GameStatus[] = ['CLOSED', 'CANCELLED', 'PENDING'];

  if (game.gameStatus === 'INPLAY' && !game.userJoinedGame) { // TODO: change this so people can watch tournaent
    result = false;
  } else if (hiddenStatuses.indexOf(game.gameStatus) !== -1) {
    result = false;
  }

  return result;
}

function create64BitSalt(): string {
  const numbers = new Array(64);
  for (let i = 0; i < numbers.length; i++) {
    numbers[i] = Math.floor(Math.random() * 95 + 32);
  }
  let output = '';
  for (const number of numbers) {
    output += String.fromCharCode(number);
  }
  output = output.toLowerCase();
  return output;
}

export function chainReducers<T, V extends Action>(reducers: ActionReducer<T, V>[]): ActionReducer<T, V> {
  return function (state: T | undefined, action: V): T {
    for (const reducer of reducers) {
      state = reducer(state, action);
    }
    return state!;
  };
}

export function compare<T, K extends keyof T>(obj1: T, obj2: T, key: K): boolean {
  if (obj1 === obj2) {
    return true;
  } else if (!obj2 || !obj1) {
    return false;
  } else {
    return obj1[key] === obj2[key];
  }
}

export function truncateNumber(num: number, precision: number): number {
  const str = '' + num;
  let [first, second] = str.split('.');

  if (!first)
    first = '0';

  if (!second)
    second = '00000';

  if (precision <= 0)
    return +first;
  else {
    return +`${first}.${second.slice(0, precision)}`;
  }
}

/**
 *
 * @param {number} from
 * @param {number} to
 * @param {number} time
 * @param {number} precision pass in -1 to have maximum precision
 * @param {(t: number) => number} easing
 * @returns {NumAnim}
 */
export function animateNumber(from: number, to: number, time: number, precision = 0, easing = EasingFunctions.linear): NumAnim {
  const diff = to - from;
  const cancelSubject = new Subject();

  const result = createAnimation(time, easing).pipe(
    map((amount) => {
      return amount * diff + from;
    }),
    map(number => {
      const resp = precision === -1 ? number : truncateNumber(number, precision);

      if (number === to || resp === to) {
        result.finished = true;
        return to;
      }

      return resp;
    }),
    distinct(),
    takeUntil(cancelSubject)
  ) as NumAnim;


  result.finished = false;
  result.cancel = () => {
    cancelSubject.next();
    cancelSubject.complete();
  };


  return result;
}

export interface NumAnim extends Observable<number> {
  finished: boolean;

  cancel(): void;
}

export function uuid(): string {
  let generated = "", i, random;
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;

    if (i === 8 || i === 12 || i === 16 || i === 20) {
      generated += "-"
    }
    generated += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
  }
  return generated;
}

export function boundNumber(num: number, min: number, max: number): number {
  return num < min ? min : num > max ? max : num;
}

export function calculateDistance(aX: number, aY: number, bX: number, bY: number): number {
  const xDistance = aX - bX;
  const yDistance = aY - bY;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

export function waitUntilTrue(trueFunction: () => boolean, testInterval = 100): Observable<any> {
  return interval(testInterval).pipe(
    startWith(0),
    switchMap(() => {
      if (trueFunction()) {
        return of(true);
      } else {
        return NEVER;
      }
    }),
    take(1)
  )
}

export function fillArray(itemCount: number, startNum = 0): number[] {
  const a = new Array(itemCount);
  for (let i = 0; i < itemCount; i++) {
    a[i] = startNum + i;
  }
  return a;
}

export function getMonthName(month: number): string {
  return ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ][month];
}

export function parseNumber(num: any): number {
  if (!num) {
    return 0;
  }
  num = num.toString();

  const negative = num.startsWith('-');
  const result = +num.replace(/[^0-9.]/g, '') || 0;
  return negative ? -result : result;
}

export function copyTextToClipboardWEBONLY(text: string): boolean {
  const textArea = document.createElement('textarea');

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.fontSize = '18px';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = '0';

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);

  if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
    textArea.contentEditable = 'true';
    textArea.readOnly = true;
    const range = document.createRange();
    range.selectNodeContents(textArea);
    const selection = window.getSelection();
    if (!selection) return false;

    selection.removeAllRanges();
    selection.addRange(range);
    textArea.setSelectionRange(0, 999999);
  } else {
    textArea.select();
  }

  let successful = false;
  try {
    successful = document.execCommand('copy');
  } catch (err) {
    successful = false;
    console.log('Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
  return successful;
}

export function flattenArray<T>(arr: T[][]): T[] {
  if (!arr || !arr.length) return [];

  return ([] as T[]).concat(...arr);
}

export function formatNumber(a: any): string {
  const decimalPipe = new DecimalPipe('EN');
  return decimalPipe.transform(a)!;
}
export type Constructor<T> = Function & {prototype: T};

export function dialogOfType<T, S = any>(value: Constructor<S>): Type<VxDialogDef<T> & S> {
  return value as any;
}
