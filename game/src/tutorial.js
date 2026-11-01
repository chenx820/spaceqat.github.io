import {qatDialogue} from './qat-dialogue.js';
import {createBloch} from './bloch.js';
const lessons = [
 {name:'让 Qat 亮起来',gate:'X',steps:[
 ['先认识一个量子比特','本关只用两种测量结果：0 和 1。|0⟩ 读作“零态”，|1⟩ 读作“一态”。现在设备准备在零态。','0 → ?', '这些符号是状态的名字，不是绝对值。'],
 ['看一次 X 门演示','量子门是改变状态的操作。点击下面的按钮，看看 X 门怎样把零态变成一态。','0 → X → 1','再用一次 X，就会回到零态。'],
 ['轮到你来试','进入实验后：先选一个预测 → 点击空槽放入 X → 点击“运行实验”。预测错了也没关系，观察后可以再试。','预测 → 放门 → 运行','目标：让每次测量都得到 1。不需要先学公式。'] ]},
 {name:'一次只得到一个结果',gate:'H',steps:[
 ['先看概率','概率表示某个结果出现的可能性。50% 并不表示两次实验必定各出现一次。','0：50%　1：50%','少量实验的次数可能不一样，多做实验通常能看得更清楚。'],
 ['看一次 H 门演示','从零态出发，H 门准备出叠加态。在这里测量，0 和 1 的理论概率各为一半。','0 → H → 叠加态','一次测量只记录 0 或 1，不能同时读出两个答案。叠加态也不等于一枚藏着答案的硬币。'],
 ['轮到你来试','先预测，再放入一个 H 并运行。比较“理论概率”和“样本频率”：前者是计算结果，后者是这批实验的统计。','准备 → 测量 → 重新准备','每次测量前都会重新准备状态，不是一直测量同一个已经测过的状态。'] ]},
 {name:'发现看不见的差别',gate:'Z',steps:[
 ['概率相同，状态也相同吗？','不一定！量子状态还有“相位”。本关用 + 和 − 展示一种相对相位差，不要求你先掌握它的公式。','|+⟩ ≠ |−⟩','负号不是负概率，所有测量概率仍在 0% 到 100% 之间。'],
 ['看一次 Z 门演示','先用 H 产生叠加态。Z 改变两个分量之间的相位关系；此时直接测量，两个结果的概率仍各为一半。','H → Z → H','再经过 H，这个差别就会表现为不同的测量结果。'],
 ['轮到你来试','两边的 H 已放好，在中间试着放入 Z。运行后点击状态快照，比较加 Z 前后的符号和最后的结果。','中间放 Z → 运行 → 看快照','把它当作一个小侦探实验：相同的概率图，可能藏着不同的状态。'] ]},
 {name:'像调旋钮一样调概率',gate:'RY',steps:[
 ['先学会读旋钮','RY 门用角度控制状态。本关从零态开始，在 0° 到 180° 之间，角度越大，测到 1 的概率越高。','0° → 90° → 180°','θ 读作“西塔”，这里只是角度的名字。'],
 ['看一次旋转演示','点击演示按钮，比较三个角度。90° 时两个结果各占一半，180° 时一定得到 1。','角度改变 → 概率改变','这个角度与概率的关系不是直线；角度翻倍不代表概率也翻倍。'],
 ['轮到你来试','拖动角度滑块，再运行实验。目标是让 1 的理论概率接近 75%。至少比较两个角度，像科学家一样记录发现。','调角度 → 运行 → 比较','增加测量次数会影响统计结果的稳定程度，不会改变理论概率。'] ]}
];
export function createTutorial(){
 const dialog=document.createElement('dialog');dialog.id='tutorial';dialog.classList.add('pixel-workshop');dialog.setAttribute('aria-labelledby','tutorialTitle');
 dialog.innerHTML=`<header class="workbench-head"><div><span class="eyebrow">QAT 的实验小课堂</span><h2 id="tutorialTitle"></h2></div><button id="tutorialClose" aria-label="关闭教程，返回原界面">✕</button></header><div class="lesson-body"><div class="lesson-progress" id="lessonProgress"></div><h3 id="lessonHeading"></h3><p id="lessonText"></p><div class="lesson-stage"><div id="lessonDiagram"></div><div id="tutorialSphere"></div><p id="tutorialSphereNote" class="sphere-note">布洛赫球是状态地图，不是粒子的位置。动画连接前后状态，不表示真实运动轨迹。</p><div id="demoBars" hidden></div><button id="playDemo">▶ 播放演示</button><p id="demoCaption" role="status" aria-live="polite"></p></div><p class="lesson-note" id="lessonNote"></p></div><footer class="lesson-footer"><button id="skipLesson">跳过教程，进入实验</button><div><button id="previousLesson">上一步</button><button class="primary" id="nextLesson">下一步 →</button></div></footer>`;
 document.body.append(dialog);const el=id=>dialog.querySelector('#'+id);const sphere=createBloch(el('tutorialSphere'));let level=0,step=0,finish=()=>{},cancel=()=>{},timer=null,running=false;
 function diagram(text){const target=el('lessonDiagram');target.replaceChildren();const group=document.createElement('div');group.className='gate-badges';text.split('→').map(x=>x.trim()).forEach((part,i)=>{if(i){const arrow=document.createElement('span');arrow.className='badge-arrow';arrow.textContent='══▶';arrow.setAttribute('aria-hidden','true');group.append(arrow)}const badge=document.createElement('span');badge.className='state-badge '+(/^(H|X|Z|RY)/.test(part)?'gate-badge':/叠加|[+−]/.test(part)?'superposition-badge':'');badge.textContent=part==='0'?'|0⟩':part;group.append(badge)});target.append(group)}
 function stop(){clearTimeout(timer);sphere.stop();running=false}
 function render(){dialog.scrollTop=0;stop();sphere.set(0,0,false);el('tutorialSphere').hidden=step!==1;el('tutorialSphereNote').hidden=step!==1;dialog.dataset.step=step;const l=lessons[level],s=l.steps[step];qatDialogue(dialog,['先听我说一个小线索，再看装置！','点击播放演示，看看状态怎样变化。','现在轮到你啦，猜错也没关系！'][step]);el('tutorialTitle').textContent=l.name;el('lessonProgress').textContent=`${step+1} / 3 · ${['认识概念','观看演示','动手挑战'][step]}`;el('lessonHeading').textContent=s[0];el('lessonText').textContent=s[1];el('lessonDiagram').textContent=s[2];if(step===1)diagram(s[2]);if(level===0&&step===0)el('lessonDiagram').innerHTML='<div class="concept-lamps" aria-label="零态休眠核心经过操作后会怎样？"><div class="concept-core sleeping"><i aria-hidden="true"></i><b>|0⟩</b></div><span class="concept-arrow" aria-hidden="true">══▶</span><div class="concept-core waiting"><b>?</b></div></div>';el('lessonNote').textContent=s[3];el('demoCaption').textContent=step===1?'准备好后，点击播放。你可以反复观看。':'按自己的节奏阅读，点击下一步继续。';el('demoBars').hidden=true;el('playDemo').hidden=step!==1;el('playDemo').disabled=false;el('playDemo').textContent='▶ 播放演示';el('previousLesson').disabled=step===0;el('nextLesson').textContent=step===2?'我来试一试 →':'下一步 →'}
 const demos=[
 [['|0⟩','初始为零态，测到 0 的概率是 100%。',0],['|0⟩ → X → |1⟩','X 交换零态与一态。现在测量一定得到 1。',100],['|1⟩ → X → |0⟩','再经过 X 又回到零态。两次 X 的效果抵消。',0]],
 [['|0⟩','从零态重新开始。',0],['|0⟩ → H → 叠加态','指针停在赤道：测到 0 和 1 的机会各半。进入实验后再测量，每次只记录一个结果。',50]],
 [['|0⟩ → H → |+⟩','第一个 H：两个结果的概率各为一半。',50],['|+⟩ → Z → |−⟩','Z 改变相对相位，直接测量的概率仍然各半。',50],['|−⟩ → H → |1⟩','最后一个 H 让相位差成为可见结果：一定得到 1。',100]],
 [['RY(0°)','角度 0°：保持零态。',0],['RY(90°)','角度 90°：测到 1 的概率为 50%。',50],['RY(180°)','角度 180°：测到 1 的概率为 100%。',100]]
 ];
 el('playDemo').onclick=()=>{if(running)return;running=true;el('playDemo').disabled=true;let n=0;function frame(){const d=demos[level][n];const positions=[[[0,0],[Math.PI,0],[0,0]],[[0,0],[Math.PI/2,0],[Math.PI,0]],[[Math.PI/2,0],[Math.PI/2,Math.PI],[Math.PI,Math.PI]],[[0,0],[Math.PI/2,0],[Math.PI,0]]];sphere.set(...positions[level][n],!(level===1&&n===2));diagram(d[0]);el('demoCaption').textContent=d[1];el('demoBars').hidden=false;el('demoBars').innerHTML=[100-d[2],d[2]].map((p,i)=>`<div class="demo-row"><span>测到 ${i}</span><div class="demo-track"><i style="width:${p}%"></i></div><b>${p}%</b></div>`).join('');if(++n<demos[level].length)timer=setTimeout(frame,2200);else{running=false;el('playDemo').disabled=false;el('playDemo').textContent='↻ 再看一次'}}frame();el('tutorialSphere').scrollIntoView({block:'center',behavior:'instant'})};
 function done(){stop();dialog.close();finish()}el('nextLesson').onclick=()=>{if(step<2){step++;render()}else done()};el('previousLesson').onclick=()=>{if(step>0){step--;render()}};el('skipLesson').onclick=done;el('tutorialClose').onclick=()=>{stop();dialog.close();cancel()};dialog.addEventListener('cancel',()=>{stop();cancel()});
 return {get open(){return dialog.open},show(i,onFinish,onCancel=()=>{}){level=i;step=0;finish=onFinish;cancel=onCancel;render();dialog.showModal()}};
}
