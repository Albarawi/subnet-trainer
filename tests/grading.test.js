import test from 'node:test';
import assert from 'node:assert/strict';
import { gradeAnswer } from '../src/grading.js';
import { createQuestion } from '../src/questions.js';
import { topics } from '../src/lessons.js';

const question = createQuestion(topics[0], 'multiple-choice', null, () => 0);
test('correct and incorrect options both return the expected answer and explanation', () => {
  assert.equal(gradeAnswer(question, '114').outcome, 'correct');
  const wrong = gradeAnswer(question, question.options.find(option => option !== '114'));
  assert.equal(wrong.outcome, 'incorrect');
  assert.equal(wrong.answer, '114');
  assert.deepEqual(wrong.steps, question.solution.steps);
});

test('typed addresses and prefixes reject missing parts, unsupported scope, and invalid octets', () => {
  for (const [format, values] of [
    ['address', ['1.2.3', '256.1.2.3', '1.2.3.4x', '1.2.3.-1']],
    ['network', ['192.168.0.0', '192.168.0.0/31', '192.168.0.0/7', '192.168.0.0/024', '192.168.0.0/24/extra']],
  ]) {
    const typed = { mode: 'typed', answerFormat: format, solution: { answer: '192.168.0.0', steps: [] } };
    for (const value of values) assert.equal(gradeAnswer(typed, value).outcome, 'invalid');
  }
});
test('missing and unknown selections return a hint without revealing a solution', () => {
  for (const answer of ['', null, '999']) {
    const result = gradeAnswer(question, answer);
    assert.equal(result.outcome, 'invalid');
    assert.ok(result.hint);
    assert.equal(result.answer, undefined);
    assert.equal(result.steps, undefined);
  }
});

test('typed formats distinguish formatting errors from valid wrong answers', () => {
  for (const [format, answer, validWrong, invalid] of [
    ['decimal', '114', '115', '0114'], ['binary', '01110010', '01110011', '1110010'],
    ['address', '192.168.1.128', '192.168.1.129', '192.168.01.128'],
    ['network', '192.168.0.0/26', '192.168.0.64/26', '192.168.0.1/26'],
  ]) {
    const typed = { mode: 'typed', answerFormat: format, solution: { answer, steps: ['Explanation'] } };
    assert.equal(gradeAnswer(typed, ` ${answer} `).outcome, 'correct');
    assert.equal(gradeAnswer(typed, validWrong).outcome, 'incorrect');
    assert.equal(gradeAnswer(typed, invalid).outcome, 'invalid');
    assert.equal(gradeAnswer(typed, '').outcome, 'invalid');
  }
});
