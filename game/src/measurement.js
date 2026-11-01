import {measurementNotes as notes} from './chapter-knowledge.js';
import {qatDialogue} from './qat-dialogue.js';
import {CAMPAIGN_KEY,normalizeCampaign,canOpenMeasurement,saveCampaignSection} from './campaign-state.js';
import {measurementNames,initialMeasurement,measurementAction,readyMeasurement,resetBranch,conditionalBranch} from './measurement-model.js';

const goals=['分别收集 1、64、256 颗星，比较蓝金星的次数。','试两种接线，各打印一张清单。','按 Reset → X 装好两步，检查 0 和 1 两种历史。','选择触发条件，让两条历史路线最终都回到 0。'];
const questions=[['次数多，就一定恰好各半','次数多通常更稳定，但不保证这次更接近一半'],['纸条的位置交换了，灯没交换','线路把两盏量子灯交换了'],['过去的记录也被擦掉了','当前状态重置，过去的纸条仍保留'],['控制用的是测量后留下的纸条','控制偷偷读取了未测量的量子态']];
const correct=[1,0,1,0];
const lamp=(bit,label)=>`<span class="mp-lamp ${bit?'on':'off'}"><i aria-hidden="true"></i><b>${label??'|'+bit+'⟩'}</b></span>`;
const ticket=t=>`<span class="mp-ticket">${t}</span>`;
const arrow='<i class="mp-arrow" aria-hidden="true">══▶</i>';
const button=(a,t,extra='')=>`<button data-act="${a}" ${extra}>${t}</button>`;
export function createMeasurement({bridgeComplete=()=>false,basicInstalled=()=>false,onNavigate=()=>{},storage=localStorage}={}){
 let state=normalizeCampaign();try{state=normalizeCampaign(JSON.parse(storage.getItem(CAMPAIGN_KEY)))}catch{}
 const d=document.createElement('dialog');d.id='measurementDialog';d.className='pixel-workshop';d.setAttribute('aria-labelledby','measurementTitle');
 d.innerHTML='<header class="workbench-head"><div><span class="eyebrow">03 · 测量港 / 本地教学模型</span><h2 id="measurementTitle"></h2></div><button id="closeMeasurement" aria-label="返回房间">✕</button></header><div id="measurementBody"></div>';
 document.body.append(d);const body=d.querySelector('#measurementBody');let index=0,mode='task',page=0,demo=0,feedback='',result='',saveError=false;
 d.querySelector('#closeMeasurement').onclick=()=>d.close();
 function save(){try{state=saveCampaignSection(storage,state,'measurement');saveError=false}catch{saveError=true}document.dispatchEvent(new Event('campaignprogress'))}
 function shell(title,html,line='按自己的节奏探索，试错不会扣分。'){
  d.querySelector('#measurementTitle').textContent=title;body.innerHTML=html+(saveError?'<p role="alert">本次进度尚未保存，请保持页面打开。</p>':'');qatDialogue(d,line);if(!d.open)d.showModal();
 }
 function open(i,tutorial=true){
  if(!canOpenMeasurement(state,i,bridgeComplete())){shell('测量港 · 等待上一份发现',`<p>${!bridgeComplete()?'先完成第二章的四座桥，再来认识测量记录。':'先完成本章前一台装置，再来开启这一台。'}</p>${button('back','返回房间')}`);body.querySelector('button').onclick=()=>d.close();return}
  index=i;mode=tutorial?'tutorial':'task';page=0;demo=0;feedback='';result='';render();d.scrollTop=0;
 }
 function tutorialVisual(){
  if(index===0)return `<div class="mp-demo-stars">${Array.from({length:demo?16:1},(_,i)=>`<i class="${i%2?'gold':''}" style="--delay:${i*.03}s">✦</i>`).join('')}</div><p>H 准备 → 每次测一颗 → 放入蓝 / 金收集匣</p>`;
  if(index===1)return `<div class="mp-flow">${lamp(1,'q0 亮')}${arrow}${ticket(demo?'c1 = 1':'c0 = 1')}</div><div class="mp-flow">${lamp(0,'q1 暗')}${arrow}${ticket(demo?'c0 = 0':'c1 = 0')}</div><p>纸条：${demo?'01':'10'} · 固定按 c0 c1 阅读</p>`;
  if(index===2)return `<div class="mp-flow">${ticket('历史 '+demo)}${lamp(demo)}${arrow}${ticket('Reset')}${lamp(0)}${arrow}${ticket('X')}${lamp(1)}</div><p>纸条不变；现在的灯重新准备、再翻转。</p>`;
  const branch=conditionalBranch(demo,'one');return `<div class="mp-flow">${ticket('纸条 '+demo)}${arrow}${ticket(branch.triggered?'触发 X':'跳过 X')}${arrow}${lamp(0)}</div><p>条件：纸条为 1 才翻转。两条路线最后都暗下来了。</p>`;
 }
 function render(){
  const focused=document.activeElement?.getAttribute('data-act');
  if(mode==='tutorial'){
   shell(`03-${index+1} · ${measurementNames[index]}`,`<p class="mp-page">${page+1} / 3 · ${['认识装置','亲手看一次','带着发现开始'][page]}</p><h3>${['先认识这里的小物件','点一下，比较两种情况','接下来由你来操作'][page]}</h3><section class="mp-board">${tutorialVisual()}${button('demo',index===0?'切换一颗 / 一匣星星':index===1?'交换纸条箱':index===2?'切换历史 0 / 1':'切换纸条 0 / 1')}</section><p class="mp-note">${notes[index]}</p><p>${goals[index]}</p><footer class="mp-actions">${button('skip','跳过，进入实验')}${button('previous','上一步',page===0?'disabled':'')}${button('next',page===2?'进入实验 →':'下一步 →','class="primary"')}</footer>`,'先看看，再亲手试一次；随时可以重看。');
  }else{
   const s=state.drafts[index];
   shell(`03-${index+1} · ${measurementNames[index]}`,`<div class="mp-toolbar">${button('tutorial','▷ 重看教程')}${button('reset','重新准备')}</div><p class="mp-goal">${goals[index]}</p><section class="mp-board">${taskView(s)}</section><div class="mp-feedback" role="status">${feedback||'观察装置，再选择操作。'}</div>${readyMeasurement(index,s)?`<section class="mp-review"><h3>把发现装进日志</h3><p>${index===0?'怎样理解这些样本？':index===1?'发生了什么？':index===2?'Reset 改变了什么？':'条件闸门用的是什么？'}</p>${questions[index].map((q,j)=>button('answer-'+j,q)).join('')}</section>`:''}${state.measurement[index]?`<div class="mp-success">✔ 本关发现已保存。${notes[index]}</div>`:''}<details><summary>想多知道一点？</summary><p>${notes[index]}</p><p>${['单次蓝 / 金的理论概率各为 1/2。每次运行使用新的随机样本。','输入 q0q1=10。映射 identity 输出 c0c1=10，交叉映射输出01。','H 后测量的两个分支概率各1/2。Reset 后都是 |0⟩，X 后都是 |1⟩。','H → 测量 c0 → 若 c0=1 则 X；最后量子位为0，而经典记录仍可能是0或1。'][index]}</p></details>${button('back','返回房间，走向下一台装置')}`, '让灯、纸条和记录告诉我们答案。');
  }
  body.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>act(b.dataset.act));
  body.querySelectorAll('[data-map]').forEach(b=>{b.onclick=()=>dispatch({type:'mapping',target:+b.dataset.map});b.ondragover=e=>e.preventDefault();b.ondrop=e=>{e.preventDefault();if(e.dataTransfer.getData('text/plain')==='q0')dispatch({type:'mapping',target:+b.dataset.map})}});
  const source=body.querySelector('[data-source]');if(source)source.ondragstart=e=>e.dataTransfer.setData('text/plain','q0');
  if(focused)Array.from(body.querySelectorAll('[data-act]')).find(b=>b.dataset.act===focused)?.focus({preventScroll:true});
 }
 function chart(n,c){return `<article class="mp-sample"><h4>${n} 次独立准备与测量</h4>${c.map((v,i)=>`<div class="mp-count"><span>${i?'金星':'蓝星'} ${v}/${n}</span><div class="mp-track" aria-label="样本 ${v/n*100}%，理论50%"><i style="width:${v/n*100}%"></i><b></b></div></div>`).join('')}<small>实心：样本频率 · 金线：理论 50%</small></article>`}
 function taskView(s){
  if(index===0)return `<div class="mp-collectors"><div class="mp-jar">✦<small>蓝星匣</small></div><div class="mp-jar gold">✦<small>金星匣</small></div></div><div class="mp-actions">${[1,64,256].map(n=>button('collect-'+n,`收集 ${n} 颗星`,'class="primary"')).join('')}</div><div class="mp-samples">${[1,64,256].map(n=>s.samples[n]?chart(n,s.samples[n]):`<article class="mp-sample empty">${n} 次 · 等待收集</article>`).join('')}</div>`;
  if(index===1)return `<p>输入按 q0 q1；清单按 c0 c1 从左到右阅读。</p><div class="mp-flow"><span class="mp-source" draggable="true" data-source>${lamp(1,'q0 亮')}<small>可拖动的铜端子</small></span>${arrow}<div class="mp-targets">${[0,1].map(c=>`<button data-map="${c}" class="${s.mapping[0]===c?'selected':''}">接到 c${c}</button>`).join('')}</div></div><div class="mp-flow">${lamp(0,'q1 暗')}${arrow}${ticket('自动接到 c'+s.mapping[1])}</div><p>点击目标箱也能接线；每个箱子只接一根线。</p>${button('print','▶ 打印清单','class="primary"')}<div class="mp-flow">${ticket(s.lastRecord===null?'等待打印':'本次清单 '+s.lastRecord)}</div><div class="mp-records">${['10','01'].map(v=>ticket(`${s.printed.includes(v)?'✓':'○'} ${v} 已观察`)).join('')}</div>`;
  if(index===2)return `<div class="mp-flow">${lamp(0,'H → 测量')}${arrow}${s.gates.map(g=>ticket(g)).join(arrow)}${Array.from({length:2-s.gates.length},(_,j)=>ticket('空槽 '+(s.gates.length+j+1))).join('')}${arrow}${lamp(1,'目标 1')}</div><div class="mp-actions">${button('gate-Reset','① 放 Reset')}${button('gate-X','② 放 X')}${button('undo','↶ 撤销',s.gates.length?'':'disabled')}</div><div class="mp-actions">${[0,1].map(h=>button('history-'+h,`检查历史 ${h}${s.histories.includes(h)?' ✓':''}`,s.gates.length===2?'':'disabled')).join('')}</div><p>装好两步，再检查两种历史。没有指定随机结果，而是分别验证两个分支。</p>${result}`;
  return `<div class="mp-conditions" role="group" aria-label="翻转触发条件">${[['always','总是翻转'],['zero','纸条为 0 时'],['one','纸条为 1 时']].map(([v,t])=>button('condition-'+v,t,`aria-pressed="${s.condition===v}" class="${s.condition===v?'selected':''}"`)).join('')}</div><div class="mp-flow">${ticket('H → 测量')}${arrow}${ticket('读取纸条')}${arrow}${ticket('按条件执行 X')}</div>${button('check','▶ 检查两条路线','class="primary"')}${result}`;
 }
 function dispatch(action){try{state.drafts[index]=measurementAction(state.drafts[index],action);feedback='配置已更新，请运行并观察。';result='';save();render()}catch(e){feedback=e.message;render()}}
 function act(a){
  if(a==='back'){d.close();return}
  if(a==='demo'){demo=1-demo;render();return}
  if(a==='previous'){page=Math.max(0,page-1);render();return}
  if(a==='next'&&page<2){page++;render();return}
  if(['skip','next'].includes(a)){mode='task';render();return}
  if(a==='tutorial'){mode='tutorial';page=0;demo=0;render();return}
  if(a==='reset'){state.drafts[index]=initialMeasurement();feedback='实验已重新准备；已获得的关卡记录保留。';result='';save();render();return}
  if(a.startsWith('answer-')){if(!readyMeasurement(index,state.drafts[index]))return;const ok=+a.slice(7)===correct[index];feedback=ok?'✔ 发现正确！'+notes[index]:'再看看装置：'+notes[index];if(ok){state.measurement[index]=true;save();if(state.measurement.every(Boolean))feedback+=' 四份发现收齐！测量记录晶片已放入背包，去光量子操作室的航行升级槽安装。'}render();const b=body.querySelector(`[data-act="${a}"]`);b?.classList.add(ok?'mp-correct':'mp-wrong');return}
  const s=state.drafts[index];let action;
  if(a.startsWith('collect-'))action={type:'collect',shots:+a.slice(8)};
  if(a==='print')action={type:'print'};
  if(a.startsWith('gate-'))action={type:'gate',gate:a.slice(5)};
  if(a==='undo')action={type:'undo'};
  if(a.startsWith('history-'))action={type:'history',history:+a.slice(8)};
  if(a.startsWith('condition-'))action={type:'condition',condition:a.slice(10)};
  if(a==='check')action={type:'check'};
  if(!action)return;
  try{state.drafts[index]=measurementAction(s,action,()=>crypto.getRandomValues(new Uint32Array(1))[0]/4294967296);result='';
   if(action.type==='history'){const r=resetBranch(action.history,s.gates);result=`<div class="mp-branch">${ticket('过去的纸条 '+r.history)}${r.trace.map(v=>lamp(v)).join(arrow)}<p>${r.final===1?'终点是1，再检查另一条历史。':'终点不是1。先 Reset，再 X，试试看。'}</p></div>`}
   if(action.type==='check')result=[0,1].map(h=>{const r=conditionalBranch(h,s.condition);return `<div class="mp-branch">${ticket('纸条 '+h)}${arrow}${ticket(r.triggered?'触发 X':'跳过 X')}${arrow}${lamp(r.final)}<b>${r.final===0?'✓ 回到0':'还没回到0'}</b></div>`}).join('');
   feedback=readyMeasurement(index,state.drafts[index])?'观察完整了！在下方把发现放进日志。':action.type==='gate'?'再装好下一步，然后检查两条历史。':'结果已更新，继续比较另一种情况。';save();render();
  }catch(e){feedback=e.message;render()}
 }
 function journal(){shell('测量港 · 研究日志',state.measurement.map((done,i)=>`<article class="mp-journal"><h3>${done?'✓':'○'} 03-${i+1} ${measurementNames[i]}</h3><p>${done?notes[i]:'来到对应装置，完成实验后收录发现。'}</p></article>`).join('')+`<p>${state.measurement.every(Boolean)?'测量记录晶片已收进背包，可带到光量子操作室安装。':'四份发现收齐后获得测量记录晶片。'}</p>`)}
 function upgrade(){const owned=state.measurement.every(Boolean),allowed=owned&&basicInstalled();shell('光量子操作室 · 航行升级',`<div class="mp-upgrade"><div class="mp-chip upgrade-item" draggable="${allowed&&!state.recordChipInstalled}" role="img" aria-label="蓝色测量记录晶片"><img src="./assets/items/record-chip.png" alt="" draggable="false"></div><span class="mp-arrow">══▶</span><button id="mpUpgradeSlot" ${allowed&&!state.recordChipInstalled?'':'disabled'}>${state.recordChipInstalled?'✓ 晶片已安装':'安装槽 · 点击或拖入晶片'}</button></div><p>${!owned?'先完成测量港四关，取得晶片。':!basicInstalled()?'晶片已获得。先在本房间的主机上完成基础配件装配。':state.recordChipInstalled?'航行升级已记录，原有教学计算机仍可照常运行。':'将晶片拖入插槽，或直接点击插槽安装。'}</p>${button('chiproom','前往测量港')}<p>这是飞船剧情升级，不是现实光量子计算机的完整物料清单。</p>`);const slot=body.querySelector('#mpUpgradeSlot'),chip=body.querySelector('.mp-chip');chip.ondragstart=e=>e.dataTransfer.setData('text/plain','record-chip');slot.ondragover=e=>{if(allowed)e.preventDefault()};const install=()=>{if(!allowed)return;state.recordChipInstalled=true;save();upgrade()};slot.ondrop=e=>{e.preventDefault();if(e.dataTransfer.getData('text/plain')==='record-chip')install()};slot.onclick=install;body.querySelector('[data-act]').onclick=()=>{d.close();onNavigate('measurement')}}
 return {open,journal,upgrade,get completed(){return state.measurement.filter(Boolean).length},get chipInstalled(){return state.recordChipInstalled},inventory(){return `<article class="journal-card"><h3><img class="inventory-item-art" src="./assets/items/record-chip.png" alt="" draggable="false"> 测量记录晶片</h3><p>${state.measurement.every(Boolean)?state.recordChipInstalled?'已安装到光量子操作室':'已获得 · 带到光量子操作室安装':'在第三章收集四份研究记录后获得'}</p></article>`}};
}
