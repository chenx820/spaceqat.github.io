import {drawCat} from './cozy-world.js';
import {paintResident} from './npc-art.js';
export const prologueScenes=['voyage','storm','captain','laboratories','companion','beacon','boarding'];
const art=name=>`<img class="prologue-backdrop" src="./assets/art/${name}.png" alt="" draggable="false">`;
export function prologueFrame(index){
 const stars=`<div class="prologue-dust" aria-hidden="true">${Array.from({length:28},(_,i)=>`<i style="--x:${(i*37+3)%100}%;--y:${(i*19+5)%100}%;--delay:-${i%9}s;--size:${i%3+2}px"></i>`).join('')}</div>`;
 const cat='<canvas class="prologue-cat" width="32" height="28" aria-label="Qat 小猫" role="img"></canvas>';
 const shots=[
 `${art('spaceqat-arrival')}<div class="prologue-planet"></div>${stars}<div class="prologue-route"></div><div class="prologue-caption">SPACEQAT / 深空探索航程</div>`,
 `${art('spaceqat-arrival')}${stars}<div class="prologue-storm"></div><div class="prologue-alert"><b>安全停航</b><span>通信离线</span><span>乘员安全</span><span>等待检修</span></div><div class="prologue-darkness"></div>`,
 `${art('spaceqat-plaza')}<div class="prologue-shade"></div><div class="prologue-comm"><small>应急通信 · 舰长频道</small><canvas class="prologue-captain-portrait" width="32" height="48" role="img" aria-label="舰长 Dr. Liang"></canvas><strong>Dr. Liang</strong></div><div class="prologue-plan"><span>01 寻回零件</span><span>02 修复设备</span><span>03 验证结果</span><span>04 安全启航</span></div>`,
 `<div class="prologue-labs">${[['ops-sc','超导 · 低温电路'],['ops-neutral','中性原子 · 光镊'],['ops-ion','离子阱 · 电场'],['ops-photon','光量子 · 光路']].map(([file,label],i)=>`<div class="prologue-lab" style="--order:${i}">${art(file)}<b>${label}</b><span>等待检修与验证</span></div>`).join('')}</div>`,
 `${art('storage-v2')}<div class="prologue-shade"></div><div class="prologue-crate"></div><div class="prologue-companion-actor">${cat}<div class="prologue-lantern"><i></i></div></div><div class="prologue-quote">“错了，我们就一起找原因。”</div>`,
 `${art('spaceqat-plaza')}<div class="prologue-shade"></div><div class="prologue-beacon-assembly"><div class="prologue-empty-slot">◇<small>缺少透镜</small></div><div class="prologue-beacon-core">✦</div><div class="prologue-empty-slot">▥<small>缺少电池</small></div></div><div class="prologue-directions"><span>← 星际储藏室</span><span>星窗观测室 →</span></div>`,
 `${art('spaceqat-arrival')}<div class="prologue-door left"></div><div class="prologue-door right"></div><div class="prologue-title"><small>SPACEQAT</small><strong>叠加远征</strong><span>重 启 星 海</span></div>${stars}`
 ];
 return `<div class="prologue-shot prologue-${prologueScenes[index]}" role="img" aria-label="${['星海中的 SpaceQat 飞船','尘暴中飞船进入安全停航','舰长通过应急通信说明重启计划','四间等待维修的量子实验室','Qat 跳上木箱点亮提灯','信标缺少透镜与电池','舱门开启，重启星海'][index]}">${shots[index]}</div>`;
}
export function paintPrologue(root,index){
 root.dataset.prologue=prologueScenes[index];root.innerHTML=prologueFrame(index);
 const cat=root.querySelector('.prologue-cat');if(cat)drawCat(cat.getContext('2d'),1,1,1);
 const captain=root.querySelector('.prologue-captain-portrait');if(captain)paintResident(captain,'plaza',true);
}
