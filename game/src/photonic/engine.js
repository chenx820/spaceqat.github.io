/**
 * 光量子 MBQC 教学关卡的无依赖、小规模、可执行参考模型。
 * Node.js >=18; 小于等于 6 个“保留”的光子图节点。不是硬件模拟器。
 * 实现: 图态 CZ, 破坏性赤道基测量, 经典自适应, Pauli frame,
 * 2x3 cluster 的双线纠缠教学例子。
 * 融合硬件部分在游戏中是概率性资源生成（示例 50%），成功才在这里准备 6 节点图态。
 * 注意输入光子（|0>）与资源辅助光子（|+>）的区别。
 */
export const PI = Math.PI;
export const EDGES_WIRE = [[0,1],[1,2]];
export const EDGES_BRIDGE_2X3 = [[0,2],[2,4],[1,3],[3,5],[2,3]];

export const PHYSICS_NOTES = Object.freeze({
  encoding: '偏振编码 |H> 与 |V>（教学选择）',
  measurements: 'B(alpha) 单光子投影是破坏性测量；探测后不可再次测量该光子',
  fusion: '演示用理想化线性光学 Type-II 风格融合，成功率 0.5、条件触发，并消耗两个辅助叶光子',
  feedforward: '由已测量结果更新未来基角或 Pauli frame；不得修改已经探测完的光子',
  scope: '6 节点小图演示纠缠能力，不意味着仅 6 光子就可运行任意大通用算法'
});

const make = (size) => new Float64Array(size*2);
function amplitudeAdd(out, oi, inArr, i, xr, xi) {
  const r = inArr[2*i], m = inArr[2*i+1];
  out[2*oi] += r*xr-m*xi;
  out[2*oi+1] += r*xi+m*xr;
}
function norm2(amps) {
  let s = 0;
  for (const a of amps) s += a*a;
  return s;
}
function normalize(amps) {
  const n = Math.sqrt(norm2(amps));
  if (!(n>1e-12)) throw Error('Invalid zero-probability measurement branch');
  for(let i=0;i<amps.length;i++) amps[i] /= n;
  return amps;
}

/** Create product |+> on every node, except q ∈ inputsZero which is |0>. Little-endian bit order. */
export function prepareGraph(qubits, edges, inputsZero=[]) {
  if (!Number.isInteger(qubits) || qubits < 1 || qubits > 8) throw Error('1..8 qubits only');
  const out = make(2**qubits);
  out[0] = 1;
  const fixed = new Set(inputsZero);
  for(let q=0;q<qubits;q++) if(!fixed.has(q)) applyHInPlace(out,qubits,q);
  for(const [a,b] of edges) applyCZInPlace(out,qubits,a,b);
  return {qubits, amps:out};
}
function applyHInPlace(v,n,q){
  const step=1<<q, inv=1/Math.sqrt(2);
  for(let base=0;base<(1<<n);base+=2*step){
    for(let j=0;j<step;j++){
      const i=base+j,k=i+step;
      const ar=v[2*i],ai=v[2*i+1],br=v[2*k],bi=v[2*k+1];
      v[2*i]=(ar+br)*inv;v[2*i+1]=(ai+bi)*inv;
      v[2*k]=(ar-br)*inv;v[2*k+1]=(ai-bi)*inv;
    }
  }
}
function applyCZInPlace(v,n,a,b){
  if(a===b || a<0 || b<0 || a>=n || b>=n)throw Error('Invalid CZ edge');
  for(let i=0;i<(1<<n);i++) if((i>>a&1)&&(i>>b&1)){
    v[2*i]*=-1;v[2*i+1]*=-1;
  }
}
function outcomeVector(state, q, angle, outcome){
  const {qubits:n, amps:v}=state;
  if(q<0||q>=n)throw Error('Invalid measured qubit');
  const arr=make(1<<(n-1));
  const sr=(outcome===0?1:-1)*Math.cos(angle)/Math.sqrt(2);
  const si=-(outcome===0?1:-1)*Math.sin(angle)/Math.sqrt(2);
  const a=1/Math.sqrt(2);
  const lowMask=(1<<q)-1;
  for(let o=0;o<(1<<(n-1));o++){
    const inZero=(o&lowMask)|((o>>q)<<(q+1));
    amplitudeAdd(arr,o,v,inZero,a,0);
    amplitudeAdd(arr,o,v,inZero|(1<<q),sr,si);
  }
  return arr;
}
/**
 * Project |±_alpha> = (|0> ± exp(i alpha)|1>)/sqrt(2), outcome 0/1.
 * Destroy measured mode, compact the register, and return conditional normalized state.
 * For testing, pass forcedOutcome=0/1; production should sample physical Born probability.
 */
export function measureEquatorial(state,q,angle=0,rng=Math.random,forcedOutcome=null){
  const branch0=outcomeVector(state,q,angle,0);
  const p0=norm2(branch0);
  const outcome=forcedOutcome===null ? (rng()<p0?0:1) : forcedOutcome;
  if(outcome!==0 && outcome!==1)throw Error('Outcome must be 0 or 1');
  const chosen=outcome===0?branch0:outcomeVector(state,q,angle,1);
  const probability=norm2(chosen);
  normalize(chosen);
  return { outcome, probability, state:{qubits:state.qubits-1,amps:chosen} };
}
export function applyPauliInPlace(state,q,type){
  const {qubits:n,amps:v}=state;
  if(q<0||q>=n) throw Error('Invalid Pauli qubit');
  if(type==='I')return state;
  if(type==='Z'){
    for(let i=0;i<(1<<n);i++) if(i>>q&1){v[2*i]*=-1;v[2*i+1]*=-1;}
    return state;
  }
  if(type==='X'){
    for(let i=0;i<(1<<n);i++) if(!(i>>q&1)){
      const j=i|(1<<q);
      for(let k=0;k<2;k++) [v[2*i+k],v[2*j+k]]=[v[2*j+k],v[2*i+k]];
    }
    return state;
  }
  throw Error('Supported Paulis: I, X, Z');
}
export function cloneState(state){return {qubits:state.qubits,amps:state.amps.slice()};}
export function fidelity(state,other){
  if(state.qubits!==other.qubits)throw Error('Mismatched register sizes');
  let re=0,im=0;
  for(let i=0;i<state.amps.length;i+=2){
    let a=state.amps[i],b=state.amps[i+1],c=other.amps[i],d=other.amps[i+1];
    re+=a*c+b*d;im+=a*d-b*c;
  }
  return re*re+im*im;
}
export function basisAngleForNext(targetAngle, precedingOutcome){
  return precedingOutcome===1 ? -targetAngle:targetAngle;
}
/** 3-node linear cluster q0(in), q1, q2(out); J(alpha)=H R_z(-alpha). */
export function runAdaptiveWire({alpha1=-PI/4,alpha2=PI/4,s1=null,s2=null,adaptive=true,rng=Math.random}={}){
  let st=prepareGraph(3,EDGES_WIRE);
  const r1=measureEquatorial(st,0,alpha1,rng,s1);st=r1.state;
  const actualAlpha2=adaptive?basisAngleForNext(alpha2,r1.outcome):alpha2;
  const r2=measureEquatorial(st,0,actualAlpha2,rng,s2);st=r2.state;
  // X^s2 Z^s1: the order only changes global phase for qubit frame.
  if(r1.outcome===1)applyPauliInPlace(st,0,'Z');
  if(r2.outcome===1)applyPauliInPlace(st,0,'X');
  return {state:st, outcomes:[r1.outcome,r2.outcome], angles:[alpha1,actualAlpha2],
    probabilities:[r1.probability,r2.probability],frame:{x:r2.outcome,z:r1.outcome}};
}
/** Correct branch-independent target using s1=s2=0 adaptive route. */
export function wireTarget(alpha1=-PI/4,alpha2=PI/4){
  return runAdaptiveWire({alpha1,alpha2,s1:0,s2:0}).state;
}
/** General two-input setup: q0,q1 receive the provided two-qubit input; q2..q5 start |+>. */
export function prepareBridgeGraphWithInputs(inputAmps=null, bridge=true){
  const source=inputAmps===null ? new Float64Array([1,0,0,0,0,0,0,0]):new Float64Array(inputAmps);
  if(source.length!==8)throw Error('Two-qubit input requires 4 complex amplitudes (8 floats)');
  if(Math.abs(norm2(source)-1)>1e-9)throw Error('Input must be normalized');
  const arr=make(64);
  for(let i=0;i<4;i++){arr[2*i]=source[2*i];arr[2*i+1]=source[2*i+1];}
  for(let q=2;q<6;q++)applyHInPlace(arr,6,q);
  const edges=bridge ? EDGES_BRIDGE_2X3 : EDGES_BRIDGE_2X3.filter(([a,b])=>!(a===2&&b===3));
  for(const [a,b] of edges)applyCZInPlace(arr,6,a,b);
  return {qubits:6,amps:arr};
}
/** Ideal effective 2-qubit gate for this measurement pattern: (H⊗H) CZ (H⊗H). */
export function idealBridgeGate(inputAmps){
  const arr=new Float64Array(inputAmps);
  if(arr.length!==8)throw Error('Input length must be 8');
  applyHInPlace(arr,2,0);applyHInPlace(arr,2,1);
  applyCZInPlace(arr,2,0,1);
  applyHInPlace(arr,2,0);applyHInPlace(arr,2,1);
  return {qubits:2,amps:arr};
}
/**
 * 2x3 grid node order: T0=0,B0=1,T1=2,B1=3,T2=4,B2=5;
 * CZ bridge is (2,3), measured qubits are 0,1,2,3 in X (angle 0).
 * Output corrections from this explicit graph / input / measurement convention:
 * T2: X^(sT1 xor sB0) Z^(sT0)
 * B2: X^(sB1 xor sT0) Z^(sB0)
 * For |00> input ideal output is (|00>+|10>+|01>-|11>)/2,
 * equivalent to (H⊗H)CZ(H⊗H)|00> (basis and local frames fixed here).
 */
export function runBridge2x3({outcomes=null,rng=Math.random,bridge=true,inputAmps=null}={}){
  let st=prepareBridgeGraphWithInputs(inputAmps,bridge);
  const bits=[];
  for(let j=0;j<4;j++){
    const r=measureEquatorial(st,0,0,rng,outcomes?outcomes[j]:null);
    bits.push(r.outcome);st=r.state;
  }
  const [a,b,c,d]=bits;
  if(a)applyPauliInPlace(st,0,'Z');
  if(c^b)applyPauliInPlace(st,0,'X');
  if(b)applyPauliInPlace(st,1,'Z');
  if(d^a)applyPauliInPlace(st,1,'X');
  return {state:st,outcomes:bits,frame:{top:{x:c^b,z:a},bottom:{x:d^a,z:b}}};
}
export function bridgeTarget(){
  return {qubits:2,amps:new Float64Array([.5,0,.5,0,.5,0,-.5,0])};
}
/** Pairwise Pauli observable expectation (floating value in [-1,1]) */
export function pauliExpectation(state,ops){
  const acted=cloneState(state);
  for(const [q,p] of ops)applyPauliInPlace(acted,q,p);
  let real=0;
  for(let i=0;i<state.amps.length;i++)real+=state.amps[i]*acted.amps[i];
  return real;
}
/** Sample a product of two local Pauli measurement results on fresh copies of an output state. */
export function samplePauliCorrelation(state,topBasis,bottomBasis,rng=Math.random){
  if(state.qubits!==2)throw Error('Expected two output qubits');
  if(!['X','Z'].includes(topBasis) || !['X','Z'].includes(bottomBasis))
    throw Error('Correlation demo only supports X and Z bases');
  const first=(topBasis==='Z')?measureZ(state,0,rng):measureEquatorial(state,0,0,rng);
  const second=(bottomBasis==='Z')?measureZ(first.state,0,rng):measureEquatorial(first.state,0,0,rng);
  return {top:first.outcome,bottom:second.outcome,parity:(first.outcome^second.outcome)};
}
export function measureZ(state,q,rng=Math.random,forcedOutcome=null){
  const {qubits:n,amps:v}=state;
  const p0=[];const p1=[];
  const lowMask=(1<<q)-1;
  for(let o=0;o<(1<<(n-1));o++){
    const i0=(o&lowMask)|((o>>q)<<(q+1));
    p0.push(v[2*i0],v[2*i0+1]);
    p1.push(v[2*(i0|(1<<q))],v[2*(i0|(1<<q))+1]);
  }
  const a=new Float64Array(p0),b=new Float64Array(p1), probability0=norm2(a);
  const outcome=forcedOutcome===null ? (rng()<probability0?0:1):forcedOutcome;
  if(outcome!==0 && outcome!==1)throw Error('Outcome must be 0/1');
  const chosen=outcome===0?a:b, probability=norm2(chosen);normalize(chosen);
  return {outcome,probability,state:{qubits:n-1,amps:chosen}};
}
/** xorshift32 deterministic test PRNG; never use this as a hardware randomness claim. */
export function seededRandom(seed=2026){
  let x=seed|0;
  return ()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296;};
}
/** Simplified ideal Type-II-style herald trial. Used only before graph construction. */
export function fusionTrial(rng=Math.random){
  const success=rng()<0.5;
  return {success,consumedAuxiliaryPhotons:2,remainingLogicalPhotons:success?6:0,
    explanation:success?'融合被探测器宣告成功：辅助光子已被探测，建立目标六节点逻辑资源':'此次辅助光子融合未成功：丢弃这一轮资源，重新准备'};
}
