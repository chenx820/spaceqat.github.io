/**
 * Tiny, dependency-free, 2-ion (40Ca+ optical-qubit) teaching reference.
 * Qubit A is the most-significant bit, B the least-significant bit.
 *  |0> = bright (S1/2), |1> = dark (D5/2), for 397+866 nm detection.
 * Uses exact 2-qubit complex state vectors and Born probabilities.
 * It is NOT a model of laboratory RF voltages, motional heating, gate fidelity,
 * laser safety, or open-system dynamics. Those mechanics live in the game layer.
 *
 * Run tests: node --test reference/*.test.mjs
 */
const z = () => [0, 0];
const c = (r, i = 0) => [r, i];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul = (a, b) => [a[0]*b[0] - a[1]*b[1], a[0]*b[1] + a[1]*b[0]];
const sc = (a, x) => [a[0]*x, a[1]*x];
const abs2 = a => a[0]*a[0] + a[1]*a[1];
const clone = state => state.map(([r, i]) => [r, i]);
export const EPS = 1e-11;
export function zeroTwoIons() { return [c(1), z(), z(), z()]; }
export function stateNorm(state) {
  if (!Array.isArray(state) || state.length !== 4) throw new Error('expected 4 amplitudes');
  return state.reduce((s, a) => s + abs2(a), 0);
}
export function applyOne(state, qubit, u) {
  if (![0, 1].includes(qubit)) throw new Error('qubit should be 0 or 1');
  const mask = (qubit === 0 ? 2 : 1), out = [z(), z(), z(), z()];
  for (let i = 0; i < 4; i++) {
    if ((i & mask) !== 0) continue;
    const j = i | mask;
    out[i] = add(mul(u[0][0], state[i]), mul(u[0][1], state[j]));
    out[j] = add(mul(u[1][0], state[i]), mul(u[1][1], state[j]));
  }
  return out;
}
export function rx(state, qubit, theta) {
  const a = Math.cos(theta/2), b = Math.sin(theta/2);
  return applyOne(state, qubit, [[c(a), c(0, -b)], [c(0, -b), c(a)]]);
}
export function rz(state, qubit, phi) {
  const a = Math.cos(phi/2), b = Math.sin(phi/2);
  return applyOne(state, qubit, [[c(a, -b), z()], [z(), c(a, b)]]);
}
export function h(state, qubit) {
  const a = 1/Math.sqrt(2);
  return applyOne(state, qubit, [[c(a), c(a)], [c(a), c(-a)]]);
}
export function sDagger(state, qubit) {
  return applyOne(state, qubit, [[c(1), z()], [z(), c(0, -1)]]);
}
/** Exp(-i chi X_A X_B): ideal MS XX entangler at chi=pi/4. */
export function msXX(state, chi) {
  const cos = Math.cos(chi), sin = Math.sin(chi);
  return state.map((ampl, i) => add(sc(ampl, cos), mul(c(0, -sin), state[i ^ 3])));
}
export function piPulseState(pulseTicks = 100, target = 0) {
  return rx(zeroTwoIons(), target, Math.PI * pulseTicks / 100);
}
/** Standard MS produces (|00>-i|11>)/sqrt(2).
 * Virtual Rz(pi/2) on B then produces |Phi+> = (|00>+|11>)/sqrt(2)
 * up to an overall phase.
 */
export function bellState({gateTicks = 120, virtualZ = true} = {}) {
  let state = msXX(zeroTwoIons(), (Math.PI/4) * gateTicks/120);
  if (virtualZ) state = rz(state, 1, Math.PI/2);
  return state;
}
/** Basis values Z, X, Y; 0 labels eigenvalue +1 and 1 labels -1. */
export function probabilities(state, basisA = 'Z', basisB = 'Z') {
  let rotated = clone(state);
  for (const [qubit, basis] of [[0, basisA], [1, basisB]]) {
    if (basis === 'X') rotated = h(rotated, qubit);
    else if (basis === 'Y') rotated = h(sDagger(rotated, qubit), qubit);
    else if (basis !== 'Z') throw new Error(`unknown basis ${basis}`);
  }
  const p = rotated.map(abs2), total = p.reduce((a,b) => a+b,0);
  if (Math.abs(total - 1) > 1e-8) throw new Error('non-normalized state');
  return {'00':p[0], '01':p[1], '10':p[2], '11':p[3]};
}
export function correlation(probs) {
  return probs['00'] - probs['01'] - probs['10'] + probs['11'];
}
export function witness(eZZ, eXX) {
  return {score: eZZ + eXX,
    sufficientForEntanglement: eZZ + eXX > 1 + 1e-9,
    gameUnlock: eZZ + eXX >= 1.4};
}
/** Deterministic RNG for tests and resumable shot histories. NOT crypto. */
export function mulberry32(seed) {
  let x = (seed >>> 0);
  return () => {
    x = (x + 0x6D2B79F5) | 0;
    let t = Math.imul(x ^ (x >>> 15), 1 | x);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shots(probs, number, random = Math.random) {
  if (!Number.isSafeInteger(number) || number <= 0) throw new Error('shots must be positive integer');
  const outcomes = ['00','01','10','11'];
  const counts = {'00':0,'01':0,'10':0,'11':0};
  for (let n=0;n<number;n++) {
    const r = random(); let sum = 0, which = '11';
    for (const outcome of outcomes) {
      sum += probs[outcome];
      if (r < sum) {which = outcome; break;}
    }
    counts[which]++;
  }
  return counts;
}
export function measuredCorrelation(counts) {
  const total = Object.values(counts).reduce((a,b) => a+b, 0);
  if (!total) throw new Error('no counts');
  return (counts['00'] - counts['01'] - counts['10'] + counts['11'])/total;
}
export function runBellValidation({gateTicks=120, virtualZ=true, shotCount=40, seed=42}={}) {
  const state = bellState({gateTicks, virtualZ});
  const rng = mulberry32(seed);
  const zz = shots(probabilities(state,'Z','Z'), shotCount, rng);
  const xx = shots(probabilities(state,'X','X'), shotCount, rng);
  const eZZ = measuredCorrelation(zz), eXX = measuredCorrelation(xx);
  const w = witness(eZZ,eXX);
  const gateCalibrated = Math.abs(gateTicks - 120) <= 10;
  const phaseCalibrated = virtualZ === true;
  return {zz,xx,eZZ,eXX,...w,gateCalibrated,phaseCalibrated,
    gameUnlock: w.gameUnlock && gateCalibrated && phaseCalibrated};
}
