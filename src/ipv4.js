// Pure IPv4 arithmetic: no page, lesson, or session state is needed here.
const ADDRESS_COUNT = 2 ** 32;
const MAX_ADDRESS = ADDRESS_COUNT - 1;

function requireExercisePrefix(prefix) {
  if (!Number.isInteger(prefix) || prefix < 8 || prefix > 30) {
    throw new RangeError('Exercise prefix must be an integer from 8 to 30; /31 and /32 use special rules.');
  }
}

export function octetToBinary(octet) {
  if (!Number.isInteger(octet) || octet < 0 || octet > 255) {
    throw new RangeError('Octet must be an integer from 0 to 255.');
  }
  return octet.toString(2).padStart(8, '0');
}

export function binaryToOctet(binary) {
  if (typeof binary !== 'string' || !/^[01]{8}$/.test(binary)) {
    throw new TypeError('Binary octet must contain exactly eight binary digits.');
  }
  return Number.parseInt(binary, 2);
}

export function addressToNumber(address) {
  if (typeof address !== 'string') throw new TypeError('IPv4 address must be text.');
  const octets = address.trim().split('.');
  if (octets.length !== 4 || octets.some(octet =>
    !/^(0|[1-9]\d{0,2})$/.test(octet) || Number(octet) > 255)) {
    throw new TypeError('IPv4 address requires four decimal octets from 0 to 255 without leading zeros.');
  }
  return octets.reduce((value, octet) => value * 256 + Number(octet), 0);
}

export function numberToAddress(value) {
  if (!Number.isInteger(value) || value < 0 || value > MAX_ADDRESS) {
    throw new RangeError('IPv4 numeric address must be an integer from 0 to 4294967295.');
  }
  return [24, 16, 8, 0].map(shift => Math.floor(value / 2 ** shift) % 256).join('.');
}

export function prefixToMask(prefix) {
  requireExercisePrefix(prefix);
  return numberToAddress(ADDRESS_COUNT - 2 ** (32 - prefix));
}

export function subnetDetails(address, prefix) {
  requireExercisePrefix(prefix);
  const addressNumber = addressToNumber(address);
  const blockSize = 2 ** (32 - prefix);
  const networkNumber = Math.floor(addressNumber / blockSize) * blockSize;
  const broadcastNumber = networkNumber + blockSize - 1;
  return {
    mask: prefixToMask(prefix),
    network: numberToAddress(networkNumber),
    broadcast: numberToAddress(broadcastNumber),
    firstHost: numberToAddress(networkNumber + 1),
    lastHost: numberToAddress(broadcastNumber - 1),
    hostCount: blockSize - 2,
  };
}

function parseNetwork(network) {
  if (typeof network !== 'string') throw new TypeError('Network must use IPv4/prefix notation.');
  const parts = network.trim().split('/');
  if (parts.length !== 2 || !/^(0|[1-9]\d?)$/.test(parts[1])) {
    throw new TypeError('Network must use IPv4/prefix notation without leading zeros.');
  }
  const prefix = Number(parts[1]);
  requireExercisePrefix(prefix);
  const address = addressToNumber(parts[0]);
  const blockSize = 2 ** (32 - prefix);
  if (address % blockSize !== 0) throw new RangeError('Network address must be aligned to its prefix.');
  return { address, prefix, blockSize };
}

export function splitNetwork(network, count) {
  const source = parseNetwork(network);
  if (!Number.isSafeInteger(count) || count < 2 || !Number.isInteger(Math.log2(count))) {
    throw new RangeError('Subnet count must be a power of two, at least two.');
  }
  const prefix = source.prefix + Math.log2(count);
  requireExercisePrefix(prefix);
  // The largest supported split (/8 -> /30) is bounded before creating the array.
  const blockSize = source.blockSize / count;
  return Array.from({ length: count }, (_, index) =>
    `${numberToAddress(source.address + index * blockSize)}/${prefix}`);
}

export function summarizeNetworks(networks) {
  if (!Array.isArray(networks) || ![2, 4].includes(networks.length)) {
    throw new TypeError('Exact summary exercises require two or four source networks.');
  }
  const sources = networks.map(parseNetwork).sort((left, right) => left.address - right.address);
  const first = sources[0];
  if (sources.some(source => source.prefix !== first.prefix)) return null;
  const summaryPrefix = first.prefix - Math.log2(sources.length);
  if (summaryPrefix < 8 || summaryPrefix > 30) return null;
  const summarySize = first.blockSize * sources.length;
  if (first.address % summarySize !== 0) return null;
  if (sources.some((source, index) => source.address !== first.address + index * first.blockSize)) {
    return null;
  }
  return `${numberToAddress(first.address)}/${summaryPrefix}`;
}
