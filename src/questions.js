import { octetToBinary, prefixToMask, subnetDetails, splitNetwork, summarizeNetworks } from './ipv4.js';

const weights = [128, 64, 32, 16, 8, 4, 2, 1];
const formats = {
  decimal: 'Enter one whole number without leading zeros, for example 114.',
  binary: 'Enter exactly eight binary digits, for example 01110010.',
  address: 'Enter four octets from 0 to 255 without leading zeros, for example 255.255.255.192.',
  network: 'Enter an aligned network/prefix, for example 192.168.0.64/26.',
  text: 'Enter yes or no. Either letter case is accepted.',
};

function solve(variant, mode) {
  const kind = variant.kind || 'binary';
  if (kind === 'summary') {
    const summary = summarizeNetworks(variant.networks);
    const answer = variant.recognition ? (summary ? 'yes' : 'no') : summary;
    return { answerFormat: variant.recognition ? 'text' : 'network',
      prompt: variant.recognition ? `Can ${variant.networks.join(' and ')} be represented by one prefix with no extra addresses?` : `What is the exact supernet for ${variant.networks.join(' and ')}?`,
      solution: { answer, steps: [
        `There are ${variant.networks.length} equal-sized source networks. A candidate prefix is shorter by ${Math.log2(variant.networks.length)} bits.`,
        'Check that every network is adjacent and the first is aligned to the larger block.',
        summary ? `Their exact summary is ${summary}${variant.recognition ? '; the answer is yes' : ''}.` : 'These networks fail adjacency or alignment. A covering prefix would include extra addresses, so the answer is no.',
      ] } };
  }
  if (kind === 'binary') {
    const binary = octetToBinary(variant.decimal);
    const included = weights.filter((_, index) => binary[index] === '1');
    const toBinary = mode === 'typed' && variant.id === 'octet-2';
    const answer = toBinary ? binary : String(variant.decimal);
    return { binary, answerFormat: toBinary ? 'binary' : 'decimal',
      prompt: toBinary ? `Write ${variant.decimal} as eight binary digits.` : `What is ${binary} in decimal?`,
      solution: { answer, steps: ['Read the position values from left to right: 128, 64, 32, 16, 8, 4, 2, 1.',
        `Keep only the values beneath a 1: ${included.join(', ') || 'none'}.`,
        `${included.join(' + ') || '0'} = ${variant.decimal}${toBinary ? `; the binary octet is ${binary}` : ''}.`] } };
  }
  if (kind === 'structure') {
    const answer = variant.address.split('.')[variant.position - 1];
    return { answerFormat: 'decimal', prompt: `What is octet ${variant.position} in ${variant.address}?`,
      solution: { answer, steps: [`Separate the address at each dot: ${variant.address.split('.').join(', ')}.`,
        `Count from the left starting at 1. Octet ${variant.position} is ${answer}.`] } };
  }
  if (kind === 'mask') {
    if (variant.target === 'hostBits') return {
      answerFormat: 'decimal', prompt: `How many host bits remain with a /${variant.prefix} prefix?`,
      solution: { answer: String(32 - variant.prefix), steps: ['An IPv4 address contains 32 bits.', `Subtract ${variant.prefix} network bits: 32 - ${variant.prefix} = ${32 - variant.prefix} host bits.`] },
    };
    const answer = prefixToMask(variant.prefix);
    return { answerFormat: 'address', prompt: `What is the subnet mask for /${variant.prefix}?`,
      solution: { answer, steps: [`Write ${variant.prefix} leading 1s and ${32 - variant.prefix} trailing 0s.`,
        'Group the bits into four octets and add each octet’s position values.', `The mask is ${answer}.`] } };
  }
  if (kind === 'split') {
    const subnets = splitNetwork(variant.network, variant.count);
    const answer = subnets[variant.ordinal - 1];
    return { answerFormat: 'network', prompt: `Split ${variant.network} into ${variant.count} equal subnets. What is subnet ${variant.ordinal}?`,
      solution: { answer, steps: [`Add ${Math.log2(variant.count)} to the original prefix.`,
        `The equally sized subnet networks are ${subnets.join(', ')}.`, `Counting from 1, subnet ${variant.ordinal} is ${answer}.`] } };
  }
  const details = subnetDetails(variant.address, variant.prefix);
  const answer = String(details[variant.target]);
  const labels = { network: 'network address', broadcast: 'broadcast address', firstHost: 'first usable host', lastHost: 'last usable host', hostCount: 'usable host count' };
  const count = 2 ** (32 - variant.prefix);
  return { answerFormat: variant.target === 'hostCount' ? 'decimal' : 'address',
    prompt: `For ${variant.address}/${variant.prefix}, what is the ${labels[variant.target]}?`,
    solution: { answer, steps: [`The block contains 2^${32 - variant.prefix} = ${count} addresses.`,
      `Its network is ${details.network}; its broadcast is ${details.broadcast}.`,
      kind === 'hosts' ? `Exclude those endpoints: ${details.firstHost} through ${details.lastHost}, with ${count} - 2 = ${details.hostCount} hosts.` : 'Network uses all-zero host bits; broadcast uses all-one host bits.',
      `The ${labels[variant.target]} is ${answer}.`] } };
}

function distractors(question) {
  const answer = question.solution.answer;
  if (question.answerFormat === 'text') return [answer === 'yes' ? 'no' : 'yes', 'only with a longer prefix', 'only by rearranging the networks'];
  if (question.answerFormat === 'decimal') return [1, 2, 3].map(offset => String((Number(answer) + offset * 17) % (Number(answer) > 255 ? 16777216 : 256)));
  if (question.answerFormat === 'network') {
    const [address, prefix] = answer.split('/');
    return [1, 2, 3].map(offset => `${address}/${Number(prefix) - offset}`);
  }
  const parts = answer.split('.').map(Number);
  return [1, 2, 3].map(offset => [...parts.slice(0, 3), (parts[3] + offset * 17) % 256].join('.'));
}

export function createQuestion(topic, mode = 'multiple-choice', previousVariantId = null, random = Math.random) {
  const pool = topic.questionPools[mode].filter(variant => variant.id !== previousVariantId);
  const sample = random();
  if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new RangeError('Random sample must be in [0, 1).');
  const variant = pool[Math.floor(sample * pool.length)];
  const question = { id: `${topic.id}-${mode}-${variant.id}`, variantId: variant.id, topicId: topic.id, mode, ...solve(variant, mode) };
  question.formatExample = formats[question.answerFormat];
  if (mode === 'multiple-choice') {
    const options = [question.solution.answer, ...distractors(question)];
    const rotation = Math.floor(random() * 4);
    question.options = [...options.slice(rotation), ...options.slice(0, rotation)];
  }
  return question;
}
