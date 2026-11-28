import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../public/embed/simulator/Simulation.html', import.meta.url), 'utf8');
const elements = new Map();
const messages = [];
function element(id) {
  if (!elements.has(id)) {
    elements.set(id, {
      value: '', textContent: '', children: [], style: {},
      classList: { add() {}, toggle() {} },
      setAttribute() {},
      addEventListener(event, handler) { this[event] = handler; },
      set innerHTML(markup) {
        this.children = [...markup.matchAll(/<button data-([mrs])="([^"]+)"/g)]
          .map(([, key, value]) => ({ dataset: { [key]: value }, classList: { toggle() {}, add() {} } }));
      },
    });
  }
  return elements.get(id);
}

const context = vm.createContext({
  document: { getElementById: element, querySelector: element, activeElement: null, body: {} },
  window: { parent: { postMessage(message) { messages.push(message); } }, addEventListener() {} },
  ResizeObserver: class { observe() {} },
  performance: { now: () => 0 },
  setTimeout() {},
  setInterval() {},
});
vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], context);
const reset = vm.runInContext("rule => { setRule(rule); setMode('manual'); boot(); }", context);
const setInputs = vm.runInContext(`values => {
  for (const [key, value] of Object.entries(values)) {
    $('in' + key).value = String(value);
    $('in' + key).input();
  }
}`, context);
const measure = vm.runInContext('measure', context);

const normal = { ph: 7.2, turb: 38, do: 5.1, tds: 400, temp: 27.4 };
const cases = [
  ['report baseline', 'report', {}, 57, false],
  ['report exact turbidity limit', 'report', { turb: 57 }, 57, false],
  ['report above turbidity limit', 'report', { turb: 57.1 }, 57, true],
  ['report pH breach', 'report', { ph: 5.99 }, 57, true],
  ['report DO breach', 'report', { do: 3.99 }, 57, true],
  ['report logs high TDS and temperature', 'report', { tds: 600, temp: 36 }, 57, false],
  ['team relaxed boundary', 'team', { do: 4.2, tds: 400, turb: 75 }, 75, false],
  ['team above relaxed boundary', 'team', { turb: 75.1 }, 75, true],
  ['team DO changes turbidity limit', 'team', { do: 4.19, turb: 60 }, 50, true],
  ['team TDS changes turbidity limit', 'team', { tds: 401, turb: 60 }, 50, true],
  ['team strict boundaries', 'team', { ph: 8.5, do: 4, tds: 500, temp: 35, turb: 50 }, 50, false],
  ['team TDS breach', 'team', { tds: 501 }, 50, true],
  ['team temperature breach', 'team', { temp: 35.1 }, 75, true],
];

for (const [name, rule, overrides, expectedLimit, breached] of cases) {
  reset(rule);
  setInputs({ ...normal, ...overrides });
  for (let reading = 1; reading <= 3; reading++) {
    measure();
    const state = messages.at(-1);
    assert.equal(state.type, 'station-state', name);
    assert.equal(state.id, 'NH-04', name);
    assert.equal(state.rule, rule, name);
    assert.equal(state.limit, expectedLimit, name);
    assert.equal(state.breached, breached, name);
    assert.equal(state.cnt, breached ? reading : 0, name);
    assert.equal(state.alert, Number(breached && reading === 3), name);
  }
  setInputs(normal);
  measure();
  assert.equal(messages.at(-1).cnt, 0, name);
  assert.equal(messages.at(-1).alert, 0, name);
}

reset('team');
setInputs({ ...normal, turb: 251 });
measure();
assert.equal(messages.at(-1).values.turb, 250);

console.log(`Verified ${cases.length} scenarios across the Report and Team rules, recovery, input clamping and the parent state payload.`);
