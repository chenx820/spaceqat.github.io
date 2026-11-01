import {runReal} from './routing-model.js';
export const hardwareNames=['超导网格','原子登舰','配对窗口','丢失警报'];
export const hardwareEdges=['01','02','13','23'];
export function edgeKey(a,b){if(!Number.isInteger(a)||!Number.isInteger(b)||a<0||b<0||a>3||b>3||a===b)throw Error('请选择两个不同的物理端子。');return [a,b].sort().join('')}
export function initialHardware(){return {edges:[],atoms:[null,null],measured:null,pairing:[],records:{},loss:{}}}
export function pairStatus(steps){
 const s={occupied:[false,false],prepared:[false,false],paired:false,cz:false,released:false};
 for(const a of steps){
  if(a==='PutA'||a==='PutB'){const q=a==='PutA'?0:1;if(s.occupied[q]||s.paired||s.released)throw Error('这个座位已经有原子了。');s.occupied[q]=true}
  else if(a==='H0'||a==='H1'){const q=+a[1];if(!s.occupied.every(Boolean)||s.prepared[q]||s.paired||s.released)throw Error('先装好两个原子；每颗只准备一次 H。');s.prepared[q]=true}
  else if(a==='Pair'){if(!s.prepared.every(Boolean)||s.paired||s.released)throw Error('两颗原子都做好 H 准备后，才能进入配对区。');s.paired=true}
  else if(a==='CZ'){if(!s.paired||s.cz)throw Error('先进入配对区，再执行一次 CZ。');s.cz=true}
  else if(a==='Unpair'){if(!s.paired)throw Error('还没进入配对区。');s.paired=false;s.released=true}
  else throw Error('Unknown atom operation');
 }return s;
}
export function pairProbabilities(cz,basis='ZZ'){if(!['ZZ','H1'].includes(basis))throw Error('Invalid observation basis');const state=runReal(['H0','H1',...(cz?['CZ01']:[]),...(basis==='H1'?['H1']:[])],2);return state.map(v=>Math.max(0,v*v))}
export function lossProbabilities(p){if(!Number.isFinite(p)||p<0||p>1)throw Error('Invalid loss rate');return [(1-p)**2,p*(1-p),(1-p)*p,p*p]}
export function sampleLoss(p,shots=64,random=Math.random){lossProbabilities(p);if(!Number.isInteger(shots)||shots<1||shots>256)throw Error('Invalid shots');const counts=[0,0,0,0],examples=[];for(let n=0;n<shots;n++){const values=[random(),random()];if(values.some(r=>!Number.isFinite(r)||r<0||r>=1))throw Error('Invalid random source');const [a,b]=values.map(r=>r<p),j=(a?1:0)+(b?2:0);counts[j]++;if(n<16)examples.push(a?b?'□□':'□0':b?'1□':'10')}return {counts,examples}}
export function normalizeHardware(raw={}){const s=initialHardware();if(!raw||typeof raw!=='object')return s;s.edges=hardwareEdges.filter(e=>Array.isArray(raw.edges)&&raw.edges.includes(e));if(Array.isArray(raw.atoms)&&raw.atoms.length===2&&raw.atoms.every(a=>a===null||a===0||a===1))s.atoms=raw.atoms.slice();if(s.atoms.every(a=>a!==null)&&raw.measured===s.atoms.join(''))s.measured=raw.measured;if(Array.isArray(raw.pairing)&&raw.pairing.length<=7){try{pairStatus(raw.pairing);s.pairing=raw.pairing.slice()}catch{}}
 for(const key of ['without','with'])if(raw.records?.[key]===true)s.records[key]=true;
 for(const rate of ['0','0.25']){const record=raw.loss?.[rate];if(Array.isArray(record?.counts)&&record.counts.length===4&&record.counts.every(v=>Number.isInteger(v)&&v>=0)&&record.counts.reduce((a,b)=>a+b,0)===64)s.loss[rate]={counts:record.counts.slice(),examples:Array.isArray(record.examples)?record.examples.filter(x=>['10','□0','1□','□□'].includes(x)).slice(0,16):[]}}
 return s;
}
export function hardwareAction(raw,action,random=Math.random){const s=normalizeHardware(raw);
 if(action.type==='edge'){const key=edgeKey(action.a,action.b);if(!hardwareEdges.includes(key))throw Error('这两个端子之间没有耦合边。对角线不能直接连接。');if(!s.edges.includes(key))s.edges.push(key)}
 else if(action.type==='put'){if(![0,1].includes(action.target))throw Error('Invalid site');if(s.atoms[action.target]!==null)throw Error('座位已经有原子，不需要重复装载。');s.atoms[action.target]=0;s.measured=null}
 else if(action.type==='flip'){if(![0,1].includes(action.target))throw Error('Invalid site');if(s.atoms[action.target]===null)throw Error('空座位没有原子，先装载再翻转。');s.atoms[action.target]^=1;s.measured=null}
 else if(action.type==='measure'){if(s.atoms.some(a=>a===null))throw Error('先把两个座位都装上原子；空座位不是状态 0。');s.measured=s.atoms.join('')}
 else if(action.type==='pairStep'){const steps=[...s.pairing,action.step];pairStatus(steps);s.pairing=steps}
 else if(action.type==='pairReset')s.pairing=[];
 else if(action.type==='pairMeasure'){const p=pairStatus(s.pairing);if(!p.released||p.paired)throw Error('先准备、配对、退出配对区，然后测量。');pairProbabilities(p.cz,action.basis);if(action.basis==='H1')s.records[p.cz?'with':'without']=true}
 else if(action.type==='loss'){if(![0,.25].includes(action.rate))throw Error('Invalid preset');s.loss[action.rate]=sampleLoss(action.rate,64,random)}
 else throw Error('Unknown hardware action');return s;
}
export function readyHardware(index,s){return index===0?['01','13','23'].every(e=>s.edges.includes(e)):index===1?s.measured==='10':index===2?!!s.records.with&&!!s.records.without:index===3?!!s.loss[0]&&!!s.loss[.25]:false}
