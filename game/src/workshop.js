import {machines,canInstall,canRun} from './expedition-state.js';

export function partArt(id,extra=''){return `<span class="part-art part-${id} ${extra}" role="img" aria-label="${machines.find(m=>m.id===id)?.part||'量子配件'}"></span>`}
export function workshopMarkup(state,id){
 const m=machines.find(m=>m.id===id),mounted=state.installed.includes(id);
 return `<section class="assembly-room machine-${id} ${mounted?'is-mounted':''} ${state.runs.includes(id)?'is-running':''}"><div class="assembly-caption"><span>SPACEQAT / ENGINEERING BAY</span><h3>${m.part}装配台</h3><p>把下方配件拖进发光插槽，为设备接上能量。</p></div><div class="machine-field"><div class="energy-orbit"></div><div class="machine-socket-base"></div><button id="componentSocket" class="component-socket ${mounted?'mounted':''}" aria-label="装入${m.part}">${partArt(id)}<span>${mounted?'已锁定 · 接口就绪':'＋ '+m.part+'插槽'}</span></button><div class="machine-readout"><i></i><strong id="assemblyReadout">${mounted?'模块已连接':'等待配件接入'}</strong><span>${state.corrected.length===3?'逻辑保护在线':'逻辑保护 '+state.corrected.length+'/3'}</span></div><div class="assembly-steps"><span class="${state.parts.includes(id)?'ready':''}">01 搜寻</span><span class="${state.done[m.task]?'ready':''}">02 激活</span><span class="${mounted?'ready':''}">03 装配</span><span class="${canRun(state,id)?'ready':''}">04 启动</span></div></div><div class="tool-tray"><div class="tray-label"><strong>随身配件箱</strong><small>拖动装配 / 点击配件后点击插槽</small></div><div class="tray-items">${machines.map(part=>`<button class="part-tile ${state.parts.includes(part.id)?'':'missing'}" data-component="${part.id}" ${state.parts.includes(part.id)?'':'disabled'} aria-label="选择${part.part}">${partArt(part.id)}<strong>${part.part}</strong><small>${!state.parts.includes(part.id)?'尚未找到':state.done[part.task]?'已激活':'待激活'}</small></button>`).join('')}</div></div></section><div class="workshop-bottom"><p id="assemblyFeedback" role="status">${mounted?'配件已装好，可重演装配练习。':!state.parts.includes(id)?`先去${m.source==='storage'?'储藏室':'观测室'}寻找${m.part}。`:!state.done[m.task]?`完成 02-${m.task+1}，让配件亮起来。`:'抓住配件，把它送入同形插槽！'}</p><div class="bridge-actions"><button id="rehearseAssembly" ${mounted?'':'hidden'}>↻ 重演装配</button><button id="openCorrection">✦ 逻辑守护训练</button><button id="openProgramming">⌨ FatQat 编程终端</button><button id="runMachine" class="primary" ${canRun(state,id)?'':'disabled'}>⏻ 启动计算机</button></div><p id="machineOutput" role="status">${state.runs.includes(id)?'本机已完成教学运行。':'等待模块与逻辑保护就绪。'}</p><details><summary>认识这台设备</summary><p>${m.description} 这是教学示意装配；本地理想模拟不代表真实硬件。多个物理比特共同编码逻辑信息，纠错训练是本游戏的启动条件。</p></details></div>`;
}

// Pointer events support mouse, pen and touch; buttons also provide a keyboard path.
export function bindAssembly(root,state,id,onInstall){
 const socket=root.querySelector('#componentSocket'),feedback=root.querySelector('#assemblyFeedback');let selected=null,practice=false;
 function attempt(part){
  if(!part){feedback.textContent='先从配件箱选择一个模块，再点击插槽。';return false}
  if(part!==id){feedback.textContent='形状不匹配，这个模块属于另一台设备。试试与插槽相同的配件。';socket.classList.add('wrong');setTimeout(()=>socket.classList.remove('wrong'),500);return false}
  if(!canInstall(state,id)){feedback.textContent='配件还没有激活。先完成它对应的第二章任务。';return false}
  if(state.installed.includes(id)&&!practice){feedback.textContent='已经装好了！可以点击“重演装配”再练习。';return false}
  socket.classList.add('mounted');root.querySelector('.assembly-room').classList.add('is-mounted');root.querySelector('#assemblyReadout').textContent='咔嗒！模块锁定';socket.querySelector('span:last-child').textContent='已锁定 · 接口就绪';feedback.textContent='✦ 装配成功！接口灯已点亮。';practice=false;
  onInstall(id);root.querySelectorAll('.assembly-steps span').forEach((step,i)=>step.classList.toggle('ready',i<3||canRun(state,id)));root.querySelector('#rehearseAssembly').hidden=false;root.querySelector('#runMachine').disabled=!canRun(state,id);return true;
 }
 socket.onclick=()=>attempt(selected);
 root.querySelector('#rehearseAssembly').onclick=()=>{practice=true;socket.classList.remove('mounted');root.querySelector('.assembly-room').classList.remove('is-mounted');socket.querySelector('span:last-child').textContent='＋ 练习插槽';feedback.textContent='装配练习：把相同模块拖回来。已保存的装配进度不受影响。'};
 root.querySelectorAll('[data-component]').forEach(tile=>{
  let start=null,ghost=null,moved=false,suppressClick=false;
  const clear=()=>{ghost?.remove();ghost=null;socket.classList.remove('drop-ready');tile.classList.remove('dragging');start=null};
  tile.onclick=()=>{if(suppressClick){suppressClick=false;return}selected=tile.dataset.component;root.querySelectorAll('[data-component]').forEach(b=>b.classList.toggle('chosen',b===tile));feedback.textContent='已拿起'+machines.find(m=>m.id===selected).part+'。点击插槽装入，也可以拖动。'};
  tile.onpointerdown=e=>{if(e.button!==0||tile.disabled)return;start={x:e.clientX,y:e.clientY};moved=false;suppressClick=false;tile.setPointerCapture(e.pointerId)};
  tile.onpointermove=e=>{if(!start)return;if(!moved&&Math.hypot(e.clientX-start.x,e.clientY-start.y)<7)return;moved=true;
   if(!ghost){ghost=document.createElement('div');ghost.className='component-ghost';ghost.innerHTML=partArt(tile.dataset.component);root.append(ghost);tile.classList.add('dragging')}
   ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';const r=socket.getBoundingClientRect();socket.classList.toggle('drop-ready',e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom);
  };
  tile.onpointerup=e=>{if(!start)return;const r=socket.getBoundingClientRect(),inside=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;const dragged=moved;clear();if(dragged){suppressClick=true;if(inside)attempt(tile.dataset.component);else feedback.textContent='配件回到箱子里了。试着把它拖到发光插槽中央。'}};
  tile.onpointercancel=clear;tile.onlostpointercapture=clear;
 });
}
