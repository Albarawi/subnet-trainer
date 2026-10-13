const variants = [114, 186, 42, 128, 255, 73].map((decimal, index) => ({
  id: `octet-${index + 1}`, decimal,
}));

export const topics = [{
  id: 'binary-decimal',
  order: 1,
  title: 'Binary and decimal octets',
  objective: 'Read eight binary digits and convert them into a decimal number from 0 to 255.',
  terms: [
    { name: 'Bit', definition: 'A single binary digit: either 0 or 1.' },
    { name: 'Octet', definition: 'A group of eight bits. Each part of an IPv4 address is one octet.' },
    { name: 'Decimal', definition: 'Our everyday number system, using digits from 0 to 9.' },
  ],
  lesson: [
    'Each position in an octet has a value. From left to right, the values are 128, 64, 32, 16, 8, 4, 2, and 1.',
    'A 1 means include that position’s value. A 0 means leave it out. Add the included values to find the decimal number.',
    'Eight zeros equal 0. Eight ones equal 255. These are the smallest and largest values in an octet.',
  ],
  workedExample: 'For 01110010, the 1s select 64, 32, 16, and 2. Add them: 64 + 32 + 16 + 2 = 114.',
  questionPools: { 'multiple-choice': variants, typed: variants },
}];

function addTopic(id, title, objective, terms, lesson, workedExample, kind, values) {
  const pool = values.map((value, index) => ({ id: `${id}-${index + 1}`, kind, ...value }));
  topics.push({ id, order: topics.length + 1, title, objective,
    terms: terms.map(([name, definition]) => ({ name, definition })), lesson, workedExample,
    questionPools: { 'multiple-choice': pool, typed: pool } });
}

addTopic('ipv4-structure', 'The parts of an IPv4 address',
  'Recognize four decimal octets and read the value of any numbered octet.',
  [['IPv4 address', 'A 32-bit address written as four decimal octets separated by dots.'],
    ['Position', 'Count octets from left to right, starting at 1.']],
  ['An address such as 192.168.1.10 has four octets: 192, 168, 1, and 10.',
    'Each octet ranges from 0 to 255. Together the four octets represent 32 bits.',
    'When asked for an octet, return that one number, not the whole address.'],
  'In 192.168.1.10, octet 1 is 192 and octet 4 is 10.', 'structure',
  [1, 2, 3, 4, 1, 4].map((position, index) => ({ address: `192.168.${index + 1}.${10 + index}`, position })));

addTopic('prefix-masks', 'Prefix lengths and subnet masks',
  'Translate a prefix length into a subnet mask and identify network bits.',
  [['Prefix length', 'The number of leading network bits, written after a slash.'],
    ['Subnet mask', 'Network bits are 1s and host bits are 0s, shown in dotted decimal.']],
  ['A /24 prefix uses 24 network bits and leaves 8 host bits.',
    'Fill the mask from left to right with network 1s, then host 0s.',
    'Eight 1s equal 255. Partial octets use the same position weights from lesson 1.'],
  '/26 has three full 255 octets and two 1s in the last: 128 + 64 = 192. Its mask is 255.255.255.192.',
  'mask', [8, 16, 23, 24, 26, 30].map(prefix => ({ prefix })));

const subnetExamples = [
  { address: '192.168.1.130', prefix: 26 }, { address: '172.16.5.200', prefix: 23 },
  { address: '10.20.30.40', prefix: 8 }, { address: '192.168.2.17', prefix: 28 },
  { address: '10.1.2.6', prefix: 30 }, { address: '172.20.17.12', prefix: 20 },
];
addTopic('network-broadcast', 'Network and broadcast addresses',
  'Find the first and last address of the block containing an IPv4 address.',
  [['Network address', 'The first address in a subnet; all host bits are 0.'],
    ['Broadcast address', 'The last address in an ordinary subnet; all host bits are 1.']],
  ['A /p subnet contains 2 raised to the power of (32 minus p) addresses.',
    'Subnet blocks begin on multiples of that size. Find the block containing the given address.',
    'The network address begins the block; the broadcast address ends it.'],
  '192.168.1.130/26 lies in a block of 64 addresses: 192.168.1.128 through 192.168.1.191.',
  'subnet', subnetExamples.map((value, index) => ({ ...value, target: index % 2 ? 'broadcast' : 'network' })));

addTopic('usable-hosts', 'Usable hosts and ranges',
  'Calculate usable host counts and the first or last usable address in an ordinary subnet.',
  [['Usable host', 'An address available to an ordinary host, excluding network and broadcast.'],
    ['Host range', 'Addresses from one above the network to one below the broadcast.']],
  ['For the ordinary /8–/30 subnets here, usable host count is 2^(32 minus prefix) minus 2.',
    'The first host is network plus 1; the last host is broadcast minus 1.',
    '/31 point-to-point links and /32 single-address routes need different treatment. Do not apply the subtract-two rule to them.'],
  '192.168.1.128/26 has 64 addresses and 62 usable hosts: 192.168.1.129 through 192.168.1.190.',
  'hosts', subnetExamples.map((value, index) => ({ ...value, target: ['hostCount', 'firstHost', 'lastHost'][index % 3] })));

addTopic('equal-subnets', 'Divide a network into equal subnets',
  'Split an aligned network into equally sized subnets and identify a requested subnet.',
  [['Borrowed bit', 'A former host bit used to identify a smaller subnet.'],
    ['Equal subnet', 'Each resulting subnet has the same prefix length and address count.']],
  ['To make 2 equal subnets, add 1 to the prefix. To make 4, add 2.',
    'Divide the original address count by the number of subnets to find each smaller block.',
    'Count subnets from 1. Return the network address and new prefix of the requested subnet.'],
  '192.168.0.0/24 split into 4 becomes /26. Subnet 2 begins at 192.168.0.64/26.',
  'split', [
    { network: '192.168.0.0/24', count: 4, ordinal: 2 },
    { network: '172.16.4.0/23', count: 2, ordinal: 2 },
    { network: '10.0.0.0/24', count: 2, ordinal: 1 },
    { network: '192.168.2.0/24', count: 4, ordinal: 4 },
    { network: '172.20.0.0/22', count: 4, ordinal: 3 },
    { network: '10.1.0.0/16', count: 2, ordinal: 2 },
  ]);

addTopic('supernetting', 'Combine networks with exact supernets',
  'Recognize when two or four equal-sized networks form one exact, aligned summary.',
  [['Supernet', 'A shorter prefix that combines smaller network blocks.'],
    ['Adjacent', 'The next network begins immediately after the previous network ends.'],
    ['Alignment', 'The first address must fall on a boundary of the larger block.']],
  ['Combine two equal networks by shortening the prefix by 1; combine four by shortening it by 2.',
    'The source networks must be adjacent and the first address must align to the larger block.',
    'An exact summary contains no extra addresses. A covering prefix may include extra networks and is a different task.'],
  '192.168.0.0/24 and 192.168.1.0/24 form 192.168.0.0/23. But 192.168.1.0/24 and 192.168.2.0/24 are not aligned to one exact /23 block.',
  'summary', [
    { networks: ['192.168.0.0/24', '192.168.1.0/24'], recognition: false },
    { networks: ['192.168.1.0/24', '192.168.2.0/24'], recognition: true },
    { networks: ['10.0.0.0/24', '10.0.1.0/24', '10.0.2.0/24', '10.0.3.0/24'], recognition: false },
    { networks: ['172.16.0.0/24', '172.16.2.0/24'], recognition: true },
    { networks: ['192.168.4.0/24', '192.168.5.0/24'], recognition: true },
    { networks: ['172.20.0.0/26', '172.20.0.64/26'], recognition: false },
  ]);

// Expand each lesson to forty distinct examples, rather than duplicating the six seeds.
for (const topic of topics) {
  const pool = topic.questionPools['multiple-choice'];
  if (topic.id === 'binary-decimal') {
    for (let decimal = 0; pool.length < 40; decimal += 7) {
      if (!pool.some(item => item.decimal === decimal)) pool.push({ id: `octet-value-${decimal}`, decimal });
    }
  } else if (topic.id === 'prefix-masks') {
    for (let prefix = 8; prefix <= 30; prefix++) {
      if (!pool.some(item => item.prefix === prefix)) pool.push({ id: `mask-${prefix}`, kind: 'mask', prefix });
    }
    for (let prefix = 8; pool.length < 40; prefix++) {
      pool.push({ id: `host-bits-${prefix}`, kind: 'mask', prefix, target: 'hostBits' });
    }
  } else {
    for (let index = 0; pool.length < 40; index++) {
      const id = `${topic.id}-expanded-${index}`;
      if (topic.id === 'ipv4-structure') pool.push({ id, kind: 'structure', address: `10.${index + 1}.${40 + index}.${100 + index}`, position: index % 4 + 1 });
      if (topic.id === 'network-broadcast' || topic.id === 'usable-hosts') pool.push({ id, kind: topic.id === 'usable-hosts' ? 'hosts' : 'subnet', address: `10.${index + 1}.${50 + index}.${100 + index}`, prefix: [16,20,23,24,26,28,30][index % 7], target: topic.id === 'usable-hosts' ? ['hostCount','firstHost','lastHost'][index % 3] : index % 2 ? 'broadcast' : 'network' });
      if (topic.id === 'equal-subnets') pool.push({ id, kind: 'split', network: `10.${index + 1}.0.0/24`, count: index % 2 ? 2 : 4, ordinal: index % 2 ? 2 : index % 4 + 1 });
      if (topic.id === 'supernetting') {
        const count = index % 3 === 0 ? 4 : 2;
        const start = index % 4 === 1 ? 1 : 0;
        const gap = index % 4 === 2 ? 2 : 1;
        pool.push({ id, kind: 'summary', networks: Array.from({length:count}, (_, n) => `10.${index + 1}.${start + n * gap}.0/24`), recognition: start !== 0 || gap !== 1 || index % 2 === 0 });
      }
    }
  }
}


