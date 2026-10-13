import test from 'node:test';
import assert from 'node:assert/strict';
import { createQuestion } from '../src/questions.js';
import { topics } from '../src/lessons.js';
import { gradeAnswer } from '../src/grading.js';

test('question generation is reproducible and never immediately repeats a variant', () => {
  const first = createQuestion(topics[0], 'multiple-choice', null, () => 0);
  assert.deepEqual(first, createQuestion(topics[0], 'multiple-choice', null, () => 0));
  assert.notEqual(createQuestion(topics[0], 'multiple-choice', first.variantId, () => 0).variantId, first.variantId);
});

test('all core variants supply valid formats, unique choices, and grade their canonical answers', () => {
  for (const topic of topics) {
    for (const mode of ['multiple-choice', 'typed']) {
      for (let index = 0; index < topic.questionPools[mode].length; index++) {
        const question = createQuestion(topic, mode, null, () => (index + 0.1) / topic.questionPools[mode].length);
        assert.ok(question.formatExample);
        assert.equal(gradeAnswer(question, question.solution.answer).outcome, 'correct');
        if (mode === 'multiple-choice') {
          assert.equal(new Set(question.options).size, 4);
          assert.equal(question.options.filter(answer => answer === question.solution.answer).length, 1);
        }
      }
    }
  }
});

test('later lesson examples match independent expected values', () => {
  const expected = ['192', '255.0.0.0', '192.168.1.128', '62', '192.168.0.64/26'];
  topics.slice(1,6).forEach((topic, index) => {
    assert.equal(createQuestion(topic, 'typed', null, () => 0).solution.answer, expected[index]);
  });
});

test('supernet questions distinguish exact aggregation from a covering prefix', () => {
  const topic = topics.find(topic => topic.id === 'supernetting');
  assert.equal(createQuestion(topic, 'typed', null, () => 0).solution.answer, '192.168.0.0/23');
  const nonexact = createQuestion(topic, 'typed', null, () => 1.1 / 40);
  assert.equal(nonexact.solution.answer, 'no');
  assert.match(nonexact.solution.steps.join(' '), /alignment|aligned/);
  assert.equal(gradeAnswer(nonexact, ' NO ').outcome, 'correct');
});

test('each multiple-choice variant has exactly four unique options and one correct answer', () => {
  for (let index = 0; index < 6; index++) {
    const question = createQuestion(topics[0], 'multiple-choice', null, () => (index + 0.1) / 40);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options.filter(option => option === question.solution.answer).length, 1);
    assert.ok(question.solution.steps.join(' ').includes(question.solution.answer));
  }
});

test('binary 01110010 is graded against independent decimal 114', () => {
  const question = createQuestion(topics[0], 'multiple-choice', null, () => 0);
  assert.match(question.prompt, /01110010/);
  assert.equal(question.solution.answer, '114');
  assert.match(question.solution.steps.join(' '), /64 \+ 32 \+ 16 \+ 2 = 114/);
});


test('all seven lessons have forty distinct question prompts per mode', () => {
  assert.equal(topics.length, 7);
  for (const topic of topics) for (const mode of ['multiple-choice','typed']) {
    assert.equal(topic.questionPools[mode].length, 40);
    const prompts = Array.from({length:40}, (_, index) => createQuestion(topic, mode, null, () => (index + 0.1) / 40).prompt);
    assert.equal(new Set(prompts).size, 40, topic.id);
  }
});
