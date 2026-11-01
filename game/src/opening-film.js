export const OPENING_KEY='spaceqat-opening-restart-v3';
export const openingShots=[
 {title:'最后一盏灯',text:'在无数恒星之间，SpaceQat 带着仪器、科学档案，还有一群不肯停止提问的人，驶向星海深处。直到一场星际尘暴，让航程停在了半途。',scene:'ocean',duration:12000},
 {title:'安全停航程序已启动',text:'外部通信中断。多处设备等待检查。飞船保护住了所有人，却无法确认下一次启航是否安全。星图逐渐熄灭，只有应急灯仍在守望。',scene:'signal',duration:12000},
 {title:'舰长的重启计划',text:'“我是舰长 Dr. Liang，大家都安全。但我们不能带着未经检查的设备出发。找回零件，完成实验，把可靠的结果带回主控——我们才能重启飞船。”',scene:'journey',duration:15000},
 {title:'四扇门后的等待',text:'低温电路、光镊中的原子、电场里的离子、光学平台上的光子。四种计算设备等待修复与验证。它们帮助研究和验证计算方案，并不是给飞船提供动力的引擎。',scene:'engines',duration:16000},
 {title:'你不必先知道所有答案',text:'“我是 Qat，你的同行伙伴。我们先试一次，看看发生什么。错了，就一起找原因。”从一盏小灯，到一条线路，再到保护信息的办法：每一个发现，都让飞船离重启更近一步。',scene:'guardians',duration:15000},
 {title:'先点亮中央广场',text:'信标还缺两件东西：储藏室的星光透镜，观测室的稳态电池。点亮它，舰长就能把重启计划交给大家。一艘飞船的重启，可以从一个小小的发现开始。',scene:'arrival',duration:12000},
 {title:'叠加远征 · 重启星海',text:'舱门已经打开。领取你的登船证，选择自己的模样。研究员们正在等待你——让好奇心成为航向，让亲手验证的发现带我们重新启航。',scene:'arrival',duration:9000}
];
export function openingVisual(scene){
 const stars=Array.from({length:48},(_,i)=>`<rect class="cinema-star" style="animation-delay:-${i%7}s" x="${(i*137+19)%960}" y="${(i*79+13)%340}" width="${i%3===0?4:2}" height="${i%3===0?4:2}" fill="${i%3?'#8fa8bd':'#f4d799'}"/>`).join('');
 const ship='<g class="cinema-vessel"><path d="M330 155h40v-20h220v20h40v20h30v60h-30v20H330v-20h-30v-60h30z" fill="#bd9765" stroke="#5d3e2d" stroke-width="8"/><path d="M370 145h220v28H370zM330 185h90v30h-90zM540 185h90v30h-90z" fill="#67bbc2"/><path d="M450 175h60v70h-60z" fill="#292c43" stroke="#f2cd81" stroke-width="8"/><path class="cinema-engine" d="M335 260h60v12h-60zM565 260h60v12h-60z" fill="#79e4d7"/></g>';
 let content='';
 if(scene==='ocean'||scene==='signal')content=`<path class="cinema-orbit" d="M30 280h140v-20h160v-20h300v-20h160v-20h140" fill="none" stroke="#655c83" stroke-width="6"/>${ship}${scene==='signal'?'<g class="cinema-signal"><path d="M440 70h80v50h-80z" fill="#f4d39c"/><path d="m440 70 40 30 40-30" fill="none" stroke="#81522e" stroke-width="5"/></g>':''}`;
 if(scene==='engines')content=['超导电路','中性原子','离子阱','光子网络'].map((name,i)=>`<g class="cinema-module" style="animation-delay:${i*.6}s"><path d="M${95+i*210} 90h140v170h-140z" fill="#24273c" stroke="#bc8a4d" stroke-width="8"/><path d="M${115+i*210} 115h100v80h-100z" fill="${['#6bb6d2','#83be85','#bca1dd','#ddae71'][i]}"/>${Array.from({length:4},(_,j)=>`<rect x="${130+i*210+j*20}" y="145" width="8" height="16" fill="#fff1b9"/>`).join('')}<text x="${165+i*210}" y="230" text-anchor="middle">${name}</text></g>`).join('');
 if(scene==='guardians')content='<path class="cinema-copper" d="M250 150h460M250 150v70h460v-70" fill="none" stroke="#d7ab61" stroke-width="6"/>'+[250,480,710].map((x,i)=>`<g class="cinema-guard" style="animation-delay:${i*.3}s"><path d="M${x-40} 110h80v80h-80z" fill="#39636a" stroke="#f4d392" stroke-width="6"/><path d="M${x-12} 135h24v28h-24z" fill="#8be3d4"/></g>`).join('')+'<text x="480" y="285" text-anchor="middle">共同编码 · 检测错误 · 保护信息</text>';
 if(scene==='journey')content='<path d="M100 180h760" stroke="#8b673c" stroke-width="6"/>'+Array.from({length:6},(_,i)=>`<g class="cinema-module" style="animation-delay:${i*.4}s"><path d="M${90+i*145} 150h50v60h-50z" fill="#416b6d" stroke="#d9ae64" stroke-width="5"/><text x="${115+i*145}" y="190" text-anchor="middle">0${i+1}</text></g>`).join('')+'<text x="480" y="280" text-anchor="middle">观察 → 尝试 → 比较 → 发现</text>';
 return `<svg viewBox="0 0 960 360" shape-rendering="crispEdges" aria-hidden="true">${stars}${content}</svg>`;
}
