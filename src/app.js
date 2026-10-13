import { createSession, submitAnswer, nextQuestion, openTopic, startNextTopic, startReview, leaveReview, setPracticeMode } from './session.js';
import { render } from './ui.js';

const session = createSession();
const root = document.querySelector('main');
const actions = {
  practice() { session.screen = 'practice'; render(root, session, actions, 'question-title'); },
  lesson() { session.screen = 'lesson'; render(root, session, actions, 'start-practice'); },
  submit(answer) { submitAnswer(session, answer); render(root, session, actions, session.result ? 'feedback-title' : 'input-hint'); },
  next() { nextQuestion(session); render(root, session, actions, 'question-title'); },
  topic(id) {
    session.navigationHint = openTopic(session, id) ? '' : 'Complete the previous lesson to unlock this topic.';
    render(root, session, actions);
  },
  nextTopic() { startNextTopic(session); render(root, session, actions, 'start-practice'); },
  mode(mode) { setPracticeMode(session, mode); render(root, session, actions, 'question-title'); },
  reviewChoice(id) {
    session.reviewReturnScreen = session.screen === 'review-choice' ? session.reviewReturnScreen : session.screen;
    session.reviewChoiceTopicId = id; session.screen = 'review-choice'; render(root, session, actions);
  },
  reviewMode(mode) {
    const topicId = session.reviewChoiceTopicId;
    session.screen = session.reviewReturnScreen;
    startReview(session, topicId, mode); render(root, session, actions, 'question-title');
  },
  cancelReviewChoice() { session.screen = session.reviewReturnScreen; render(root, session, actions); },
  returnLearning() { leaveReview(session); render(root, session, actions, session.screen === 'practice' ? 'question-title' : 'start-practice'); },
};
render(root, session, actions);
