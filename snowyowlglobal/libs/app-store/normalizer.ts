import { Game, NormalizedGame, Round, SyncMessage } from '@snowl/base-app/model';

export interface NormalizedResponse {
  game: NormalizedGame;
  rounds: Round[];
}

export function normalizeGame(game: Game): NormalizedResponse {
  const { rounds } = game;
  const normalized = {
    ...game,
    rounds: rounds.map(r => r.id)
  };

  return { rounds, game: normalized };
}

export function denormalizeGame(game: NormalizedGame, rounds: Dict<Round>): Game {
  return {
    ...game,
    rounds: game.rounds.map(round => rounds[round])
  };
}
