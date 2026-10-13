import { topics } from './lessons.js';

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function button(text, action, className = 'button') {
  const node = element('button', text, className);
  node.type = 'button';
  node.addEventListener('click', action);
  return node;
}

export function render(root, session, actions, focusId) {
  root.replaceChildren();
  const header = element('header', undefined, 'page-header');
  header.append(element('span', 'SUBNET TRAINER', 'eyebrow'),
    element('h1', session.screen === 'lesson' ? 'Small steps. Clear understanding.' : 'Give the bits a try.'),
    element('p', 'Learn IPv4 at your own pace. No timer, no pressure.', 'intro'));
  root.append(header);

  const navigation = element('nav', undefined, 'topic-list');
  navigation.setAttribute('aria-label', 'Lessons');
  for (const topic of topics) {
    const complete = session.completedTopicIds.includes(topic.id);
    const status = complete ? 'Complete' : 'Available';
    const choice = button(`${topic.order}. ${topic.title} · ${status}`, () => complete ? actions.reviewChoice(topic.id) : actions.topic(topic.id), 'topic-button');
    if (topic.id === session.topic.id) choice.setAttribute('aria-current', 'step');
    navigation.append(choice);
  }
  navigation.append(element('p', 'All lessons are available. Each has 40 questions; five correct choices in a row unlock its typed practice.', 'mode'));
  root.append(navigation);

  const card = element('section', undefined, 'card');
  const displayedTopic = session.screen === 'review-choice' ? topics.find(topic => topic.id === session.reviewChoiceTopicId) : session.topic;
  card.append(element('p', `LESSON ${String(displayedTopic.order).padStart(2, '0')} · ${session.reviewing ? 'REVIEW' : 'IPV4 FOUNDATIONS'}`, 'eyebrow'), element('h2', displayedTopic.title));
  if (session.screen === 'review-choice') {
    card.append(element('p', 'Choose how to review. Your current learning question and completed lessons will be preserved.', 'objective'),
      button('Review with multiple choice', () => actions.reviewMode('multiple-choice')),
      button('Review with typed answers', () => actions.reviewMode('typed'), 'button secondary'),
      button('Back', actions.cancelReviewChoice, 'text-button'));
  } else if (session.screen === 'lesson') {
    card.append(element('p', session.topic.objective, 'objective'));
    const terms = element('dl', undefined, 'terms');
    for (const term of session.topic.terms) terms.append(element('dt', term.name), element('dd', term.definition));
    card.append(terms);
    for (const paragraph of session.topic.lesson) card.append(element('p', paragraph));
    const example = element('aside', undefined, 'example');
    example.append(element('h3', 'A worked example'), element('p', session.topic.workedExample));
    card.append(example);
    const start = button(session.result || session.selectedAnswer ? 'Return to practice' : 'Start practice', actions.practice);
    start.id = 'start-practice';
    card.append(start);
    const typed = button('Typed practice', () => actions.mode('typed'), 'button secondary');
    typed.disabled = !session.typedUnlockedTopicIds.includes(session.topic.id);
    card.append(typed, element('p', typed.disabled ? 'Typed practice locked: answer five multiple-choice questions correctly in a row in this lesson.' : 'Typed practice unlocked for this lesson.', 'mode'));
    card.append(button('Multiple-choice practice', () => actions.mode('multiple-choice'), 'text-button'));
    if (session.reviewing) card.append(button('Return to learning', actions.returnLearning, 'text-button'));
  } else {
    const toolbar = element('div', undefined, 'toolbar');
    toolbar.append(element('span', `${session.question.mode === 'typed' ? 'Typed answer' : 'Multiple choice'} · Streak ${session.streak} / ${session.question.mode === 'typed' ? 3 : 5}`, 'mode'), button('Read the lesson', actions.lesson, 'text-button'));
    card.append(toolbar);
    if (session.reviewing) card.append(button('Return to learning', actions.returnLearning, 'text-button'));
    const form = element('form');
    const fieldset = element('fieldset');
    const legend = element('legend', session.question.prompt);
    legend.id = 'question-title'; legend.tabIndex = -1;
    fieldset.append(legend);
    for (const option of session.question.options || []) {
      const label = element('label', undefined, 'option');
      const input = document.createElement('input');
      input.type = 'radio'; input.name = 'answer'; input.value = option;
      input.checked = session.selectedAnswer === option;
      input.disabled = Boolean(session.result);
      input.addEventListener('change', () => { session.selectedAnswer = option; });
      label.append(input, element('span', option));
      fieldset.append(label);
    }
    if (session.question.mode === 'typed') {
      const label = element('label', 'Your answer', 'typed-label');
      label.htmlFor = 'typed-answer';
      const input = document.createElement('input');
      input.id = 'typed-answer'; input.type = 'text'; input.autocomplete = 'off';
      input.value = session.selectedAnswer; input.disabled = Boolean(session.result);
      input.setAttribute('aria-describedby', 'answer-format');
      input.addEventListener('input', () => { session.selectedAnswer = input.value; });
      const format = element('p', session.question.formatExample, 'mode'); format.id = 'answer-format';
      fieldset.append(label, input, format);
    }
    form.append(fieldset);
    const hint = element('p', session.hint, 'hint');
    hint.id = 'input-hint'; hint.tabIndex = -1;
    hint.setAttribute('role', 'status');
    form.append(hint);
    const submit = element('button', 'Check answer', 'button');
    submit.type = 'submit'; submit.disabled = Boolean(session.result);
    form.append(submit);
    form.addEventListener('submit', event => { event.preventDefault(); actions.submit(session.selectedAnswer); });
    card.append(form);
    const feedback = element('section', undefined, 'feedback');
    feedback.setAttribute('aria-live', 'polite');
    if (session.result) {
      feedback.classList.add(session.result.outcome);
      const feedbackTitle = element('h3', session.result.outcome === 'correct' ? 'Correct — here’s why.' : 'Not quite — let’s work it out.');
      feedbackTitle.id = 'feedback-title'; feedbackTitle.tabIndex = -1;
      feedback.append(feedbackTitle, element('p', `Expected answer: ${session.result.answer}`, 'answer'));
      const steps = element('ol');
      for (const step of session.result.steps) steps.append(element('li', step));
      feedback.append(steps);
      if (session.notice) feedback.append(element('p', session.notice, 'answer'));
    }
    card.append(feedback);
    if (!session.reviewing && session.completedTopicIds.includes(session.topic.id)) {
      if (session.topic.order < topics.length) card.append(button('Open next lesson →', actions.nextTopic, 'button secondary'));
      else card.append(element('p', session.completedTopicIds.length === topics.length
        ? 'All seven lessons complete! Choose any completed lesson above to keep practicing.'
        : 'This lesson is complete! Choose any other lesson above, or review a completed one.', 'objective'));
    } else {
      const next = button('Next question →', actions.next, 'button secondary');
      next.disabled = !session.result; card.append(next);
    }
  }
  root.append(card, element('p', 'Progress lasts only while this page is open. Refreshing or closing starts a new session.', 'session-note'));
  if (focusId) document.getElementById(focusId)?.focus();
}
