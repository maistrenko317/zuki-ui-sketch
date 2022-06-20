import {Subscriber} from "@snowl/base-app/model";
import {uuid} from "@snowl/base-app/util";

export interface MatchDb {
  id: string;
  sub1: Subscriber;
  sub2: Subscriber;
  gameId: string;
}

const matches: {[id: string]: MatchDb} = {};

export function addMatchToDb(sub1: Subscriber, sub2: Subscriber, gameId: string): MatchDb {
  const result: MatchDb = {
    sub1, sub2, gameId, id: uuid()
  };
  matches[result.id] = result;
  return result;
}

export function getMatchFromDb(id: string): MatchDb {
  return matches[id];
}
