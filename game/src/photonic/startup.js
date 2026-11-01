import {drawPart} from './art.js';
export const bootSteps=[
 ['光源与时钟就绪','两路光子资源按已校准的节拍出发。'],
 ['纠缠网络已验证','回顾本次成功资源：辅助光子已消耗，留下六节点双轨网络。'],
 ['读数与前馈接通','四次测量的经典读数传回控制器，修正记录已确认。'],
 ['星光织网台运行中','XZ、ZX关联验证完成。返回实验室，看看运行中的设备吧！']
];
// Presentation only: never samples, grants progress or modifies saved measurement results.
export function createPhotonStartup(){let dialog,timer,step=0,paused=false;
 function dispose(){clearInterval(timer);timer=null;if(dialog?.open)dialog.close();dialog?.remove();dialog=null}
 function play(){if(dialog?.open)return;dispose();step=0;paused=document.body.classList.contains('reduced')||matchMedia('(prefers-reduced-motion: reduce)').matches;
 dialog=document.createElement('dialog');dialog.className='ph-boot';dialog.setAttribute('aria-label','光量子设备启动动画');dialog.innerHTML=`<header><strong>✦ 星光织网台 · 启动演出</strong><button data-boot-close aria-label="关闭启动动画">✕</button></header><div class="ph-boot-stage"><div class="ph-boot-machines">${['source_top','fusion_bs','feedforward'].map(id=>`<canvas width="48" height="40" data-boot-art="${id}"></canvas>`).join('<i>══▶</i>')}</div><div class="ph-boot-network">${Array.from({length:6},(_,i)=>`<b style="--i:${i}">◆</b>`).join('')}</div><div class="ph-boot-signals"><i>读数</i><i>送回</i><i>修正</i><span>经典读数 → 修正卡</span></div><div class="ph-boot-online">✓ 光子教学系统就绪</div></div><h2></h2><p class="ph-boot-copy" role="status"></p><div class="ph-boot-steps"></div><footer><button data-boot-pause></button><button data-boot-next>下一幕 →</button><button data-boot-close>跳过演出 / 继续探索</button></footer><small>已完成实验的示意回顾 · 不是新一次融合或硬件运行 · 跳过不影响存档</small>`;
 document.body.append(dialog);dialog.querySelectorAll('[data-boot-art]').forEach(c=>drawPart(c,c.dataset.bootArt));
 function paint(){if(!dialog)return;dialog.dataset.step=step;dialog.classList.toggle('paused',paused);dialog.querySelector('h2').textContent=bootSteps[step][0];dialog.querySelector('.ph-boot-copy').textContent=bootSteps[step][1];dialog.querySelector('.ph-boot-steps').textContent=bootSteps.map((_,i)=>i<=step?'■':'□').join(' ');dialog.querySelector('[data-boot-pause]').textContent=paused?'▶ 自动播放':'Ⅱ 暂停';dialog.querySelector('[data-boot-next]').textContent=step===3?'返回工作台':'下一幕 →'}
 function next(){if(step<3){step++;paint()}else{clearInterval(timer);timer=null}}
 dialog.querySelector('[data-boot-next]').onclick=()=>{if(step===3)dispose();else next()};dialog.querySelector('[data-boot-pause]').onclick=()=>{paused=!paused;paint()};dialog.querySelectorAll('[data-boot-close]').forEach(b=>b.onclick=dispose);dialog.addEventListener('cancel',e=>{e.preventDefault();dispose()});dialog.showModal();paint();timer=setInterval(()=>{if(!paused)next()},2200);
 }
 return {play,dispose};
}
