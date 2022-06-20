import {Question} from "@snowl/base-app/model";
import {randomInt, uuid} from "@snowl/base-app/util";

const questions: {[id: string]: Question} = {};

let questionNumber = 1;

export function generateQuestion(): Question {
  const question: Question = {
    id: uuid(),
    questionText: {
      en: 'Generated Question #' + questionNumber
    },
    answers: [
      {
        id: uuid(),
        answerText: {
          en: 'Answer 1'
        },
        correct: true
      }, {
        id: uuid(),
        answerText: {
          en: 'Answer 2'
        },
        correct: false
      }, {
        id: uuid(),
        answerText: {
          en: 'Answer 3'
        },
        correct: false
      }
    ],
    type: 'REGULAR'
  };

  questions[question.id] = question;
  questionNumber++;
  return question;
}

export function getQuestionFromDb(id: string): Question {
  return questions[id];
}

export function getRandomQuestionForUser(tieBreaker = false): Question {
  const ids = Object.keys(questions);
  const id = ids[randomInt(0, ids.length - 1)];
  return {
    ...questions[id],
    type: tieBreaker ? "TIEBREAKER" : "REGULAR"
  };
}
