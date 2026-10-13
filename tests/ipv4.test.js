import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  octetToBinary, binaryToOctet, addressToNumber, numberToAddress,
  prefixToMask, subnetDetails, splitNetwork, summarizeNetworks,
} from '../src/ipv4.js';

const reference = JSON.parse(readFileSync(new URL('./fixtures/ipv4-reference.json', import.meta.url)));

for (const { decimal, binary } of reference.octets) {
  test(`octet conversion: ${decimal} = ${binary}`, () => {
    assert.equal(octetToBinary(decimal), binary);
    assert.equal(binaryToOctet(binary), decimal);
  });
}

for (const example of reference.subnets) {
  test(`subnet oracle: ${example.address}/${example.prefix}`, () => {
    const { address, prefix, ...expected } = example;
    assert.deepEqual(subnetDetails(address, prefix), expected);
    assert.equal(prefixToMask(prefix), expected.mask);
  });
}

for (const example of reference.splits) {
  test(`split ${example.network} into ${example.count}`, () => {
    assert.deepEqual(splitNetwork(example.network, example.count), example.expected);
  });
}

for (const example of reference.summaries) {
  test(`exact summary: ${example.expected}`, () => {
    assert.equal(summarizeNetworks(example.networks), example.expected);
    assert.equal(summarizeNetworks([...example.networks].reverse()), example.expected);
  });
}

test('address numbers retain the unsigned range', () => {
  assert.equal(addressToNumber('0.0.0.0'), 0);
  assert.equal(addressToNumber('128.0.0.0'), 2147483648);
  assert.equal(addressToNumber('255.255.255.255'), 4294967295);
  assert.equal(numberToAddress(4294967295), '255.255.255.255');
  assert.equal(addressToNumber(' 192.168.1.1 '), 3232235777);
});

test('malformed addresses are rejected', () => {
  for (const address of ['', '1.2.3', '1.2.3.4.5', '256.2.3.4', '-1.2.3.4',
    '01.2.3.4', '1.2.3.4x', '1. 2.3.4', null, 123]) {
    assert.throws(() => addressToNumber(address), /IPv4/);
  }
});

test('invalid decimal and binary octets are rejected', () => {
  for (const octet of [-1, 256, 1.5, NaN, '12', null]) {
    assert.throws(() => octetToBinary(octet));
  }
  for (const binary of ['1', '000000002', '0000000x', '', null, 10101010]) {
    assert.throws(() => binaryToOctet(binary));
  }
});

test('invalid numeric addresses are rejected', () => {
  for (const value of [-1, 4294967296, 0.5, NaN, Infinity, '1']) {
    assert.throws(() => numberToAddress(value));
  }
});

test('exercise prefix scope excludes special /31 and /32 host rules', () => {
  for (const prefix of [0, 7, 31, 32, 33, -1, 24.5, '24', NaN]) {
    assert.throws(() => subnetDetails('192.168.0.0', prefix), /prefix/);
    assert.throws(() => prefixToMask(prefix), /prefix/);
  }
});

test('splits require canonical alignment and power-of-two counts', () => {
  for (const [network, count] of [['192.168.0.1/24', 2], ['192.168.0.0/24', 3],
    ['192.168.0.0/30', 2], ['10.0.0.0/8', 0], ['10.0.0.0/08', 2],
    ['10.0.0.0/8/extra', 2], ['10.0.0.0/8', 2 ** 30]]) {
    assert.throws(() => splitNetwork(network, count));
  }
});

test('nonexact summary sets return null instead of extra addresses', () => {
  const invalidSets = [
    ['192.168.1.0/24', '192.168.2.0/24'],
    ['192.168.0.0/24', '192.168.2.0/24'],
    ['192.168.0.0/24', '192.168.0.0/24'],
    ['192.168.0.0/24', '192.168.1.0/25'],
    ['10.0.0.0/8', '11.0.0.0/8'],
  ];
  for (const networks of invalidSets) assert.equal(summarizeNetworks(networks), null);
});

test('summary input shape and source alignment are validated', () => {
  for (const networks of [null, [], ['10.0.0.0/24'],
    ['10.0.0.0/24', '10.0.1.0/24', '10.0.2.0/24'],
    ['192.168.0.1/24', '192.168.1.0/24'], ['bad', '192.168.1.0/24']]) {
    assert.throws(() => summarizeNetworks(networks));
  }
});
