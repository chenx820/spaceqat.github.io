import {guideSketch} from './guide-sketch.js';
import {residents,npcClue,readNpcContext} from './npc-model.js';
import {constrainPosition,distance} from './navigation.js';
export const tours={
 plaza:['我是舰长 Dr. Liang，欢迎来到中央广场！来，我带你看看飞船的探索路线。','左边的游乐场可以先玩翻灯和收星星。准备好了，再去态制备舱试着用量子门改变状态。不用急着做难题，每台装置都有教程。','星图信标需要跨房间寻找的两件道具。我们看看现在先去哪一间。'],
 playroom:['我是 Nora！跟我看看三台玩具，喜欢哪台就先玩哪台，没有考试。','左边翻小灯，中间收星星，右边调概率。每台都要走到自己的位置打开。概率说的是重复很多次时的规律，不是下一次一定发生什么。','先试试左边的小灯：翻一次变亮，再翻一次会怎样？玩完可以步行回广场。'],
 storage:['我是 Owen，欢迎来到我的器材库！跟我看看箱柜，里面可能藏着宝贝，也可能是大家落下的小东西。','左侧旧航海箱可以逐格搜索，中央货架放着实验配件。搜到旧眼镜也别灰心，继续找；找到配件后，还要完成相应实验才能激活它。','我来看看你现在最需要哪条线索。'],
 chapter:['我是 Dr. Lin！来，跟我看看态制备舱的四台终端。我们从一盏小灯开始。','X 门交换 0 和 1，H 门可以把 0 准备成测量时两种结果各半的状态。布洛赫球是状态地图，不是小粒子的真实位置。','先预测，再搭线路、运行和比较结果。让我看看你下一台该尝试哪个实验。'],
 bridge:['我是 Dr. Wilson！跟我看看双轨实验台，两颗星星之间的关系值得一起研究。','先试双轨开关，再用一个 H 和一个 CX 准备贝尔态。普通方向测量会得到 00 或 11，但仅凭同色还不能证明纠缠，还要换观察方向比较。','按顺序探索四台装置，右侧还有逻辑守护训练。我给你一条当前任务线索。'],
 deck:['我是 Ada，负责四间操作室。来看看这些不同的舱门！','超导用小电路，中性原子用原子，离子阱用带电离子，光量子用光子。它们是不同的硬件路线，不是四个必须依次通过的难度等级。','选择感兴趣的操作室，研究员会介绍设备。找到零件、完成装配和实验验证后，再看看主线逻辑保护还需要什么。'],
 'ops-sc':['来，我带你到量子计算机前。它的大金色外壳里，藏着需要特别安静、特别冷的小芯片。','这台金色大机器像一座分层的超级冰箱，真正计算的是里面的小电路。我们把热带走，减少热噪声对量子比特的干扰。','本关的最低温区示例是 20 mK，非常接近绝对零度，但没有到达绝对零度。超导材料在足够低温下可以没有电阻；芯片还需要更低温来减少热激发。','微波信号像仔细编排的指令，控制小电路的量子状态；读出装置把测量变成记录。现在可以点中央机器，自己找零件、接线、降温和校准！'],
 'ops-neutral':['欢迎！跟我到光镊台前，看看怎样给原子安排座位。','聚焦的激光可以形成光阱，像给原子准备的小座位。光阱不是一只真的手，有座位也不一定有原子。','相机会记录原子的荧光。先搭好光路再捕获，观察五个光阱里究竟坐了几个原子。'],
 'ops-ion':['跟我来，看看两颗带电的小伙伴怎样待在机器里。','离子带电，电场可以把它们束缚在小区域里。激光帮助它们冷却，也用来控制和读取量子状态。','亮点是教学画法。先把零件和线缆接好，再一步步冷却、补偿和测量，不能只看到两颗亮星就认为实验成功。'],
 'ops-photon':['欢迎来到织光工坊！跟我看光路和探测器。','光子可以携带量子信息。这里先准备相互关联的光子，再按安排测量它们。','测量会留下普通的记录。有些后续操作要看前面的记录再决定，这叫经典前馈。光路搭好后，还要验证计算结果。'],
 observatory:['一起到观测台看看吧！科学家不仅观察，还要记下结果。','一次测量只得到一个结果。准备同样的状态、重复很多次，才能比较结果出现的频率。','就像记录许多次抽卡，次数少时比例可能差很多。这里可以先试试把小灯翻转两次。']
};
export const guideStops={
 plaza:[[18,47,'量子游乐场'],[50,80,'星图']],
 playroom:[[25,60,'翻转小灯'],[25,60,'翻转小灯']],
 storage:[[21,56,'搜寻旧航海箱'],[50,56,'零件货架']],
 chapter:[[157/6.4,195/3.6,'设备 1'],[268/6.4,195/3.6,'设备 2']],
 observatory:[[50,56,'操作翻转装置'],[50,56,'操作翻转装置']],
 bridge:[[20,56,'02-1'],[88,83,'纠错训练']],
 deck:[[21.5,47,'超导量子操作室'],[39.5,47,'中性原子操作室']],
 'ops-sc':[[50,60,'检修与启动'],[50,60,'检修与启动'],[50,60,'检修与启动']],
 'ops-neutral':[[50,60,'检修与启动'],[50,60,'检修与启动']],
 'ops-ion':[[50,60,'点亮两颗离子星'],[50,60,'点亮两颗离子星']],
 'ops-photon':[[50,60,'织光成网'],[50,60,'织光成网']]
};
export function guideDestination(room,page=1){const stops=guideStops[room],stop=stops?.[Math.min(Math.max(page-1,0),stops.length-1)]||[50,60,''];const [x,y,label]=stop;const clamp=(x,y)=>room==='chapter'?{x:Math.max(88/6.4,Math.min(546/6.4,x)),y:Math.max(193/3.6,Math.min(326/3.6,y))}:constrainPosition(room,x,y);return {npc:clamp(x+(x<20?8:-8),y),player:clamp(x,y),label}}
export function createRoomGuide({host,room,npc,getPlayer,walk,cancelWalk,onFinish,onGreet=()=>{},reduced}){
 let phase='approach',elapsed=0,page=0,dustAt=0,targetPage=1;
 const ui=document.createElement('section');ui.className='room-guide';ui.setAttribute('aria-label','NPC 科普导览');ui.hidden=true;const scene=host.querySelector('.adventure-scene, .scene-wrap');scene.append(ui);
 const updateNpc=(target,dt)=>{const d=distance(npc,target);if(d<.5)return true;const t=Math.min(1,9*dt/d);npc.x+=(target.x-npc.x)*t;npc.y+=(target.y-npc.y)*t;npc.button.style.left=npc.x+'%';npc.button.style.top=(npc.y-(room==='chapter'?0:4))+'%';npc.button.classList.add('guide-walking');
 if(!reduced()&&elapsed-dustAt>.15){dustAt=elapsed;const dust=document.createElement('i');dust.className='walk-dust';dust.style.left=npc.x+'%';dust.style.top=npc.y+'%';npc.button.parentElement.append(dust);setTimeout(()=>dust.remove(),300)}return false};
 function clearTarget(){scene.querySelectorAll?.('.guide-target').forEach(b=>b.classList.remove('guide-target'))}
 function lead(next){targetPage=next;phase='lead';ui.hidden=true;scene.classList.remove('scene-guide-active');clearTarget();const goal=guideDestination(room,next);scene.querySelectorAll?.('button[aria-label]').forEach(b=>{if(b.getAttribute('aria-label')?.includes(goal.label))b.classList.add('guide-target')});walk(()=>{},goal.player.x,goal.player.y)}
 function finish(){if(phase==='done')return;phase='done';clearTarget();npc.button.classList.remove('guide-walking');ui.remove();scene.classList.remove('scene-guide-active');cancelWalk();onFinish()}
 function render(){ui.classList.remove('sketch-paused');ui.hidden=false;scene.classList.add('scene-guide-active');ui.innerHTML=`<div class="guide-speech-copy"><strong>${residents[room].name} · ${page+1}/${tours[room].length}</strong><p role="status">${tours[room][page]}${page===tours[room].length-1&&['plaza','storage','chapter','bridge','deck','observatory'].includes(room)?' 下一步：'+npcClue(room,readNpcContext()):''}</p>${guideSketch(room,page)}<div class="guide-speech-actions"><button class="guide-next">${page===0?'好，带我看看':page===tours[room].length-1?'我来试试':'继续听'}</button> <button class="guide-skip">自由探索 / 跳过</button>${page?'<button class="guide-pause" aria-pressed="false">暂停示意</button>':''}</div></div>`;const pause=ui.querySelector('.guide-pause');if(pause)pause.hidden=reduced()||!guideSketch(room,page);if(pause)pause.onclick=()=>{const stopped=ui.classList.toggle('sketch-paused');pause.setAttribute('aria-pressed',String(stopped));pause.textContent=stopped?'播放示意':'暂停示意'};ui.querySelector('.guide-skip').onclick=finish;ui.querySelector('.guide-next').onclick=()=>{if(page<tours[room].length-1)lead(page+1);else finish()}}
 return {cancel:finish,interruptMovement(){if(phase!=='approach')finish()},tick(dt,moving){if(phase==='done')return;elapsed+=dt;if(phase==='approach'&&elapsed>.6){const p=getPlayer();if(updateNpc(constrainPosition(room,p.x-6,p.y),dt)&&!moving){onGreet();npc.button.classList.remove('guide-walking');phase='talk';render()}}else if(phase==='lead'){const goal=guideDestination(room,targetPage);const arrived=updateNpc(goal.npc,dt);if(arrived&&distance(getPlayer(),goal.player)<1){npc.button.classList.remove('guide-walking');page=targetPage;phase='talk';render()}}}};
}
