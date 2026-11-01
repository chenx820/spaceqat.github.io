export const SEARCH_KEY='spaceqat-storage-search-v1';
const rubbish=['glasses','snack','sock','bolt','cup','paper'];
export const searchItems={
 lens:['星光透镜','找到啦！这片透镜还在闪着星光，带回广场修复信标吧。'],cell:['稳态电池','两次翻转积攒的发现，也是一种能量！'],
 glasses:['Dr. Li 的破眼镜','便签：别担心，备用眼镜在我鼻梁上。你已经找到线索了，再翻一格！'],
 snack:['空的太空饼干袋','只剩饼干香气了。Qat：不是我吃的……也许下一格有好东西！'],
 sock:['落单的星星袜','它的另一半可能正在银河洗衣机里。继续找，宝贝不会只有袜子！'],
 bolt:['弯掉的小螺丝','已经放进回收盒，不拿它装机器。探索就是一格一格排除可能！'],
 cup:['忘洗的咖啡杯','杯底写着：实验前先睡饱。先记住这条，再看看旁边的格子！'],
 paper:['皱巴巴的草稿纸','上面画着一只戴宇航帽的猫。虽然不是零件，你离翻完这只箱子又近了一步！'],
 note:['管理员的手写便签','透镜收在旧航海箱，电池要到观测室翻转小灯来充能。线索到手，继续探索吧！'],
 sc:['微波控制模块','找到超导配件！去纠缠桥完成对应任务激活，再带到操作室。'],ion:['电极控制模块','找到离子阱配件！收集只是第一步，还要完成对应的激活任务。']};
export function itemArt(id){
 const shapes={lens:'<path fill="#bc823b" d="M9 3h14v3h4v20h-4v3H9v-3H5V6h4z"/><path fill="#66cdd1" d="M10 7h12v3h3v12h-3v3H10v-3H7V10h3z"/><path fill="#e9ffeb" d="M11 9h7v3h-4v5h-3z"/>',cell:'<path fill="#b98743" d="M9 5h14v24H9zM13 2h6v3h-6z"/><path fill="#76b777" d="M12 9h8v16h-8z"/><path fill="#ffe194" d="M17 11h3l-4 7h3l-5 5 1-8h-3z"/>',glasses:'<path fill="none" stroke="#e5bd77" stroke-width="2" d="M3 12h10v10H3zM19 12h10v10H19zM13 16h6"/><path stroke="#d8f5f1" d="m23 12-2 5 4 2-3 3"/>',sock:'<path fill="#7399ca" d="M14 4h11v19H14v5H5V17h9z"/><path fill="#f4d17c" d="M14 4h11v4H14zM18 12h3v3h-3z"/>',cup:'<path fill="#d4bb8b" d="M6 9h17v18H6zM23 12h6v10h-6v-3h3v-4h-3z"/><path fill="#51362a" d="M9 11h11v4H9z"/>',bolt:'<path fill="#9ba8ad" d="M8 4h12v7h-4v7h7v10h-6v-5h-7V11H8z"/>',snack:'<path fill="#b383ad" d="M7 5h18v23H7z"/><path fill="#e5bb6b" d="M10 12h12v9H10z"/><path stroke="#543a2b" d="M8 7h16M8 26h16"/>',paper:'<path fill="#e7cf99" d="M7 5h18v23H7z"/><path fill="none" stroke="#9b794c" d="m10 10 9 3-6 4 8 6M10 24h9"/>',note:'<path fill="#f2d794" d="M6 4h20v25H6z"/><path stroke="#865531" stroke-width="2" d="M10 11h12m-12 5h12m-12 5h8"/>',sc:'<path fill="#bc8b4a" d="M3 9h26v17H3z"/><path fill="#294759" d="M6 12h20v10H6z"/><path fill="none" stroke="#68d4cc" stroke-width="2" d="m7 17 3-3 3 6 3-6 3 6 3-3h3"/>',ion:'<path fill="#bf904e" d="M4 7h24v20H4z"/><path fill="#34475a" d="M8 10h16v14H8z"/><path stroke="#d0a5f0" stroke-width="3" d="M10 13h12m-12 8h12"/>'};
 return `<svg class="search-item-art" viewBox="0 0 32 32" shape-rendering="crispEdges" role="img" aria-label="${searchItems[id]?.[0]||'杂物'}">${shapes[id]||shapes.paper}</svg>`;
}
export function newSearch(targets,random=Math.random){const layout=[...targets,...rubbish];while(layout.length<9)layout.push('paper');for(let i=layout.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[layout[i],layout[j]]=[layout[j],layout[i]]}return {layout,opened:[]}}
export function validSearch(raw,targets){const expected=newSearch(targets,()=>0).layout.sort();if(!raw||!Array.isArray(raw.layout)||JSON.stringify([...raw.layout].sort())!==JSON.stringify(expected))return null;return {layout:raw.layout,opened:[...new Set((Array.isArray(raw.opened)?raw.opened:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<raw.layout.length))]}}
export function mountSearch(root,{zone,targets,onFind}){
 let all={};try{all=JSON.parse(localStorage.getItem(SEARCH_KEY))||{};if(typeof all!=='object'||Array.isArray(all))all={}}catch{}
 const state=validSearch(all[zone],targets)||newSearch(targets);let busy=false;
 const persist=()=>{all[zone]=state;try{localStorage.setItem(SEARCH_KEY,JSON.stringify(all));return true}catch{return false}};
 state.opened.forEach(i=>{if(targets.includes(state.layout[i]))onFind(state.layout[i])});persist();
 root.innerHTML='<p>点击一格翻找。每格只搜一次，任务道具一定在这些格子里；杂物会放进回收盒。</p><div class="search-grid"></div><div class="search-discovery" role="status">箱子里沙沙作响……从任意一格开始吧！</div><p class="search-count"></p>';
 const grid=root.querySelector('.search-grid'),result=root.querySelector('.search-discovery');
 function render(){grid.innerHTML=state.layout.map((id,i)=>`<button data-search-cell="${i}" ${state.opened.includes(i)?'disabled':''} aria-label="${state.opened.includes(i)?searchItems[id][0]:'搜索第 '+(i+1)+' 格'}">${state.opened.includes(i)?itemArt(id):'<span class="search-covered">⌕</span>'}<small>${state.opened.includes(i)?searchItems[id][0]:'未翻找'}</small></button>`).join('');root.querySelector('.search-count').textContent=`已搜索 ${state.opened.length}/${state.layout.length} 格 · 找到任务物品 ${state.opened.filter(i=>targets.includes(state.layout[i])).length}/${targets.length}`;
 grid.querySelectorAll('[data-search-cell]').forEach(b=>b.onclick=()=>{if(busy)return;busy=true;b.classList.add('searching');b.setAttribute('aria-busy','true');result.textContent='翻翻找找……';setTimeout(()=>{const i=+b.dataset.searchCell,id=state.layout[i];state.opened.push(i);const saved=persist();if(targets.includes(id))onFind(id);busy=false;if(!root.isConnected)return;render();result.innerHTML=itemArt(id)+`<div><strong>${targets.includes(id)?'找到了！':'发现一件小杂物：'}${searchItems[id][0]}</strong><p>${searchItems[id][1]}</p>${!saved?'<p>浏览器暂时无法保存翻找记录，本次仍可继续。</p>':''}</div>`},document.body.classList.contains('reduced')||matchMedia('(prefers-reduced-motion: reduce)').matches?0:450)})}
 render();
}
