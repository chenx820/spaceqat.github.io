// Exact real-amplitude subset. Qubit 0 is the most significant displayed bit.
export const compilerNames=['门的翻译','三点一线','交换列车','两条航线'];
export const translations=['H1','CZ01'];
export const routeActions=['S01','S12','C01','C10','C12','C21'];
export const scheduleTasks=[{id:'H0',targets:[0],gate:'H0'},{id:'H2',targets:[2],gate:'H2'},{id:'CZ01',targets:[0,1],gate:'CZ01'},{id:'CZ23',targets:[2,3],gate:'CZ23'}];
export function applyRealGate(state,gate){
 const n=Math.log2(state.length);if(!Number.isInteger(n)||n<1||n>4)throw Error('Expected 1–4 qubits');
 const m=/^(H|CZ|C|S)(\d)(\d)?$/.exec(gate);if(!m)throw Error('Unsupported gate');
 const [,kind,a,b]=m,x=+a,y=b===undefined?null:+b;if(x>=n||(kind==='H'?y!==null:y===null||y>=n||x===y))throw Error('Invalid gate operands');
 const mask=1<<(n-1-x),other=y===null?0:1<<(n-1-y),out=Array(state.length).fill(0);
 state.forEach((v,i)=>{if(kind==='H'){out[i&~mask]+=v*Math.SQRT1_2;out[i|mask]+=(i&mask?-v:v)*Math.SQRT1_2}else if(kind==='CZ')out[i]+=((i&mask)&&(i&other)?-1:1)*v;else if(kind==='C')out[(i&mask)?i^other:i]+=v;else out[!!(i&mask)!==!!(i&other)?i^mask^other:i]+=v});return out;
}
export function runReal(gates,n,input=0){let s=Array(2**n).fill(0);s[input]=1;return gates.reduce(applyRealGate,s)}
export function operatorColumns(gates,n){return Array.from({length:2**n},(_,i)=>runReal(gates,n,i))}
export function sameRealOperator(a,b,tolerance=1e-9){
 if(a.length!==b.length||a.some((r,i)=>r.length!==b[i].length))return false;
 // A single common sign for the entire real operator, never one sign per column.
 const flat=a.flat(),ref=b.flat(),pivot=ref.findIndex(v=>Math.abs(v)>tolerance);if(pivot<0)return false;
 const sign=flat[pivot]/ref[pivot];if(Math.abs(Math.abs(sign)-1)>tolerance)return false;
 return flat.every((v,i)=>Number.isFinite(v)&&Math.abs(v-sign*ref[i])<tolerance);
}
export function validLayout(layout){return Array.isArray(layout)&&layout.length===3&&layout.slice().sort().join('')==='012'}
export function layoutCost(layout){if(!validLayout(layout))throw Error('Invalid layout');return [[0,1],[0,2],[0,1]].map(([a,b])=>({pair:[a,b],stations:[layout.indexOf(a),layout.indexOf(b)],adjacent:Math.abs(layout.indexOf(a)-layout.indexOf(b))===1}))}
export function finalLayout(gates){const layout=[0,1,2];for(const g of gates){if(!routeActions.includes(g))throw Error('Only adjacent routing actions allowed');if(g[0]==='S'){const a=+g[1],b=+g[2];[layout[a],layout[b]]=[layout[b],layout[a]]}}return layout}
export function routeOperator(gates){const layout=finalLayout(gates),columns=operatorColumns(gates,3);return columns.map(column=>{const logical=Array(8).fill(0);column.forEach((v,physical)=>{let target=0;layout.forEach((q,p)=>{if(physical&(4>>p))target|=4>>q});logical[target]=v});return logical})}
export function checkSchedule(slots){
 if(!Array.isArray(slots)||slots.length!==4||slots.some(t=>!Number.isInteger(t)||t<0||t>3))return {ok:false,message:'把四个任务块都放进时间列。'};
 for(let a=0;a<4;a++)for(let b=a+1;b<4;b++)if(slots[a]===slots[b]&&scheduleTasks[a].targets.some(q=>scheduleTasks[b].targets.includes(q)))return {ok:false,message:'同一时间有两个任务占用了同一个工位，请把它们错开。'};
 if(slots[0]>=slots[2]||slots[1]>=slots[3])return {ok:false,message:'先 H 准备，再运行它后面的 CZ。不能颠倒这两步。'};
 const gates=scheduleTasks.map((t,i)=>({...t,time:slots[i]})).sort((a,b)=>a.time-b.time).map(t=>t.gate);
 const equivalent=sameRealOperator(operatorColumns(gates,4),operatorColumns(scheduleTasks.map(t=>t.gate),4));
 const depth=Math.max(...slots)+1;
 return {ok:equivalent&&depth<=2,equivalent,depth,twoQubit:2,message:equivalent?(depth<=2?'两层排好了！门数仍是4，双比特门仍是2，时间层从4变成2。':'线路正确，再把不冲突的任务放在同一时间，争取两层完成。'):'线路作用与原任务不一致。'};
}
export function initialCompiler(){return {translation:[],layout:[0,1,2],route:[],slots:[null,null,null,null]}}
export function normalizeCompiler(raw={}){const s=initialCompiler();if(!raw||typeof raw!=='object')return s;if(Array.isArray(raw.translation)&&raw.translation.length<=3&&raw.translation.every(x=>translations.includes(x)))s.translation=raw.translation.slice();if(validLayout(raw.layout))s.layout=raw.layout.slice();if(Array.isArray(raw.route)&&raw.route.length<=4&&raw.route.every(x=>routeActions.includes(x)))s.route=raw.route.slice();if(Array.isArray(raw.slots)&&raw.slots.length===4)s.slots=raw.slots.map(t=>Number.isInteger(t)&&t>=0&&t<=3?t:null);return s}
export function judgeCompiler(index,s){
 if(index===0){const ok=sameRealOperator(operatorColumns(s.translation,2),operatorColumns(['C01'],2));return {ok,message:ok?'所有输入及相对相位都匹配 CX！':'作用还不同。试试 H(下轨) → CZ → H(下轨)，不能只看00这一种输入。'}}
 if(index===1){const checks=layoutCost(s.layout),cost=checks.filter(c=>!c.adjacent).length;return {ok:cost===0,checks,cost,message:cost?`还有 ${cost} 次会面隔着一站。试着把 q0 放中间。`:'三次会面都相邻！这里计算的是非相邻交互数，不是实际编译器门数。'}}
 if(index===2){const layout=finalLayout(s.route),ok=sameRealOperator(routeOperator(s.route),operatorColumns(['C02'],3));return {ok,layout,message:ok?'交换后名字跟着乘客移动，已经完成逻辑 CX(q0,q2)！不要求回到原站。':'先把 q2 交换到 q0 旁边，再用 q0 控制它。注意控制方向与末布局。'}}
 if(index===3)return checkSchedule(s.slots);throw Error('Unknown lesson');
}
