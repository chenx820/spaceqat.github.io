import {paintPrologue} from './prologue-cinema.js';
import {OPENING_KEY,openingShots,openingVisual} from './opening-film.js';
import {drawPlayer,chooseAvatar,savedSkin} from './player-avatar.js';
import {mountSearch,itemArt} from './storage-search.js';
import {tours,createRoomGuide} from './room-guides.js';
import {roomAtmosphere} from './room-atmosphere.js';
import {pixelTransition} from './pixel-transition.js';
import {voyageArt,voyageStops,voyageDoorX} from './voyage.js';
import {readIonScene,ionAmbience,ionCaption} from './ion/ambience.js';
import {readPhotonScene,photonAmbience,photonCaption} from './photonic/ambience.js';
import {superconductingAmbience,readSCSceneState} from './superconducting-ambience.js';
import {interactionPoint} from './navigation.js';
import {residents} from './npc-model.js';
import {decorateResident,speakToResident} from './npc.js';
import {createPulse} from './pulse.js';
import {pulseNames} from './pulse-model.js';
import {createFinale} from './finale.js';
import {createHardware} from './hardware.js';
import {hardwareNames} from './hardware-model.js';
import {createCompiler} from './compiler.js';
import {compilerNames} from './routing-model.js';
import {createMeasurement} from './measurement.js';
import {measurementNames} from './measurement-model.js';
import {roomSpeech} from './room-speech.js';
import {neutralAmbience,readNeutralSceneState} from './neutral-ambience.js';
import {qatDialogue} from './qat-dialogue.js';
import {ADVENTURE_KEY,normalizeAdventure,collectItem,activateBeacon} from './adventure-state.js';
import {createExpedition} from './expedition.js';
import {machines} from './expedition-state.js';
import {drawCat} from './cozy-world.js';
import {constrainPosition,movePosition,distance} from './navigation.js';
export function createAdventure({playground,onChapter}){
 let state=normalizeAdventure(),room='entry',moving=false,timer=null,introTimer=null,shot=0,paused=false;
 const expedition=createExpedition({onNavigate:target=>show(target)});
 const measurement=createMeasurement({bridgeComplete:()=>expedition.completed===4,basicInstalled:()=>expedition.isInstalled('photon'),onNavigate:target=>show(target)});
 const compiler=createCompiler({previousComplete:()=>measurement.completed===4,basicInstalled:()=>expedition.isInstalled('ion'),onNavigate:target=>show(target)});
 const hardware=createHardware({previousComplete:()=>compiler.completed===4,basicInstalled:()=>expedition.isInstalled('neutral'),onNavigate:target=>show(target)});
 const pulse=createPulse({previousComplete:()=>hardware.completed===4,basicInstalled:()=>expedition.isInstalled('sc'),onNavigate:target=>show(target)});
 const finale=createFinale({onNavigate:target=>show(target)});
 let photonState=readPhotonScene();let ionState=readIonScene();
 let neutralState=readNeutralSceneState(),scState=readSCSceneState();
 const keys=new Set();let guide=null;const greetedRooms=new Set();let transitioning=false;let escort=null,voyageWelcomed=false;let pos={x:50,y:78},dest=null,near=null,objects=[],lastFrame=0,walkFrame=0,lastDust=0;
 try{state=normalizeAdventure(JSON.parse(localStorage.getItem(ADVENTURE_KEY))||{})}catch{}
 const chapter=document.querySelector('main'),host=document.createElement('main');host.id='adventure';chapter.before(host);chapter.hidden=true;
 host.innerHTML=`<header class="adventure-heading"><div><span class="eyebrow" id="roomCode"></span><h1 id="roomTitle"></h1></div><div class="adventure-tools"><button id="toPlaza">← 中央广场</button><button id="voyageMap">航线图</button><button id="bagButton">背包 · 0</button><button id="introReplay">▷ 序章短片</button></div></header><div class="adventure-scene" id="adventureScene"><div id="sceneArt"></div><div id="sharedAtmosphere"></div><div id="roomObjects"></div><div id="traveller" aria-hidden="true"><kbd class="cat-key" hidden>E</kbd><canvas id="travelCat" width="32" height="28"></canvas></div><div id="roomCaption"></div><button id="nearbyAction" class="nearby-action" hidden></button></div><section class="adventure-talk"><div class="room-portrait"><canvas id="roomQatPortrait" width="40" height="36" aria-label="Qat 头像" role="img"></canvas><b>QAT</b></div><div class="room-dialogue-copy"><p id="adventureText" role="status" aria-live="polite"></p><div class="room-key-guide"><span><kbd>WASD / ↑↓←→</kbd> 移动</span><span><kbd>E</kbd> 交互</span><span><kbd>鼠标点击</kbd> 寻路</span></div></div></section>`;
 const $=id=>document.getElementById(id);drawCat($('travelCat').getContext('2d'),1,1,1);drawCat($('roomQatPortrait').getContext('2d'),6,5,1);host.querySelector('.room-dialogue-copy').append($('roomCaption'));
 const panel=document.createElement('dialog');panel.id='adventurePanel';panel.classList.add('pixel-workshop');panel.innerHTML='<div class="info-shell"><header class="workbench-head"><div><h2 id="adventurePanelTitle"></h2></div><button id="closeAdventurePanel" aria-label="关闭房间互动">✕</button></header><div id="adventurePanelBody"></div></div>';document.body.append(panel);$('closeAdventurePanel').onclick=()=>panel.close();
 function save(){try{localStorage.setItem(ADVENTURE_KEY,JSON.stringify(state))}catch{say('本次可以继续探索，但浏览器未能保存进度。')} $('bagButton').textContent=`背包 · ${state.items.length+expedition.partCount+(measurement.completed===4?1:0)+(compiler.completed===4?1:0)+(hardware.completed===4?1:0)+(pulse.completed===4?1:0)}`}
 function say(t){
  const portrait=$('roomQatPortrait'),ctx=portrait.getContext('2d');
  ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,portrait.width,portrait.height);
  drawCat(ctx,6,5,1);
  roomSpeech($('adventureText'),t);
 }
 function reducedMotion(){return document.body.classList.contains('reduced')||matchMedia('(prefers-reduced-motion: reduce)').matches}
 function popup(title,html){$('adventurePanelTitle').textContent=title;$('adventurePanelBody').innerHTML=html;qatDialogue(panel,'探索每个房间，把新的发现带回广场！');panel.showModal()}
 function searchStorage(zone,targets){popup(zone==='chest'?'旧航海箱 · 逐格翻找':'工具柜 · 搜寻线索','<section id="storageSearch"></section>');mountSearch($('storageSearch'),{zone,targets,onFind:id=>{if(id==='lens'&&collectItem(state,id))save()}})}
 function take(id){const fresh=collectItem(state,id);save();popup(fresh?'发现新道具！':'已经收好了',`<div class="item-reward">${itemArt(id)}</div><h3>${id==='lens'?'星光透镜':'稳态电池'}</h3><p>${id==='lens'?'从储藏室的旧航海箱里找到了透镜。':'你发现了两次翻转会回到起点，观测室送你一枚电池。'}</p><p>已放入背包。回中央广场，点击星图信标，把两件道具一起装上。</p>`)}
 function go(target,x=50,y=65){dest={...constrainPosition(room,x,y),action:target};moving=true;keys.clear()}
 function object(label,x,y,action,kind='door'){const b=document.createElement('button');b.className='room-object '+kind;b.style.left=x+'%';b.style.top=y+'%';b.setAttribute('aria-label',label);b.innerHTML=`<i class="interaction-marker" aria-hidden="true">${kind==='room-exit'?'▼':kind==='machine-station'?'✦':kind==='lesson-point'?'?':kind==='search'?'⌕':kind==='station'?'✦':kind==='beacon'?'!':kind==='airlock'?'▲':'◀'}</i><span class="interaction-label"><kbd>E</kbd> ${label}</span>`;const point=interactionPoint(room,x,y,kind);objects.push({...point,action,label,button:b});if(typeof action==='string')b.classList.add('scene-door');b.onclick=()=>{guide?.interruptMovement();const current=objects.find(o=>o.button===b)||point;go(action,current.x,current.y)};$('roomObjects').append(b);return b}
 function show(next){if(guide)guide.cancel();$('guideReplay')?.remove();$('sharedAtmosphere').innerHTML=roomAtmosphere(next);escort=null;clearTimeout(timer);moving=false;dest=null;near=null;keys.clear();objects=[];pos={x:50,y:83};$('nearbyAction').hidden=true;room=next;host.hidden=next==='chapter';chapter.hidden=next!=='chapter';$('returnPlaza').hidden=next!=='chapter';if(next==='chapter'){onChapter();return}host.focus();$('traveller').style.left='50%';$('traveller').style.top='83%';$('roomObjects').innerHTML='';$('adventureScene').className='adventure-scene room-'+next;$('sceneArt').innerHTML=next==='ops-neutral'?neutralAmbience(neutralState):next==='ops-sc'?superconductingAmbience(scState):next==='ops-photon'?photonAmbience(photonState):next==='ops-ion'?ionAmbience(ionState):'';$('toPlaza').hidden=next==='entry'||next==='plaza';$('roomCaption').textContent='';save();
 const titles={pulse:['CHAPTER 06 · PULSE','脉冲核心'],hardware:['CHAPTER 05 · HARDWARE','硬件调度台'],compiler:['CHAPTER 04 · COMPILATION','编译工坊'],measurement:['CHAPTER 03 · MEASUREMENT','测量港'],voyage:['VOYAGE · CHAPTERS','航线廊'],entry:['PROLOGUE · ARRIVAL','欢迎登上 SpaceQat'],plaza:['SPACEQAT · CENTRAL PLAZA','星光中央广场'],playroom:['PROLOGUE · QUANTUM PLAYGROUND','量子游乐场'],storage:['EXPLORATION · STORAGE','星际储藏室'],observatory:['EXPLORATION · OBSERVATORY','星窗观测室'],bridge:['CHAPTER 02 · ENTANGLEMENT','纠缠桥'],deck:['HARDWARE DECK · OPERATIONS','量子操作甲板'],...Object.fromEntries(machines.map(m=>['ops-'+m.id,['QUANTUM COMPUTER · '+m.id.toUpperCase(),m.name]]))};$('roomCode').textContent=titles[next][0];$('roomTitle').textContent=titles[next][1];
 if(next==='entry'){$('sceneArt').innerHTML=ship();object('进入飞船 →',50,59,'plaza','airlock');say('我是 Qat，你的新伙伴！欢迎来到星海中的探索学校。按 W 或 ↑ 沿舷梯走向舱门，靠近后按 E 登船。也可以点击舱门。');$('roomCaption').textContent='靠港完成 · 等待小小探索员登船'}
 if(next==='plaza'){$('adventureScene').classList.toggle('beacon-lit',state.beacon);object('✦ 量子游乐场',18,31,'playroom');object('01 态制备舱',39,31,'chapter');object('⌕ 星际储藏室',61,31,'storage');object('☽ 星窗观测室',82,31,'observatory');object(state.beacon?'✧ 星图已点亮':'✧ 修复星图信标',50,72,beacon,'beacon');object('02 纠缠桥',89,76,'bridge','tech-portal');object('量子操作甲板',11,76,'deck','tech-portal');say(state.beacon?'星图点亮了！你完成了第一次跨房间探索。可以去游乐场自由玩，或进入态制备舱挑战量子线路。':'先去左边的游乐场玩一会儿吧！广场的星图信标缺少两件零件：储藏室的透镜、观测室的电池。');$('roomCaption').textContent=state.beacon?'序章任务完成 · 星图信标在线':'可选探索任务 · 收集两件零件，点亮星图'}
 if(next==='plaza')object('航线廊 · 后续章节',89,55,'voyage','tech-portal');
 if(next==='voyage'){
 $('sceneArt').innerHTML=voyageArt();
 voyageStops.forEach(([name,target],i)=>{const door=object('进入：'+name,voyageDoorX[i],31,target,'station');door.classList.add('voyage-door')});
 object('航程菜单 · 章节进度',12,68,()=>{popup('航程任务与科学星图','<p>门口可以步行抵达。各章实验仍按原有进度解锁。</p><div class="voyage-menu">'+voyageStops.map(([name,id,fact],i)=>'<article><h3>'+name+'</h3><p>'+fact+'</p><p>已完成 '+[measurement,compiler,hardware,pulse][i].completed+' / 4</p><button data-voyage-room="'+id+'">前往房间</button></article>').join('')+'</div>');panel.querySelectorAll('[data-voyage-room]').forEach(b=>b.onclick=()=>{panel.close();show(b.dataset.voyageRoom)})},'lesson-point');
 say('欢迎来到星图航线廊。沿铜色门槛走近四座舱门，按 E 进入；左侧终端查看航程，右侧终端检查起航清单。');
 }

 if(next==='measurement'){$('sceneArt').innerHTML=campaignAmbience(next);measurementNames.forEach((name,i)=>object('03-'+(i+1)+' '+name,20+i*20,43,()=>measurement.open(i),'station'));object('研究日志',94,61,()=>measurement.journal(),'lesson-point');object('返回航线廊',8,51,'voyage','tech-portal');say('星星会落入记录箱，纸条还可以控制下一步动作。每台装置都有自己的小实验，按顺序探索吧！');$('roomCaption').textContent='第三章完成 '+measurement.completed+' / 4';}
 if(next==='compiler'){$('sceneArt').innerHTML=campaignAmbience(next);compilerNames.forEach((name,i)=>object('04-'+(i+1)+' '+name,20+i*20,43,()=>compiler.open(i),'station'));object('研究日志',94,61,()=>compiler.journal(),'lesson-point');object('返回航线廊',8,51,'voyage','tech-portal');say('这里的乘客叫 q，车站叫 P。翻译开关、安排座位、交换车厢，再为任务排好时间。');$('roomCaption').textContent='第四章完成 '+compiler.completed+' / 4';}
 if(next==='hardware'){$('sceneArt').innerHTML=campaignAmbience(next);hardwareNames.forEach((name,i)=>object('05-'+(i+1)+' '+name,20+i*20,43,()=>hardware.open(i),'station'));object('研究日志',94,61,()=>hardware.journal(),'lesson-point');object('返回航线廊',8,51,'voyage','tech-portal');say('先看看硬件有没有连接、座位有没有原子。空座位和暗着的原子是两回事，每台装置会带你亲手比较。');$('roomCaption').textContent='第五章完成 '+hardware.completed+' / 4';}
 if(next==='pulse'){$('sceneArt').innerHTML=campaignAmbience(next);pulseNames.forEach((name,i)=>object('06-'+(i+1)+' '+name,20+i*20,43,()=>pulse.open(i),'station'));object('研究日志',94,61,()=>pulse.journal(),'lesson-point');object('返回航线廊',8,51,'voyage','tech-portal');say('比较理想与现实，看看等待、泄漏和迭代如何改变结果。每个实验都可以先看教程。');$('roomCaption').textContent='第六章完成 '+pulse.completed+' / 4';}
 if(next==='voyage')object('航行总日志 · 起航',88,68,()=>finale.open(),'beacon');
 if(next==='ops-sc')object('航行升级 · 稳相控制环',80,57,()=>pulse.upgrade(),'lesson-point');
 if(next==='ops-neutral')object('航行升级 · 阵列定位晶体',80,57,()=>hardware.upgrade(),'lesson-point');
 if(next==='ops-ion')object('航行升级 · 路由时刻盘',80,57,()=>compiler.upgrade(),'lesson-point');
 if(next==='ops-photon')object('航行升级 · 记录晶片',80,57,()=>measurement.upgrade(),'lesson-point');
 if(next==='playroom'){object('☀ 翻转小灯',25,44,()=>playground.show(0),'station');object('★ 星星收集瓶',50,44,()=>playground.show(1),'station');object('◉ 概率调色盘',75,44,()=>playground.show(2),'station');say('这里没有考试！走到想玩的装置旁按 E，或点击装置自动走过去。每台装置都有自己的小游戏；关闭后回到房间，再去探索下一台！');$('roomCaption').textContent='自由探索 · 不需要公式 · 没有倒计时'}
 if(['pulse','hardware','compiler','measurement','voyage','playroom','storage','observatory','bridge','deck',...machines.map(m=>'ops-'+m.id)].includes(next)){object('↓ 出口 · 返回广场',50,86,'plaza','room-exit');pos={x:50,y:74};$('traveller').style.top='74%'}
 if(next==='storage'){object('零件货架 · 搜寻配件',50,45,()=>expedition.parts('storage'),'search');$('sceneArt').innerHTML=interior('storage');object('搜寻旧航海箱',21,43,()=>searchStorage('chest',['lens']),'search');object('翻翻工具柜',71,40,()=>searchStorage('cabinet',['note']),'search');say('用眼睛找线索，再点击物品搜寻。旧航海箱里也许有能修复信标的东西。')}
 if(next==='observatory'){object('光学配件台 · 搜寻配件',78,43,()=>expedition.parts('observatory'),'search');$('sceneArt').innerHTML=interior('observatory');object('操作翻转装置',50,43,quiz,'search');say('观察比猜答案更有用。试着翻转小灯，再回答一个小问题，就能带走稳态电池。')}
 if(next==='bridge'){['双轨开关','贝尔桥','相同的表象','相位暗门'].forEach((name,i)=>object('02-'+(i+1)+' '+name,20+i*20,40,()=>expedition.lesson(i),'station'));object('逻辑比特 · 纠错训练',88,75,()=>expedition.correction(),'tech-portal');say('先认识两比特怎样一起变化，再比较不同方向的测量。四个实验会激活四种配件。右侧还有逻辑比特纠错训练。');$('roomCaption').textContent='第二章完成 '+expedition.completed+' / 4 · 位串顺序 q0 q1'}
 if(next==='deck'){machines.forEach((m,i)=>{const door=object(m.name,[21.5,39.5,60.5,78.5][i],28,'ops-'+m.id);door.dataset.machine=m.id;door.classList.add('deck-lab-door');door.querySelector('.interaction-marker').textContent=['❄','▦','⊕','◇'][i];});say('四种硬件，四间操作室。去储藏室和观测室搜寻配件，在纠缠桥完成激活任务，装配后接受纠错训练。');$('roomCaption').textContent='教学计算机已启动 '+expedition.running+' / 4'}
 if(next==='ops-neutral')object('认识光镊与逻辑比特',23,57,()=>popup('光镊小课堂','<p>光镊像一只看不见的小手，用聚焦光束把原子固定在各自的位置上。</p><p>多个物理比特共同编码逻辑信息。完成纠错训练，才能为机器接上逻辑保护。</p>'),'lesson-point');
 const machine=machines.find(m=>'ops-'+m.id===next);if(machine){object(machine.id==='ion'?'点亮两颗离子星 · 双星保罗阱':machine.id==='photon'?'织光成网 · 星光织网台':'检修与启动 · '+machine.part,50,43,()=>expedition.operation(machine.id),'machine-station');object('← 返回操作甲板',next==='ops-neutral'?10:16,next==='ops-neutral'?67:76,'deck','tech-portal');say(machine.description+' 点击机器查看缺少的配件与任务。');$('roomCaption').textContent='物理比特共同编码逻辑信息 · 教学场景'}
 if(residents[next]){const npc=object('与 '+residents[next].name+' 对话',next==='entry'?58:34,next==='entry'?76:69,()=>speakToResident(next),'npc');decorateResident(npc,next);if(next==='voyage'&&!voyageWelcomed){escort={object:objects[objects.length-1],wait:0,arrived:false};}}
 refreshNeutralScene();refreshSCScene();refreshPhotonScene();refreshIonScene();
 if(tours[next]){const replay=document.createElement('button');replay.id='guideReplay';replay.textContent='NPC 带我参观';host.querySelector('.adventure-tools').append(replay);const start=()=>{if(guide)guide.cancel();keys.clear();dest=null;const npc=objects.find(o=>o.button.classList.contains('resident'));if(!npc)return;guide=createRoomGuide({host,room:next,npc,getPlayer:()=>pos,walk:go,cancelWalk:()=>{dest=null;keys.clear()},onGreet:()=>greetedRooms.add(next),onFinish:()=>{guide=null},reduced:reducedMotion})};replay.onclick=start;if(!greetedRooms.has(next))start();}

 }
 function refreshIonScene(){if(room!=='ops-ion')return;$('sceneArt').innerHTML=ionAmbience(ionState);$('roomCaption').textContent=ionCaption(ionState)}
 document.addEventListener('ionprogress',()=>{ionState=readIonScene();refreshIonScene()});window.addEventListener('storage',()=>{ionState=readIonScene();refreshIonScene()});
 function refreshPhotonScene(){if(room!=='ops-photon')return;$('sceneArt').innerHTML=photonAmbience(photonState);$('roomCaption').textContent=photonCaption(photonState);}
 document.addEventListener('photonicprogress',()=>{photonState=readPhotonScene();refreshPhotonScene()});
 window.addEventListener('storage',()=>{photonState=readPhotonScene();refreshPhotonScene()});
 function refreshSCScene(){if(room!=='ops-sc')return;$('sceneArt').innerHTML=superconductingAmbience(scState);$('roomCaption').textContent=scState.coolingStep===5?'超导工坊 · 示例20 mK · '+(scState.questEverCompleted?'已完成20次测量':'等待微波校准'):'超导工坊 · 搜寻 / 装配 / 接线 / 降温 / 测量';}
 document.addEventListener('scprogress',e=>{scState=e.detail;refreshSCScene()});
 window.addEventListener('storage',()=>{scState=readSCSceneState();refreshSCScene()});
 function refreshNeutralScene(){if(room!=='ops-neutral')return;$('sceneArt').innerHTML=neutralAmbience(neutralState);$('roomCaption').textContent=neutralState.completed?'光镊阵列运行中 · 5 个光阱 / 3 个原子 · 主线启动另行检查':'光镊阵列待启动 · 前往中央工作台完成装配与捕获';}
 document.addEventListener('tweezerprogress',e=>{neutralState=e.detail;refreshNeutralScene()});
 window.addEventListener('storage',()=>{neutralState=readNeutralSceneState();refreshNeutralScene()});
 function beacon(){if(state.beacon)return popup('星图信标已点亮','<div class="item-reward">✧</div><p>来自不同房间的两件道具一起工作，飞船恢复了导航。这是你的第一份探索记录！</p>');popup('修复星图信标',`<p>需要把两件来自不同房间的零件装上：</p><ul><li>${state.items.includes('lens')?'✓':'○'} 星光透镜 · 在储藏室搜寻</li><li>${state.items.includes('cell')?'✓':'○'} 稳态电池 · 在观测室完成互动</li></ul><button id="installParts" class="primary" ${state.items.length<2?'disabled':''}>安装零件，点亮星图</button>`);$('installParts').onclick=()=>{if(activateBeacon(state)){save();panel.close();show('plaza');popup('航线恢复！','<div class="item-reward">✧</div><h3>小小探索员，做得好。</h3><p>你在储藏室搜寻、在观测室做实验，最后把线索带回广场。星图现在亮起来了！</p><p>两件道具保留在背包，标记为已装配。</p>')}}}
 function quiz(){let n=0;popup('给电池充能',`<p>小灯开始是关着的。先亲手试两次，再回答。</p><div id="questLamp" class="little-lamp">☾ 关着</div><button id="questFlip">翻转小灯</button><p id="questCount" role="status">已翻转 0 次</p><h3>从关灯开始，翻转两次后？</h3><button id="answerOff" disabled>又关上了</button> <button id="answerOn" disabled>仍然亮着</button><p id="questHint" role="status"></p>`);$('questFlip').onclick=()=>{n++;$('questLamp').textContent=n%2?'☀ 亮着':'☾ 关着';$('questLamp').classList.toggle('lit',!!(n%2));$('questCount').textContent=`已翻转 ${n} 次`;if(n>=2){$('answerOff').disabled=false;$('answerOn').disabled=false}};$('answerOn').onclick=()=>{$('questHint').textContent='再观察一下：关 → 亮 → 关。两次翻转会回到起点。可以再试，不扣分。'};$('answerOff').onclick=()=>{panel.close();take('cell')}}
 $('voyageMap').onclick=()=>{popup('飞船航线图','<p>选择房间可直接抵达；也可以关闭地图继续步行探索。</p><div class="bridge-actions">'+[['plaza','中央广场'],['playroom','序章 量子游乐场'],['chapter','01 态制备舱'],['storage','星际储藏室'],['observatory','星窗观测室'],['deck','量子操作甲板'],['bridge','02 纠缠桥'],['voyage','航线廊'],['measurement','03 测量港'],['compiler','04 编译工坊'],['hardware','05 硬件调度台'],['pulse','06 脉冲核心'],['ops-sc','超导操作室'],['ops-neutral','中性原子操作室'],['ops-ion','离子阱操作室'],['ops-photon','光量子操作室']].map(([id,label])=>'<button data-room="'+id+'">'+label+'</button>').join('')+'</div>');panel.querySelectorAll('[data-room]').forEach(b=>b.onclick=()=>{panel.close();show(b.dataset.room)})};
 $('bagButton').onclick=()=>popup('探索背包',(state.items.length?state.items.map(id=>`<article class="journal-card">${itemArt(id)}<h3>${id==='lens'?'◈ 星光透镜':'▣ 稳态电池'}</h3><p>${state.beacon?'已装配到信标':'等待装配'}</p></article>`).join(''):'<p>序章背包为空。</p>')+'<h3>量子计算机配件</h3>'+expedition.inventory()+measurement.inventory()+compiler.inventory()+hardware.inventory()+pulse.inventory());$('toPlaza').onclick=()=>show('plaza');
 const back=document.createElement('button');back.id='returnPlaza';back.textContent='← 返回中央广场';back.hidden=true;back.onclick=()=>show('plaza');document.querySelector('.topbar nav').prepend(back);
 const intro=document.createElement('dialog');intro.id='introFilm';intro.setAttribute('aria-label','序章动画：最后一盏灯');intro.innerHTML=`<div class="film-space"><div class="film-heading">SPACEQAT <span>序章 · 最后一盏灯</span></div><div id="cinemaVisual" class="cinema-visual"></div><div class="film-subtitle"><span id="filmCount"></span><h2 id="filmTitle"></h2><p id="filmText" aria-live="polite"></p></div></div><footer><button id="pauseFilm">暂停</button><button id="nextShot">下一幕</button><button id="skipFilm">跳过短片，继续登船</button></footer>`;document.body.append(intro);
 const shots=openingShots;
 function endFilm(){clearTimeout(introTimer);intro.close();state.introSeen=true;try{localStorage.setItem(OPENING_KEY,'seen')}catch{}save();show('entry');if(!savedSkin())chooseAvatar(drawCat,()=>{},true)}
 function renderShot(){clearTimeout(introTimer);intro.dataset.shot=shot;const visual=$('cinemaVisual');if(visual.dataset.frame!==String(shot)){visual.dataset.frame=String(shot);paintPrologue(visual,shot)}$('filmCount').textContent=`${shot+1} / ${shots.length}`;$('filmTitle').textContent=shots[shot].title;$('filmText').textContent=shots[shot].text;$('nextShot').textContent=shot===shots.length-1?'去登船 →':'下一幕';if(!paused)introTimer=setTimeout(advance,shots[shot].duration)}
 function advance(){if(shot<shots.length-1){shot++;renderShot()}else endFilm()}
 function film(){shot=0;delete $('cinemaVisual').dataset.frame;paused=document.body.classList.contains('reduced')||matchMedia('(prefers-reduced-motion: reduce)').matches;intro.classList.toggle('film-paused',paused);$('pauseFilm').textContent=paused?'继续播放':'暂停';intro.showModal();renderShot()}
 $('pauseFilm').onclick=()=>{paused=!paused;$('pauseFilm').textContent=paused?'继续播放':'暂停';intro.classList.toggle('film-paused',paused);renderShot()};$('nextShot').onclick=advance;$('skipFilm').onclick=endFilm;intro.addEventListener('cancel',e=>{e.preventDefault();endFilm()});$('introReplay').onclick=film;document.addEventListener('visibilitychange',()=>{if(document.hidden&&intro.open){paused=true;intro.classList.add('film-paused');$('pauseFilm').textContent='继续播放';clearTimeout(introTimer)}});
 document.addEventListener('campaignprogress',()=>{save();if(room==='measurement')$('roomCaption').textContent='第三章完成 '+measurement.completed+' / 4';if(room==='compiler')$('roomCaption').textContent='第四章完成 '+compiler.completed+' / 4';if(room==='pulse')$('roomCaption').textContent='第六章完成 '+pulse.completed+' / 4';if(room==='hardware')$('roomCaption').textContent='第五章完成 '+hardware.completed+' / 4'});
 document.addEventListener('expeditionprogress',()=>{save();if(room==='bridge')$('roomCaption').textContent='第二章完成 '+expedition.completed+' / 4 · 位串顺序 q0 q1';if(room==='deck')$('roomCaption').textContent='教学计算机已启动 '+expedition.running+' / 4'});
 function blocked(){return transitioning||room==='chapter'||document.hidden||!!document.querySelector('dialog[open]')}
 function interact(action){keys.clear();dest=null;moving=false;near=null;$('nearbyAction').hidden=true;if(typeof action==='string'){transitioning=true;pixelTransition(()=>show(action),reducedMotion()).finally(()=>{transitioning=false})}else typeof action==='function'?action():show(action)}
 $('nearbyAction').onclick=()=>{if(near&&!blocked())interact(near.action)};
 window.addEventListener('keydown',e=>{if(blocked()||e.ctrlKey||e.metaKey||e.altKey)return;if(e.target.matches('input,select,textarea'))return;const k=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright'].includes(k)){e.preventDefault();guide?.interruptMovement();keys.add(k);dest=null}else if(k==='e'&&!e.repeat&&near){e.preventDefault();if(guide)guide.cancel();interact(near.action)}});
 window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{keys.clear();dest=null});document.addEventListener('visibilitychange',()=>{keys.clear();dest=null});
 function tick(now){const dt=Math.min((now-lastFrame)/1000,.04);lastFrame=now;if(blocked()){keys.clear();dest=null;$('traveller').classList.remove('walking');$('traveller').querySelector('.cat-key').hidden=true;$('nearbyAction').hidden=true}else{
 let dx=+(keys.has('d')||keys.has('arrowright'))-+(keys.has('a')||keys.has('arrowleft')),dy=+(keys.has('s')||keys.has('arrowdown'))-+(keys.has('w')||keys.has('arrowup'));
 if(dest){dx=dest.x-pos.x;dy=(dest.y-pos.y)*9/16;if(distance(pos,dest)<Math.max(.5,18*dt)){pos={x:dest.x,y:dest.y};const action=dest.action;dest=null;interact(action);dx=dy=0}}
 moving=!!(dx||dy);$('traveller').classList.toggle('walking',moving);if(dx||dy){pos=movePosition(room,pos,dx,dy,dt);walkFrame+=dt*9}
 $('traveller').style.left=pos.x+'%';$('traveller').style.top=pos.y+'%';
 const cat=$('travelCat').getContext('2d');cat.clearRect(0,0,32,28);const frame=reducedMotion()?0:moving?Math.floor(walkFrame):Math.floor(now/400);drawPlayer(cat,1,1,1,frame,!reducedMotion()&&!moving&&now%4800<120,drawCat);if(moving&&!reducedMotion()&&now-lastDust>110){lastDust=now;const dust=document.createElement('i');dust.className='walk-dust';dust.style.left=pos.x+'%';dust.style.top=pos.y+'%';$('adventureScene').append(dust);setTimeout(()=>dust.remove(),300)}
 if(escort&&room==='voyage'&&!escort.arrived){
 escort.wait+=dt;
 if(escort.wait>1.5&&!moving){const o=escort.object;const target=constrainPosition(room,pos.x-6,pos.y);const d=distance(o,target);
 if(d>.6){const step=Math.min(1,8*dt/d);o.x+=(target.x-o.x)*step;o.y+=(target.y-o.y)*step;if(!reducedMotion()&&now-(escort.dustAt||0)>150){escort.dustAt=now;const dust=document.createElement('i');dust.className='walk-dust';dust.style.left=o.x+'%';dust.style.top=o.y+'%';$('adventureScene').append(dust);setTimeout(()=>dust.remove(),300)}o.button.style.left=o.x+'%';o.button.style.top=(o.y-4)+'%';o.button.onclick=()=>go(o.action,o.x,o.y);}
 else{escort.arrived=true;voyageWelcomed=true;say('Rui：欢迎！一次测量像抽到一张结果卡，很多次记录才能看清概率。左侧航程菜单有四章的小提示；想了解起航准备，可以走近我按 E。');}
 }
 }
 if(guide)guide.tick(dt,moving);
 near=objects.filter(o=>distance(pos,o)<7).sort((a,b)=>distance(pos,a)-distance(pos,b))[0]||null;
 objects.forEach(o=>o.button.classList.toggle('near',o===near));$('traveller').querySelector('.cat-key').hidden=!near||blocked();$('nearbyAction').hidden=true;if(near)$('nearbyAction').textContent='E · '+near.label;
 }requestAnimationFrame(tick)}requestAnimationFrame(tick);
 const wardrobe=document.createElement('button');wardrobe.textContent='探索员换装';wardrobe.id='avatarWardrobe';document.querySelector('.topbar nav').append(wardrobe);wardrobe.onclick=()=>chooseAvatar(drawCat);show('entry');const begin=()=>{let seen=false;try{seen=localStorage.getItem(OPENING_KEY)==='seen'}catch{}if(!seen)film();else if(!savedSkin())chooseAvatar(drawCat,()=>{},true)};begin();return {get active(){return room!=='chapter'||intro.open||panel.open},show};
}
function ship(){return `<svg class="ship-art" viewBox="0 0 1200 650" aria-hidden="true"><defs><radialGradient id="spaceGlow"><stop stop-color="#334d69"/><stop offset="1" stop-color="#0d1a30"/></radialGradient></defs><path fill="url(#spaceGlow)" d="M0 0h1200v650H0z"/>${Array.from({length:95},(_,i)=>`<rect x="${(i*173+19)%1200}" y="${(i*83+29)%650}" width="${i%3+1}" height="${i%3+1}" fill="#e9dbab" opacity="${.3+(i%5)*.12}"/>`).join('')}<circle cx="1010" cy="180" r="108" fill="#7fafa7"/><path d="M930 150q130-90 165 15M920 196q130-65 180 0" fill="none" stroke="#c6cf9f" stroke-width="25"/><g class="ship-body"><path d="M220 330 340 235 850 235 990 330 900 475 310 475Z" fill="#567377" stroke="#273e4d" stroke-width="16"/><path d="M335 260H850L942 330 870 434H333L264 330Z" fill="#e0d6b5" stroke="#b19e75" stroke-width="7"/><path d="M390 207H797L850 263H337Z" fill="#aabcb0"/><path d="M352 300h140v65H352zM708 300h140v65H708z" fill="#3e6671" stroke="#a18c61" stroke-width="8"/><path d="M370 312h100M726 312h100" stroke="#8ec5bc" stroke-width="5"/><path d="M528 289H670V453H528Z" fill="#344f53" stroke="#ae8953" stroke-width="12"/><path d="M545 304H653V450H545Z" fill="#eedfa8"/><path d="M554 317H644V449H554Z" fill="#a2cab3"/><path d="M532 450H665L765 650H430Z" fill="#8a9c92" stroke="#c7bc91" stroke-width="6"/><path d="M567 475 530 640M630 475 671 640" stroke="#f2df9e" stroke-width="6"/><rect x="296" y="382" width="50" height="24" fill="#c5dba1"/><rect x="852" y="382" width="50" height="24" fill="#c5dba1"/></g></svg>`}
function interior(type){return `<div class="small-room"><div class="space-window">✦　　·　　☽　　·　✦</div>${type==='storage'?'<div class="cargo-crate">✧<br>航海箱</div><div class="cargo-shelf">▥ ▤ ▥<br>▧ ▣ ▧<br>工具柜</div>':'<div class="observatory-scope">◉<span>╲</span></div><div class="observatory-desk">☀　↔　☾</div>'}<div class="room-rug">✧</div></div>`}

function campaignAmbience(room){const colors={measurement:'#4deeea',compiler:'#ffd84d',hardware:'#99e550',pulse:'#b99aff'};return '<div class="campaign-ambience" aria-hidden="true" style="--room-spark:'+colors[room]+'">'+[20,40,60,80].map((x,i)=>'<i class="instrument-spark" style="left:'+x+'%;top:35%;animation-delay:-'+i*.6+'s"></i>').join('')+'</div>';}




