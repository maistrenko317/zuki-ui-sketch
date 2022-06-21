import {PublicProfile, Subscriber} from "@snowl/base-app/model";
import * as CryptoJS from 'crypto-js';

export function queryStringToJSON(queryString: string): any {
  if(queryString.indexOf('?') > -1){
    queryString = queryString.split('?')[1];
  }
  const pairs = queryString.split('&');
  const result: any = {};
  pairs.forEach((pair: string) => {
    const split = pair.split('=');
    result[split[0]] = decodeURIComponent(split[1] || '');
  });
  return result;
}

export function getPublicProfileFromSubscriber(sub: Subscriber): PublicProfile {
  return {
    nickname: sub.nickname,
    photoUrl: sub.photoUrl,
    primaryIdHash: sub.primaryIdHash,
    subscriberId: sub.subscriberId
  }
}

export function encryptAES(toEncrypt: string): {result: string, decryptKey: string} {
  const iv = 'aaaaaaaaaaaaaaaa';
  const password = iv;

  return {
    result: CryptoJS.AES.encrypt(toEncrypt, CryptoJS.enc.Utf8.parse(password), {iv: CryptoJS.enc.Utf8.parse(iv)}).toString(),//CryptoJS.enc.Latin1),
    decryptKey: password + iv
  }
}
