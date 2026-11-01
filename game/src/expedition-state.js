export const EXPEDITION_KEY='spaceqat-expedition-v2';
export const machines=[
 {id:'sc',name:'超导量子操作室',part:'微波控制模块',source:'storage',task:0,description:'超导电路在极低温环境下工作，微波脉冲用于控制量子状态。'},
 {id:'neutral',name:'中性原子操作室',part:'光镊阵列模块',source:'observatory',task:1,description:'用聚焦光束形成光镊，捕获和排列中性原子。'},
 {id:'ion',name:'离子阱操作室',part:'电极控制模块',source:'storage',task:2,description:'电磁场束缚带电离子，激光可用于控制和读出。'},
 {id:'photon',name:'光量子操作室',part:'光路探测模块',source:'observatory',task:3,description:'用光子承载量子信息，光学元件与探测器参与操作和读出。'}
];
export function normalizeExpedition(raw={}){raw=raw&&typeof raw==='object'?raw:{};const list=k=>Array.isArray(raw[k])?raw[k]:[];const parts=machines.filter(m=>list('parts').includes(m.id)).map(m=>m.id),done=Array.from({length:4},(_,i)=>list('done')[i]===true),corrected=[0,1,2].filter(i=>list('corrected').includes(i)),installed=machines.filter(m=>parts.includes(m.id)&&done[m.task]&&list('installed').includes(m.id)).map(m=>m.id);return {version:2,parts,done,corrected,installed,runs:machines.filter(m=>corrected.length===3&&installed.includes(m.id)&&list('runs').includes(m.id)).map(m=>m.id)}}
export function canInstall(s,id){const m=machines.find(m=>m.id===id);return !!m&&s.parts.includes(id)&&s.done[m.task]}
export function canRun(s,id){return canInstall(s,id)&&s.installed.includes(id)&&s.corrected.length===3}
