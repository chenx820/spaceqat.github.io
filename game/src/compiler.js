import {compilerNotes as tips} from './chapter-knowledge.js';
import {qatDialogue} from './qat-dialogue.js';
import {openProgramming} from './programming.js';
import {CAMPAIGN_KEY,normalizeCampaign,saveCampaignSection} from './campaign-state.js';
import {compilerNames,initialCompiler,judgeCompiler,finalLayout,runReal,scheduleTasks,routeActions} from './routing-model.js';

const goals=['用三个槽位拼出与 CX 完全相同的开关。','安排三位乘客，让三次会面都发生在相邻车站。','用相邻交换和 CX，完成逻辑 CX(q0,q2)。不必回到原站。','把四个任务安排进两层时间；不能遗漏、冲突或颠倒依赖。'];
const answer=[['写法不同，整个操作可以相同','只要00的结果相同，所有输入都相同'],['把最常见面的 q0 放中间','把所有乘客都放在一个站'],['交换后要继续追踪逻辑乘客的位置','物理站点编号也会跟着移动'],['门数不变，不冲突的操作能同时进行','动画更快，所以任意硬件误差都更少']];
const B=(act,text,attrs='')=>`<button data-cact="${act}" ${attrs}>${text}</button>`;
const ticket=t=>`<span class="mp-ticket">${t}</span>`;
const arrow='<i class="mp-arrow" aria-hidden="true">══▶</i>';
const gateArt=g=>g.startsWith('C')?`<span class="cp-double" aria-hidden="true"><i>●</i><em></em><i>${g.startsWith('CZ')?'●':'⊕'}</i></span><small>${g}</small>`:`<b>${g}</b>`;
export function createCompiler({previousComplete=()=>false,basicInstalled=()=>false,onNavigate=()=>{},storage=localStorage}={}){
 let state=normalizeCampaign();try{state=normalizeCampaign(JSON.parse(storage.getItem(CAMPAIGN_KEY)))}catch{}
 let index=0,tutorial=true,page=0,demo=false,selected=0,feedback='',checked=false,last=null,probe=0,saveError=false;
 const d=document.createElement('dialog');d.id='compilerDialog';d.className='pixel-workshop';d.setAttribute('aria-labelledby','compilerTitle');d.innerHTML='<header class="workbench-head"><div><h2 id="compilerTitle"></h2></div><button id="closeCompiler" aria-label="返回房间">✕</button></header><div id="compilerBody"></div>';document.body.append(d);const body=d.querySelector('#compilerBody');d.querySelector('#closeCompiler').onclick=()=>d.close();
 function save(){try{state=saveCampaignSection(storage,state,'compiler');saveError=false}catch{saveError=true}document.dispatchEvent(new Event('campaignprogress'))}
 function shell(title,html){d.querySelector('#compilerTitle').textContent=title;body.innerHTML=html+(saveError?'<p role="alert">本次进度尚未保存，请保持页面打开。</p>':'');qatDialogue(d,'把积木、乘客与时间摆好，让线路顺利通过！');if(!d.open)d.showModal()}
 function open(i){if(!Number.isInteger(i)||i<0||i>3)return;if(!previousComplete()||(i>0&&!state.compiler[i-1])){shell('编译工坊 · 尚待解锁',`<p>${!previousComplete()?'先在测量港完成四份研究记录。':'先完成本章上一台装置。'}</p>${B('close','返回房间')}`);body.querySelector('button').onclick=()=>d.close();return}index=i;tutorial=true;page=0;demo=false;selected=0;checked=false;last=null;feedback='';render();d.scrollTop=0}
 function stations(layout,interactive=false){return `<div class="cp-stations">${layout.map((q,p)=>`<div class="cp-station"><small>P${p}</small>${interactive?B('station-'+p,`q${q}`,`data-station="${p}" class="cp-passenger ${q===selected?'selected':''}" aria-label="把所选乘客放到 P${p}，现在是 q${q}"`):`<b class="cp-passenger">q${q}</b>`}</div>`).join('<i class="cp-rail">══</i>')}</div>`}
 function slots(gates,count){return `<div class="cp-circuit"><div class="cp-wires" aria-hidden="true"><i></i><i></i></div><span class="cp-input"><span>q0</span><span>q1</span></span>${Array.from({length:count},(_,i)=>`<span data-cslot="${i}" class="cp-slot ${gates[i]?'loaded':''}">${gates[i]?gateArt(gates[i]):`<small>槽 ${i+1}</small>`}</span>`).join('')}<span class="cp-probe">◉<small>检验</small></span></div>`}
 function tutorialBoard(){
  if(index===0)return `${slots(demo?['H1','CZ01','H1']:[],3)}<p>${demo?'下轨 H → 两轨 CZ → 下轨 H，与目标 CX 等价。':'目标是 CX：上轨控制下轨。点按钮看另一种写法。'}</p>`;
  if(index===1)return `${stations(demo?[1,0,2]:[0,1,2])}<div class="mp-flow">${ticket('q0 ↔ q1')}${ticket('q0 ↔ q2')}${ticket('q0 ↔ q1')}</div><p>${demo?'q0 在中间，每次会面都相邻。':'q0 在边上，与 q2 隔着一站。'}</p>`;
  if(index===2)return `${stations(demo?[0,2,1]:[0,1,2])}<div class="mp-flow">${ticket(demo?'Swap(P1,P2) → CX(P0,P1)':'逻辑目标：CX(q0,q2)')}</div><p>站号不动，乘客换位。${demo?'现在 q2 坐在 P1，q0 可以直接控制它。':'先把远处的 q2 交换过来。'}</p>`;
  return `<div class="cp-demo-schedule">${(demo?['第1层：H0 + H2','第2层：CZ01 + CZ23']:['第1层：H0','第2层：H2','第3层：CZ01','第4层：CZ23']).map(ticket).join('')}</div><p>四个门、两个双比特门；${demo?'并行后两层。':'串行四层。'}这是教学时间格，不是硬件纳秒。</p>`;
 }
 function render(){const focus=document.activeElement?.dataset.cact;
  if(tutorial){shell(`04-${index+1} · ${compilerNames[index]}`,`<p>${page+1} / 3 · ${['认识装置','看一次安排','带着发现开始'][page]}</p><p class="mp-goal">${goals[index]}</p><section class="mp-board">${tutorialBoard()}${B('demo',demo?'看起点':'▶ 演示一次','class="primary"')}</section><p class="mp-note">${tips[index]}</p><footer class="mp-actions">${B('skip','跳过，进入实验')}${B('prev','上一步',page===0?'disabled':'')}${B('next',page===2?'进入实验 →':'下一步 →','class="primary"')}</footer>`)}
  else{const s=state.compilerDrafts[index];shell(`04-${index+1} · ${compilerNames[index]}`,`<div class="mp-toolbar">${B('tutorial','▷ 重看教程')}${B('reset','重新准备')}${B('program','独立 FatQat 编程终端')}</div><p class="mp-goal">${goals[index]}</p><section class="mp-board">${taskView(s)}<div class="mp-actions">${B('run','▶ 检验这份安排','class="primary"')}</div>${last?resultView(s):''}</section><p class="mp-feedback" role="status">${feedback||'选择积木或乘客，亲手安排之后再检验。'}</p>${checked?`<section class="mp-review"><h3>把发现装进日志</h3>${answer[index].map((text,i)=>B('answer-'+i,text)).join('')}</section>`:''}${state.compiler[index]?'<div class="mp-success">✔ 本关研究记录已保存，可以回房间探索下一台装置。</div>':''}<details><summary>想多知道一点？</summary><p>${tips[index]}</p><p>${['比较全部四维算子，包括相对相位；只允许共同的全局相位。当前门集合为实数矩阵，全局相位等价表现为同一个正负号。','统计的是固定会面序列中的非相邻交互次数，不冒称真实编译成本。','末布局随 Swap 改变，检验前按逻辑 q0 q1 q2 还原顺序。','比较同一电路的有效调度，保持依赖与资源约束。本地验证不调用 FatQat 编译器；独立终端仍保留原有双比特编程接口。'][index]}</p></details>${B('close','返回房间，走向下一台装置')}`)}
  body.querySelectorAll('[data-cact]').forEach(b=>b.onclick=()=>act(b.dataset.cact));
  body.querySelectorAll('[data-drag]').forEach(b=>{b.draggable=true;b.ondragstart=e=>{e.dataTransfer.setData('text/plain',b.dataset.drag);selected=+b.dataset.drag}});
  body.querySelectorAll('[data-time]').forEach(b=>{b.ondragover=e=>e.preventDefault();b.ondrop=e=>{e.preventDefault();const id=e.dataTransfer.getData('text/plain');if(/^[0-3]$/.test(id)){selected=+id;assign(+b.dataset.time)}}});
  body.querySelectorAll('[data-cgate]').forEach(b=>{b.draggable=true;b.ondragstart=e=>e.dataTransfer.setData('text/plain','gate:'+b.dataset.cgate)});
  body.querySelectorAll('[data-cslot]').forEach(slot=>{slot.ondragover=e=>{if(index===0)e.preventDefault()};slot.ondrop=e=>{e.preventDefault();if(index!==0)return;const g=e.dataTransfer.getData('text/plain').replace(/^gate:/,'');if(!['H1','CZ01'].includes(g))return;if(+slot.dataset.cslot!==state.compilerDrafts[index].translation.length){feedback='请放到第一个空槽；已装好的积木可以先撤销。';render();return}act('gate-'+g)}});
  body.querySelectorAll('[data-passenger]').forEach(b=>{b.draggable=true;b.ondragstart=e=>e.dataTransfer.setData('text/plain','q:'+b.dataset.passenger)});
  body.querySelectorAll('[data-station]').forEach(b=>{b.ondragover=e=>e.preventDefault();b.ondrop=e=>{e.preventDefault();const m=/^q:([012])$/.exec(e.dataTransfer.getData('text/plain'));if(m){selected=+m[1];act('station-'+b.dataset.station)}}});
  if(focus)Array.from(body.querySelectorAll('[data-cact]')).find(b=>b.dataset.cact===focus)?.focus({preventScroll:true});
 }
 function taskView(s){
  if(index===0)return `${slots(s.translation,3)}<div class="mp-actions">${B('gate-H1','放 H（下轨 q1）','data-cgate="H1"')}${B('gate-CZ01','放 CZ','data-cgate="CZ01"')}${B('undo','↶ 撤销',s.translation.length?'':'disabled')}</div><p>三个槽位。目标开关是 q0 控制 q1 的 CX。</p>`;
  if(index===1)return `<p>先选乘客，再点目标车站；已占位时，两位乘客交换。</p><div class="mp-actions">${[0,1,2].map(q=>B('select-'+q,`选择 q${q}`,`data-passenger="${q}" class="${selected===q?'selected':''}" aria-pressed="${selected===q}"`)).join('')}</div>${stations(s.layout,true)}<div class="mp-flow">${[[0,1],[0,2],[0,1]].map(([a,b])=>ticket(`CX(q${a},q${b})`)).join('')}</div>`;
  if(index===2)return `${stations(finalLayout(s.route))}<div class="cp-route">${s.route.map(g=>ticket(g[0]==='S'?`交换 P${g[1]} ↔ P${g[2]}`:`CX P${g[1]} → P${g[2]}`)).join(arrow)||ticket('等待第一步')}</div><div class="mp-actions">${routeActions.map(g=>B('route-'+g,g[0]==='S'?`交换 P${g[1]} ↔ P${g[2]}`:`CX P${g[1]} → P${g[2]}`)).join('')}${B('undo','↶ 撤销',s.route.length?'':'disabled')}</div><p>最多四步，只提供相邻操作；CX 箭头指向被翻转的一位。</p>`;
  return `<p>先选择任务，再点击时间列；也能把任务块拖入该列。重复放置会移动原任务，不会复制。</p><div class="mp-actions">${scheduleTasks.map((t,i)=>B('select-'+i,t.id,`data-drag="${i}" class="${selected===i?'selected':''}" aria-pressed="${selected===i}"`)).join('')}</div><div class="cp-timetable">${[0,1,2,3].map(t=>`<div class="cp-time" data-time="${t}"><button data-cact="time-${t}" aria-label="把所选任务放到第 ${t+1} 层">第 ${t+1} 层</button>${scheduleTasks.map((task,i)=>s.slots[i]===t?`<div class="cp-task">${task.id}<small>工位 ${task.targets.map(q=>'q'+q).join('、')}</small></div>`:'').join('')}</div>`).join('')}</div><p>依赖：H0 在 CZ01 前；H2 在 CZ23 前。基线：4个门 / 2个双比特门 / 4层。</p>`;
 }
 function resultView(s){
  if(index===0){const input=probe.toString(2).padStart(2,'0'),target=runReal(['C01'],2,probe),actual=runReal(s.translation,2,probe);return `<div class="cp-comparison"><h3>输入小灯 ${input}</h3><div class="mp-flow">${target.map((v,i)=>ticket(`${i.toString(2).padStart(2,'0')} ${(v*v*100).toFixed(0)}%`)).join('')}</div><p>你的线路</p><div class="mp-flow">${actual.map((v,i)=>ticket(`${i.toString(2).padStart(2,'0')} ${(v*v*100).toFixed(0)}%`)).join('')}</div>${B('probe','换一个输入观察')}<p>上方只是概率预览；通关还验证所有输入间的相对相位。</p></div>`}
  if(index===1)return `<div class="mp-records">${last.checks.map(c=>ticket(`${c.pair.map(q=>'q'+q).join(' ↔ ')} ${c.adjacent?'✓ 相邻':'× 隔站'}`)).join('')}</div>`;
  if(index===2)return `<div class="mp-flow">${ticket('末布局：'+last.layout.map((q,p)=>`q${q}@P${p}`).join(' · '))}${ticket(last.ok?'逻辑算子一致':'逻辑算子仍不同')}</div>`;
  return `<div class="mp-flow">${ticket('门数 4')}${ticket('双比特门 2')}${ticket(last.depth===undefined?'调度冲突':`时间层 ${last.depth}`)}</div>`;
 }
 function changed(){checked=false;last=null;feedback='安排已改变，请重新检验。';save();render()}
 function assign(time){state.compilerDrafts[index].slots[selected]=time;changed()}
 function act(a){
  if(a==='close'){d.close();return}if(a==='program'){openProgramming();return}
  if(a==='demo'){demo=!demo;render();return}if(a==='prev'){page=Math.max(0,page-1);render();return}if(a==='next'&&page<2){page++;render();return}if(a==='skip'||a==='next'){tutorial=false;render();return}if(a==='tutorial'){tutorial=true;page=0;demo=false;render();return}
  const s=state.compilerDrafts[index];
  if(a==='reset'){state.compilerDrafts[index]=initialCompiler();changed();return}
  if(a.startsWith('select-')){selected=+a.slice(7);render();return}
  if(a.startsWith('time-')){assign(+a.slice(5));return}
  if(a.startsWith('station-')){const p=+a.slice(8),old=s.layout.indexOf(selected);[s.layout[p],s.layout[old]]=[s.layout[old],s.layout[p]];changed();return}
  if(a.startsWith('gate-')||a.startsWith('route-')){const route=a.startsWith('route-'),items=route?s.route:s.translation,max=route?4:3;if(items.length>=max){feedback=`${max} 个位置已经用完，请先撤销一步。`;render();body.querySelector('[data-cact="undo"]')?.classList.add('cp-attention');return}items.push(a.slice(route?6:5));changed();return}
  if(a==='undo'){(index===0?s.translation:s.route).pop();changed();return}
  if(a==='run'){last=judgeCompiler(index,s);checked=last.ok;feedback=last.message;render();return}
  if(a==='probe'){probe=(probe+1)%4;render();return}
  if(a.startsWith('answer-')){if(!checked||!judgeCompiler(index,s).ok)return;const ok=a==='answer-0';feedback=ok?'✔ '+tips[index]:'再看一次装置：'+tips[index];if(ok){state.compiler[index]=true;save();if(state.compiler.every(Boolean))feedback+=' 路由时刻盘已获得！去离子阱操作室的航行升级槽安装。'}render();body.querySelector(`[data-cact="${a}"]`)?.classList.add(ok?'mp-correct':'mp-wrong')}
 }
 function journal(){shell('编译工坊 · 研究日志',state.compiler.map((done,i)=>`<article class="mp-journal"><h3>${done?'✓':'○'} 04-${i+1} ${compilerNames[i]}</h3><p>${done?tips[i]:'在对应装置完成实验后收录。'}</p></article>`).join(''))}
 function upgrade(){const owned=state.compiler.every(Boolean),allowed=owned&&basicInstalled();shell('离子阱操作室 · 航行升级',`<div class="mp-upgrade"><div class="mp-chip cp-disk upgrade-item" draggable="${allowed&&!state.routeDiskInstalled}" role="img" aria-label="路由时刻盘"><img src="./assets/items/route-disk.png" alt="" draggable="false"></div>${arrow}<button id="routeDiskSlot" ${allowed&&!state.routeDiskInstalled?'':'disabled'}>${state.routeDiskInstalled?'✓ 时刻盘已安装':'安装时刻盘 · 点击或拖入'}</button></div><p>${!owned?'完成编译工坊四关后获得时刻盘。':!basicInstalled()?'先在本房间主机装好基础电极控制模块。':state.routeDiskInstalled?'航行升级已保存，原有机器仍可正常运行。':'把时刻盘拖入插槽，或直接点击插槽。'}</p>${B('room','前往编译工坊')}<p>这是剧情升级，不表示真实离子阱编译后端已经接入。</p>`);const slot=body.querySelector('#routeDiskSlot'),disk=body.querySelector('.cp-disk');disk.ondragstart=e=>e.dataTransfer.setData('text/plain','route-disk');const install=()=>{if(!allowed)return;state.routeDiskInstalled=true;save();upgrade()};slot.onclick=install;slot.ondragover=e=>{if(allowed)e.preventDefault()};slot.ondrop=e=>{e.preventDefault();if(e.dataTransfer.getData('text/plain')==='route-disk')install()};body.querySelector('[data-cact]').onclick=()=>{d.close();onNavigate('compiler')}}
 return {open,journal,upgrade,get completed(){return state.compiler.filter(Boolean).length},inventory(){return `<article class="journal-card"><h3><img class="inventory-item-art" src="./assets/items/route-disk.png" alt="" draggable="false"> 路由时刻盘</h3><p>${state.compiler.every(Boolean)?state.routeDiskInstalled?'已安装到离子阱操作室':'已获得 · 去离子阱操作室安装':'编译工坊四关完成后获得'}</p></article>`}};
}
