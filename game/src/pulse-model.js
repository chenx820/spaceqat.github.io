export const pulseNames=['两种小捣蛋','相干时钟','第三层抽屉','目标101'];
const validRate=p=>{if(!Number.isFinite(p)||p<0||p>1)throw Error('Invalid probability');};
export function bellNoise(p=0,r=0){validRate(p);validRate(r);const before=[.5-p/4,p/4,p/4,.5-p/4],probabilities=before.map((_,j)=>before.reduce((sum,v,i)=>sum+v*[0,1].reduce((a,q)=>a*(((i>>q)&1)===((j>>q)&1)?1-r:r),1),0));return {probabilities,fidelity:1-3*p/4};}
export function coherence(t,noisy=true,T2=40){if(!Number.isFinite(t)||t<0||!Number.isFinite(T2)||T2<=0)throw Error('Invalid waiting time');const c=noisy?Math.exp(-t/T2):1;return [(1+c)/2,(1-c)/2];}
export function qutrit(a,b){if(!Number.isFinite(a)||!Number.isFinite(b))throw Error('Invalid rotation');return [Math.cos(a)**2,Math.sin(a)**2*Math.cos(b)**2,Math.sin(a)**2*Math.sin(b)**2];}
export const pulseCards={A:[Math.PI/2,.20],B:[1.35,.02]};
export function acceptableCard(name){const p=qutrit(...pulseCards[name]);return p[1]>=.9&&p[2]<=.01;}
// Real representation is exact here: the specified oracle and diffusion have no imaginary entries.
export function grover(rounds,noise=0,failure=0){if(!Number.isInteger(rounds)||rounds<0||rounds>3)throw Error('Invalid iterations');validRate(noise);validRate(failure);let rho=Array.from({length:8},()=>Array(8).fill(1/8));const U=Array.from({length:8},(_,i)=>Array.from({length:8},(_,j)=>(.25-(i===j?1:0))*(j===5?-1:1)));
 for(let k=0;k<rounds;k++){const left=U.map(row=>rho[0].map((_,j)=>row.reduce((s,v,l)=>s+v*rho[l][j],0)));rho=left.map((row,i)=>U.map((u,j)=>(1-noise)*row.reduce((s,v,l)=>s+v*u[l],0)+(j===i?noise/8:0)));}
 return {rho,probabilities:rho.map((row,i)=>(1-failure)*row[i]),failure,oracleCalls:rounds};}
export function sampleDistribution(probabilities,shots=64,random=Math.random){if(!Number.isInteger(shots)||shots<1||shots>256||probabilities.some(p=>!Number.isFinite(p)||p<0)||Math.abs(probabilities.reduce((a,b)=>a+b,0)-1)>1e-8)throw Error('Invalid sampling distribution');const counts=probabilities.map(()=>0);for(let n=0;n<shots;n++){let r=random();if(!Number.isFinite(r)||r<0||r>=1)throw Error('Invalid random source');let i=0;while(i<counts.length-1&&r>=probabilities[i]){r-=probabilities[i];i++;}counts[i]++;}return counts;}
export function initialPulse(){return {observations:{},selectedCard:null};}
export function pulseResult(index,key){
 if(index===0&&['ideal','gate','read','both'].includes(key)){const b=bellNoise(['gate','both'].includes(key)?.12:0,['read','both'].includes(key)?.05:0);return {...b,labels:['00','01','10','11']};}
 if(index===1&&['ideal-0','ideal-20','noise-0','noise-20'].includes(key)){const [mode,t]=key.split('-');return {probabilities:coherence(+t,mode==='noise'),labels:['0','1']};}
 if(index===2&&pulseCards[key])return {probabilities:qutrit(...pulseCards[key]),labels:['0','1 · 目标','2 · 泄漏']};
 if(index===3&&/^[ABC]-[0-3]$/.test(key)){const [mode,n]=key.split('-'),g=grover(+n,mode==='A'?0:.04,mode==='C'?.03:0);return {...g,probabilities:[...g.probabilities,...(mode==='C'?[g.failure]:[])],labels:[...Array.from({length:8},(_,i)=>i.toString(2).padStart(3,'0')),...(mode==='C'?['失败旗标']:[])]};}
 throw Error('Unknown experiment');
}
export function normalizePulse(raw){const s=initialPulse();if(!raw||typeof raw!=='object')return s;for(const [key,v] of Object.entries(raw.observations||{})){const [index,...rest]=key.split(':');try{const r=pulseResult(+index,rest.join(':'));if(Array.isArray(v)&&v.length===r.probabilities.length&&v.every(n=>Number.isInteger(n)&&n>=0)&&v.reduce((a,b)=>a+b,0)===64)s.observations[key]=v.slice();}catch{}}if(['A','B'].includes(raw.selectedCard))s.selectedCard=raw.selectedCard;return s;}
export function observePulse(raw,index,key,random=Math.random){const s=normalizePulse(raw);s.observations[index+':'+key]=sampleDistribution(pulseResult(index,key).probabilities,64,random);return s;}
export function readyPulse(index,s){const has=k=>!!s.observations[index+':'+k];return index===0?['ideal','gate','read','both'].every(has):index===1?['ideal-0','ideal-20','noise-0','noise-20'].every(has):index===2?['A','B'].every(has)&&s.selectedCard==='B':index===3?['A-0','A-1','A-2','A-3','B-2','C-2'].every(has):false;}
