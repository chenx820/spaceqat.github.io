// Real-amplitude subset used in chapter two. Basis order is q0 q1: 00,01,10,11.
export function gate(state,name){
 if(state.length!==4)throw Error('Expected two-qubit state');const out=Array(4).fill(0);
 if(name==='CX'){state.forEach((v,i)=>out[i&2?i^1:i]=v);return out}
 if(!/^[HXZ][01]$/.test(name))throw Error('Unsupported gate');const mask=name[1]==='0'?2:1;
 state.forEach((v,i)=>{if(name[0]==='X')out[i^mask]+=v;else if(name[0]==='Z')out[i]+=(i&mask?-1:1)*v;else{out[i&~mask]+=v/Math.sqrt(2);out[i|mask]+=(i&mask?-1:1)*v/Math.sqrt(2)}});return out;
}
export function circuit(gates,input=[1,0,0,0]){return gates.filter(Boolean).reduce(gate,[...input])}
export const bellPlus=[Math.SQRT1_2,0,0,Math.SQRT1_2];
export const bellMinus=[Math.SQRT1_2,0,0,-Math.SQRT1_2];
export function fidelity(a,b){return a.reduce((s,v,i)=>s+v*b[i],0)**2}
export function density(state){return state.map(a=>state.map(b=>a*b))}
export const classicalMixture=[[.5,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,.5]];
export function probabilities(rho,basis='ZZ'){
 if(!['ZZ','XX'].includes(basis))throw Error('Invalid basis');
 if(basis==='ZZ')return rho.map((row,i)=>row[i]);
 const columns=Array.from({length:4},(_,i)=>circuit(['H0','H1'],Array.from({length:4},(_,j)=>+(i===j))));
 return Array.from({length:4},(_,k)=>rho.reduce((sum,row,i)=>sum+row.reduce((s,v,j)=>s+columns[i][k]*v*columns[j][k],0),0));
}
export function sampleTwo(p,shots=64,random=Math.random){const counts=[0,0,0,0];for(let n=0;n<shots;n++){let r=random(),j=0;while(j<3&&r>=p[j])r-=p[j++];counts[j]++}return counts}
export function encodedState(){return [Math.sqrt(.6),0,0,0,0,0,0,Math.sqrt(.4)]}
export function flipPhysical(state,index){if(![0,1,2].includes(index))throw Error('Invalid physical bit');const out=Array(8).fill(0);state.forEach((v,i)=>out[i^(4>>index)]=v);return out}
export function syndrome(index){return [[1,0],[1,1],[0,1]][index]}
