// Decorative teaching metaphors, never connected to experiment outcomes or temperature.
export function guideSketch(room,page){
 if(!page||!['ops-sc','ops-neutral','ops-ion','ops-photon','observatory'].includes(room))return '';
 let drawing='',caption='';
 const chip='<path fill="#69b9bd" stroke="#e9c27c" stroke-width="2" d="M100 17h40v30h-40z"/><path fill="#253947" d="M110 25h20v14h-20z"/>';
 if(room==='ops-sc'&&page<3){caption='把热带走 → 小芯片少受打扰';drawing=chip+Array.from({length:4},(_,i)=>`<g class="sketch-heat" style="animation-delay:-${i*.6}s"><path fill="#ed9859" d="M${45+i*47} 30h4v-4h4v12h-12v-4h4z"/></g>`).join('')+'<path d="M70 50h100" stroke="#829eb6" stroke-width="2"/>'}
 else if(room==='ops-neutral'){caption='五个光阱是座位，示意装了三个原子';drawing=Array.from({length:5},(_,i)=>`<path fill="#263642" stroke="#8dccb1" stroke-width="2" d="M${28+i*40} 20h24v24h-24z"/>${[0,2,4].includes(i)?`<rect class="sketch-atom" x="${36+i*40}" y="28" width="8" height="8" fill="#ffd84d"/>`:''}`).join('')}
 else if(room==='ops-ion'){caption='电场束缚离子，激光帮助控制';drawing='<path fill="none" stroke="#bd9ade" stroke-width="3" d="M65 12h110v40H65z"/><path stroke="#788eae" d="M40 32h160"/><g class="sketch-ion"><rect x="95" y="28" width="8" height="8" fill="#ffe7a1"/><rect x="137" y="28" width="8" height="8" fill="#ffe7a1"/></g>'}
 else if(room==='observatory'){caption='重复准备与测量 → 留下许多记录';drawing=Array.from({length:5},(_,i)=>`<g class="sketch-record" style="animation-delay:-${i*.4}s"><path fill="#e6c28a" d="M${25+i*40} 18h22v32h-22z"/><path stroke="#785134" stroke-width="2" d="M${30+i*40} 28h12m-12 8h12"/></g>`).join('')}
 else{caption=room==='ops-photon'?'测量留下记录 → 依记录决定下一步':'控制信号 → 芯片 → 读出记录';drawing='<path stroke="#b88c55" stroke-width="3" d="M25 32h190"/>'+chip+'<path fill="#eac791" d="M198 20h22v26h-22z"/><path stroke="#5c422e" d="M202 28h14m-14 8h14"/><rect class="sketch-signal" x="22" y="28" width="8" height="8" fill="#79e4dd"/>'}
 return `<figure class="guide-sketch"><svg viewBox="0 0 240 64" shape-rendering="crispEdges" role="img" aria-label="${caption}">${drawing}</svg><figcaption>${caption}<small>概念示意 · 非设备实时数据</small></figcaption></figure>`;
}
