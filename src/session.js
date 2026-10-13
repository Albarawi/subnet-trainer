import { topics } from './lessons.js';
import { createQuestion } from './questions.js';
import { gradeAnswer } from './grading.js';

const practiceFields = ['topic','question','result','hint','selectedAnswer','screen','mode','streak','notice'];
function rememberTopic(session) {
  session.topicProgress[session.topic.id] = Object.fromEntries(practiceFields.map(key => [key, session[key]]));
}
export function createSession(random = Math.random) {
  return { topic: topics[0], question: createQuestion(topics[0], 'multiple-choice', null, random),
    result: null, hint: '', selectedAnswer: '', screen: 'lesson', mode: 'multiple-choice',
    streak: 0, completedTopicIds: [], typedUnlockedTopicIds: [], topicProgress: {}, notice: '' };
}
export function submitAnswer(session, answer) {
  if (session.result) return;
  const result = gradeAnswer(session.question, answer);
  session.hint = result.outcome === 'invalid' ? result.hint : '';
  if (result.outcome === 'invalid') return;
  session.result = result; session.navigationHint = '';
  session.streak = result.outcome === 'correct' ? session.streak + 1 : 0;
  session.notice = '';
  if (session.reviewing) {
    if (session.streak === (session.mode === 'multiple-choice' ? 5 : 3)) {
      session.streak = 0; session.notice = 'Practice streak reached! Continue or return to learning.';
    }
    return;
  }
  if (session.mode === 'multiple-choice' && session.streak === 5) {
    if (!session.typedUnlockedTopicIds.includes(session.topic.id)) session.typedUnlockedTopicIds.push(session.topic.id);
    session.mode = 'typed'; session.streak = 0;
    session.notice = 'Five in a row! Typed practice is now unlocked for this lesson.';
  } else if (session.mode === 'typed' && session.streak === 3) {
    if (!session.completedTopicIds.includes(session.topic.id)) session.completedTopicIds.push(session.topic.id);
    session.notice = 'Lesson complete! Choose another lesson or keep practicing in review.';
  }
}
export function nextQuestion(session, random = Math.random) {
  if (!session.result || (!session.reviewing && session.completedTopicIds.includes(session.topic.id))) return;
  session.question = createQuestion(session.topic, session.mode, session.question.variantId, random);
  session.result = null; session.hint = ''; session.selectedAnswer = ''; session.notice = '';
}
export function openTopic(session, topicId, random = Math.random) {
  const topic = topics.find(item => item.id === topicId);
  if (!topic) return false;
  if (session.reviewing) leaveReview(session);
  if (topicId !== session.topic.id) {
    rememberTopic(session);
    const saved = session.topicProgress[topicId];
    if (saved) Object.assign(session, saved);
    else Object.assign(session, { topic, mode: 'multiple-choice', streak: 0,
      question: createQuestion(topic, 'multiple-choice', null, random),
      result: null, hint: '', selectedAnswer: '', notice: '' });
  }
  session.screen = 'lesson'; return true;
}
export function startNextTopic(session, random = Math.random) {
  if (session.reviewing || !session.completedTopicIds.includes(session.topic.id)) return false;
  const next = topics[session.topic.order];
  return next ? openTopic(session, next.id, random) : false;
}
export function setPracticeMode(session, mode, random = Math.random) {
  if (!['multiple-choice','typed'].includes(mode)) return false;
  if (mode === 'typed' && !session.typedUnlockedTopicIds.includes(session.topic.id)) return false;
  if (session.completedTopicIds.includes(session.topic.id) && !session.reviewing) return startReview(session, session.topic.id, mode, random);
  if (session.mode !== mode || session.question.mode !== mode) {
    session.mode = mode; session.streak = 0;
    session.question = createQuestion(session.topic, mode, session.question.variantId, random);
    session.result = null; session.hint = ''; session.selectedAnswer = ''; session.notice = '';
  }
  session.screen = 'practice'; return true;
}
export function startReview(session, topicId, mode, random = Math.random) {
  if (!session.completedTopicIds.includes(topicId) || !['multiple-choice','typed'].includes(mode)) return false;
  if (mode === 'typed' && !session.typedUnlockedTopicIds.includes(topicId)) return false;
  if (session.reviewing) leaveReview(session);
  const savedLearning = { ...session };
  const topic = topics.find(item => item.id === topicId);
  Object.assign(session, { savedLearning, reviewing: true, topic, mode, streak: 0,
    question: createQuestion(topic, mode, null, random), result: null, hint: '', selectedAnswer: '',
    notice: '', screen: 'practice', navigationHint: '' });
  return true;
}
export function leaveReview(session) {
  if (!session.reviewing) return false;
  const saved = session.savedLearning;
  for (const key of Object.keys(session)) delete session[key];
  Object.assign(session, saved); return true;
}
