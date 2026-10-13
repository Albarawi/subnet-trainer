import test from 'node:test';
import assert from 'node:assert/strict';
import { topics } from '../src/lessons.js';
import { createSession, submitAnswer, nextQuestion, openTopic, startReview, leaveReview, setPracticeMode } from '../src/session.js';

function correct(session, count) {
  for (let n=0;n<count;n++) { submitAnswer(session, session.question.solution.answer); if(n<count-1) nextQuestion(session,()=>0); }
}
test('every lesson including supernetting opens immediately, but typing is individually locked', () => {
  const session=createSession(()=>0);
  for(const topic of topics){assert.equal(openTopic(session,topic.id,()=>0),true);assert.equal(setPracticeMode(session,'typed',()=>0),false);}
});
test('exactly five consecutive choices unlock typed practice and three typed answers complete it',()=>{
  const session=createSession(()=>0);
  correct(session,4);assert.equal(session.mode,'multiple-choice');assert.equal(session.typedUnlockedTopicIds.length,0);
  nextQuestion(session,()=>0);correct(session,1);
  assert.equal(session.mode,'typed');assert.equal(session.question.mode,'multiple-choice');assert.deepEqual(session.typedUnlockedTopicIds,['binary-decimal']);
  nextQuestion(session,()=>0);correct(session,3);assert.deepEqual(session.completedTopicIds,['binary-decimal']);assert.ok(session.result);
});
test('switching lessons preserves questions, streaks, and per-lesson typed unlocks',()=>{
  const session=createSession(()=>0);correct(session,5);nextQuestion(session,()=>0);const question=session.question;
  openTopic(session,'supernetting',()=>0);assert.equal(setPracticeMode(session,'typed',()=>0),false);
  openTopic(session,'binary-decimal',()=>0);assert.equal(session.question,question);assert.equal(session.mode,'typed');assert.equal(setPracticeMode(session,'typed',()=>0),true);
});
test('invalid input preserves streak and wrong answers reset only the current streak',()=>{
  const session=createSession(()=>0);correct(session,1);nextQuestion(session,()=>0);submitAnswer(session,'');assert.equal(session.streak,1);
  submitAnswer(session,session.question.options.find(x=>x!==session.question.solution.answer));assert.equal(session.streak,0);assert.equal(session.mode,'multiple-choice');
});
test('duplicate submissions and ungraded Next cannot advance progress',()=>{
  const session=createSession(()=>0);const question=session.question;nextQuestion(session,()=>0);assert.equal(session.question,question);
  correct(session,1);submitAnswer(session,session.question.solution.answer);assert.equal(session.streak,1);
});
test('review restores exact learning state without changing unlocks',()=>{
  const session=createSession(()=>0);correct(session,5);nextQuestion(session,()=>0);correct(session,3);
  openTopic(session,'supernetting',()=>0);const question=session.question;
  assert.equal(startReview(session,'binary-decimal','typed',()=>0),true);correct(session,3);leaveReview(session);
  assert.equal(session.question,question);assert.equal(session.topic.id,'supernetting');assert.deepEqual(session.typedUnlockedTopicIds,['binary-decimal']);
});
test('typed unlock survives knowledge errors and allows either practice mode',()=>{
  const session=createSession(()=>0);correct(session,5);nextQuestion(session,()=>0);correct(session,1);nextQuestion(session,()=>0);
  submitAnswer(session,'');assert.equal(session.streak,1);submitAnswer(session,'0');assert.equal(session.streak,0);assert.equal(session.mode,'typed');
  assert.equal(setPracticeMode(session,'multiple-choice',()=>0),true);assert.equal(setPracticeMode(session,'typed',()=>0),true);
});
test('refresh creates a fresh session without typed unlocks',()=>{
  const session=createSession(()=>0);correct(session,5);const fresh=createSession(()=>0);assert.deepEqual(fresh.typedUnlockedTopicIds,[]);assert.deepEqual(fresh.completedTopicIds,[]);
});

test('learner can choose multiple choice immediately after unlocking typing',()=>{
  const session=createSession(()=>0);correct(session,5);
  assert.equal(setPracticeMode(session,'multiple-choice',()=>0),true);
  assert.equal(session.mode,'multiple-choice');assert.equal(session.question.mode,'multiple-choice');
  assert.equal(setPracticeMode(session,'typed',()=>0),true);
});
