import {bellNoise,coherence,qutrit,pulseCards} from './pulse-model.js';

// Every frame is a complete snapshot. Playback speed only chooses when to show it.
export function groverFrames(rounds=2){
 if(!Number.isInteger(rounds)||rounds<0||rounds>3)throw Error('Invalid rounds');
 let amplitudes=Array(8).fill(1/Math.sqrt(8));
 const frames=[];
 const push=(title,note,round)=>frames.push({title,note,round,amplitudes:amplitudes.slice(),probabilities:amplitudes.map(v=>v*v),labels:Array.from({length:8},(_,i)=>i.toString(2).padStart(3,'0'))});
 push('准备 · 八格机会一样','先准备均匀叠加。每格直接测量的机会都是12.5%。',0);
 for(let r=1;r<=rounds;r++){
  amplitudes[5]*=-1;
  push(`第${r}轮 · 标记101`,`黑盒只翻转101的振幅符号。金色↓表示负号，不是测量结果；此刻概率还没有改变。`,r);
  const mean=amplitudes.reduce((a,b)=>a+b,0)/8;
  amplitudes=amplitudes.map(v=>2*mean-v);
  push(`第${r}轮 · 扩散`,`所有振幅关于平均值反射，目标格的机会发生变化。一次标记加一次扩散才算一轮。`,r);
 }
 return frames;
}

export function pulseFrames(index){
 if(index===0){const ideal=bellNoise(),gate=bellNoise(.12),read=bellNoise(.12,.05);return [
  {title:'① 准备成对星星',stage:0,probabilities:ideal.probabilities,fidelity:ideal.fidelity,note:'理想贝尔态，普通测量只会出现00或11。先看未经打扰的起点。'},
  {title:'② 状态小怪来捣蛋',stage:1,probabilities:gate.probabilities,fidelity:gate.fidelity,note:'门后噪声改变了测量前的量子状态。00与11的理论概率各降到47%。'},
  {title:'③ 探测器把结果写下来',stage:2,probabilities:gate.probabilities,fidelity:gate.fidelity,note:'如果记录准确，写下来的分布就对应刚才的量子状态。此处尚未加入误读。'},
  {title:'④ 纸条小怪改错字',stage:3,probabilities:read.probabilities,fidelity:read.fidelity,note:'再加入每位5%的记录翻转。记录分布改变，但测量前保真度仍为91%，不会被纸条倒过来改变。'}
 ].map(f=>({...f,labels:['00','01','10','11']}));}
 if(index===1)return [
  {title:'① H准备水晶',stage:0,coherence:1,probabilities:[.5,.5],note:'H把0准备成+态。现在直接测量，0和1各半；我们还没做最后一个H。'},
  {title:'② 等待20微秒',stage:1,coherence:Math.exp(-.5),probabilities:[.5,.5],note:'在这个纯退相位模型中，相干性减弱，但此时直接测量仍然各半。不是原子丢失。'},
  {title:'③ 再做H，比较干涉',stage:2,coherence:Math.exp(-.5),probabilities:coherence(20),note:'最后的H把相干性的变化转成可读出的概率：0约80.33%，1约19.67%。理想情况则总是0。'}
 ].map(f=>({...f,labels:['0','1']}));
 if(index===2)return Object.entries(pulseCards).flatMap(([card,[a,b]])=>[
  {title:`卡${card} · 起点在0层`,stage:0,card,probabilities:[1,0,0],note:'先把系统准备在0。三个抽屉是同一系统的三个能级，空座位是另一回事。'},
  {title:`卡${card} · 第一次旋转`,stage:1,card,probabilities:qutrit(a,0),note:'R01只在0、1两层之间分配振幅，还没有进入2层。抽屉中的横条是理论概率。'},
  {title:`卡${card} · 第二次旋转`,stage:2,card,probabilities:qutrit(a,b),note:card==='A'?'R12使部分振幅进入2层。A的目标约96.05%，但泄漏约3.95%，超过1%门槛。':'B的目标约95.17%，泄漏约0.04%，同时满足两项门槛。不能只挑最高的目标柱。'}
 ].map(f=>({...f,labels:['0','1 · 目标','2 · 泄漏']})));
 if(index===3)return groverFrames(2);
 throw Error('Unknown tutorial');
}
