import {mockSettings, MockSettings, setMockSettings} from "@snowl/mock/mock.settings";
import {generateQuestion} from "@snowl/mock/mocks/db/question.db";
import {addSubscriberToDb} from "@snowl/mock/mocks/db/subscriber.db";
import {addGameToDb} from "@snowl/mock/mocks/db/game.db";

const defaultSettings: MockSettings = {
  numGames: 2,
  numQuestions: 50,
  numSubscribers: 1,
  allowAllSessionKeys: true
};

export function initializeDb(settings = defaultSettings) {
  setMockSettings(settings);

  for (let i = 0; i < settings.numGames; i ++) {
    addGameToDb();
  }

  for (let i = 0; i < settings.numQuestions; i++) {
    generateQuestion();
  }

  for (let i = 0; i < settings.numSubscribers; i++) {
    const defaultPass = 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb'; // the character 'a'
    addSubscriberToDb(`user${i + 1}@gmail.com`, defaultPass, `user${i + 1}`);
  }
}
