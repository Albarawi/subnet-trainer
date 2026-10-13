import { addressToNumber, subnetDetails } from './ipv4.js';

function validTypedAnswer(format, answer) {
  if (format === 'text') return /^(yes|no)$/i.test(answer);
  if (format === 'decimal') return /^(0|[1-9]\d*)$/.test(answer) && Number.isSafeInteger(Number(answer));
  if (format === 'binary') return /^[01]{8}$/.test(answer);
  if (format === 'address') { addressToNumber(answer); return true; }
  if (format === 'network') {
    const [address, prefix, extra] = answer.split('/');
    if (extra !== undefined || !/^(0|[1-9]\d?)$/.test(prefix || '')) return false;
    const details = subnetDetails(address, Number(prefix));
    return address === details.network;
  }
  return false;
}

export function gradeAnswer(question, submittedAnswer) {
  const answer = typeof submittedAnswer === 'string' ? submittedAnswer.trim() : '';
  let valid = false;
  try {
    valid = question.mode === 'multiple-choice' ? question.options.includes(answer) : validTypedAnswer(question.answerFormat, answer);
  } catch { valid = false; }
  if (!valid) return { outcome: 'invalid', hint: question.mode === 'multiple-choice' ? 'Choose one of the four answers before checking.' : `Check the format. ${question.formatExample || 'Use the requested format, without leading zeros.'}` };
  return { outcome: answer.toLowerCase() === question.solution.answer.toLowerCase() ? 'correct' : 'incorrect',
    answer: question.solution.answer, steps: [...question.solution.steps] };
}
