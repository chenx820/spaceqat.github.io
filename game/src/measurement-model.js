// Chapter 3: q0 q1 and c0 c1 are both displayed left to right.
export const measurementNames=['星雨收集器','货运清单','重新装载','条件闸门'];
export function initialMeasurement(){return {samples:{},mapping:[0,1],printed:[],gates:[],histories:[],condition:'always',branches:[],lastRecord:null}}
export function normalizeMeasurement(raw={}){
 const s=initialMeasurement();if(!raw||typeof raw!=='object')return s;
 for(const n of [1,64,256]){const c=raw.samples?.[n];if(Array.isArray(c)&&c.length===2&&c.every(v=>Number.isInteger(v)&&v>=0)&&c[0]+c[1]===n)s.samples[n]=c.slice()}
 if(Array.isArray(raw.mapping)&&raw.mapping.length===2&&raw.mapping.slice().sort().join('')==='01')s.mapping=raw.mapping.slice();
 s.printed=['10','01'].filter(v=>Array.isArray(raw.printed)&&raw.printed.includes(v));
 if(Array.isArray(raw.gates)&&raw.gates.length<=2&&raw.gates.every(g=>['Reset','X'].includes(g)))s.gates=raw.gates.slice();
 if(s.gates.join(',')==='Reset,X')s.histories=[0,1].filter(v=>Array.isArray(raw.histories)&&raw.histories.includes(v));
 if(['always','zero','one'].includes(raw.condition))s.condition=raw.condition;
 if(s.condition==='one')s.branches=[0,1].filter(v=>Array.isArray(raw.branches)&&raw.branches.includes(v));
 return s;
}
export function sampleHalf(shots,random=Math.random){if(![1,64,256].includes(shots))throw Error('Unsupported sample size');const c=[0,0];for(let i=0;i<shots;i++){const r=random();if(!Number.isFinite(r)||r<0||r>=1)throw Error('Invalid random value');c[r<.5?0:1]++}return c}
export function mapMeasurement(bits,mapping){if(bits.length!==2||bits.some(v=>v!==0&&v!==1)||mapping.length!==2||mapping.slice().sort().join('')!=='01')throw Error('Invalid mapping');const record=[0,0];bits.forEach((v,q)=>record[mapping[q]]=v);return record.join('')}
export function resetBranch(history,gates){if(![0,1].includes(history))throw Error('Invalid branch');let bit=history;const trace=[bit];for(const gate of gates){if(gate==='Reset')bit=0;else if(gate==='X')bit^=1;else throw Error('Invalid gate');trace.push(bit)}return {history,probability:.5,trace,final:bit}}
export function conditionalBranch(history,condition){if(![0,1].includes(history)||!['always','zero','one'].includes(condition))throw Error('Invalid branch');const triggered=condition==='always'||history===+(condition==='one');return {history,probability:.5,triggered,final:triggered?history^1:history}}
export function readyMeasurement(level,s){return [()=>[1,64,256].every(n=>s.samples[n]),()=>s.printed.includes('10')&&s.printed.includes('01'),()=>s.gates.join(',')==='Reset,X'&&s.histories.length===2,()=>s.condition==='one'&&s.branches.length===2][level]?.()||false}
export function measurementAction(state,action,random=Math.random){
 const s=normalizeMeasurement(state);s.lastRecord=state.lastRecord??null;
 switch(action.type){
 case 'collect':s.samples[action.shots]=sampleHalf(action.shots,random);break;
 case 'mapping':if(![0,1].includes(action.target))throw Error('Invalid target');s.mapping=[action.target,1-action.target];s.lastRecord=null;break;
 case 'print':{const record=mapMeasurement([1,0],s.mapping);s.lastRecord=record;if(!s.printed.includes(record))s.printed.push(record);break}
 case 'gate':if(!['Reset','X'].includes(action.gate))throw Error('Invalid gate');if(s.gates.length===2)throw Error('两个插槽已满。先撤销一步，再换积木。');s.gates.push(action.gate);s.histories=[];break;
 case 'undo':s.gates.pop();s.histories=[];break;
 case 'history':{const r=resetBranch(action.history,s.gates);if(s.gates.join(',')==='Reset,X'&&r.final===1&&!s.histories.includes(action.history))s.histories.push(action.history);break}
 case 'condition':if(!['always','zero','one'].includes(action.condition))throw Error('Invalid condition');s.condition=action.condition;s.branches=[];break;
 case 'check':s.branches=[0,1].filter(h=>conditionalBranch(h,s.condition).final===0);break;
 default:throw Error('Unknown action');
 }return s;
}
