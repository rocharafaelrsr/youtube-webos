import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs
  .readFileSync('src/hooks/json-stringify.ts', 'utf8')
  .replace("import { configRead } from '../config';", '');
const js = ts.transpile(source, { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.None });
const context = vm.createContext({ configRead: () => true });
vm.runInContext(js, context);

const run = (source) => vm.runInContext(source, context);
const checks = [
  ['JSON.stringify({ a: () => 1 })', '{}'],
  ['JSON.stringify({ s: Symbol() })', '{}'],
  ['JSON.stringify({ toJSON() { return 1; } })', '1'],
  ['JSON.stringify([1, 2])', '[1,2]'],
  ['JSON.stringify(undefined)', undefined],
  ['JSON.stringify({ a: 1 }, ["a"])', '{"a":1}'],
  ['JSON.stringify({ playbackContext: { contentPlaybackContext: Object.freeze({ isInlinePlaybackNoAd: false }) } })', '{"playbackContext":{"contentPlaybackContext":{"isInlinePlaybackNoAd":true}}}'],
  ['JSON.stringify({ playbackContext: { contentPlaybackContext: { isInlinePlaybackNoAd: true } } })', '{"playbackContext":{"contentPlaybackContext":{"isInlinePlaybackNoAd":true}}}'],
  ['JSON.stringify({ get playbackContext() { throw Error("test"); } }, [])', '{}']
];
for (const [expression, expected] of checks) {
  assert.equal(run(expression), expected, expression);
}
context.configRead = () => false;
assert.equal(run('JSON.stringify({ playbackContext: { contentPlaybackContext: {} } })'), '{"playbackContext":{"contentPlaybackContext":{}}}');
console.log('10 serialization regression checks passed');
