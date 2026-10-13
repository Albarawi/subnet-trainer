import test from 'node:test';
import assert from 'node:assert/strict';
import { topics } from '../src/lessons.js';

test('first lesson defines the concept and includes an independently checked example', () => {
  const topic = topics[0];
  assert.equal(topic.id, 'binary-decimal');
  assert.equal(topic.order, 1);
  for (const field of ['title', 'objective', 'workedExample']) assert.ok(topic[field].length > 20);
  assert.ok(topic.terms.some(term => term.name === 'Octet'));
  assert.match(topic.workedExample, /01110010/);
  assert.match(topic.workedExample, /64 \+ 32 \+ 16 \+ 2 = 114/);
  for (const pool of Object.values(topic.questionPools)) {
    assert.ok(pool.length >= 6);
    assert.equal(new Set(pool.map(variant => variant.id)).size, pool.length);
  }
});

test('six core topics have complete lessons and both question pools', () => {
  assert.equal(topics.slice(0,6).length, 6);
  topics.slice(0,6).forEach((topic, index) => {
    assert.equal(topic.order, index + 1);
    assert.ok(topic.objective && topic.terms.length && topic.workedExample && topic.lesson.length);
    for (const pool of Object.values(topic.questionPools)) assert.ok(pool.length >= 6);
  });
  assert.match(topics[4].lesson.join(' '), /\/31.*\/32/);
});
