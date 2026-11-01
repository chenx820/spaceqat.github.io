import {readNpcContext} from './npc-model.js';
import {storyMilestones,storyScenes} from './story-progress.js';
import {openingVisual} from './opening-film.js';
const KEY='spaceqat-story-restart-v1';
export function mountStory(){
 const read=()=>storyMilestones(readNpcContext());let last=read(),queue=[],active=null;
 let seen=new Set();try{const saved=JSON.parse(localStorage.getItem(KEY));seen=new Set(Array.isArray(saved)?saved.filter(id=>storyScenes.some(s=>s.id===id)):last)}catch{seen=new Set(last)}
 // Old progress is replayable without a barrage of retroactive cutscenes.
 const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify([...seen]))}catch{}};
 queue=last.filter(id=>!seen.has(id));persist();
 const dialog=document.createElement('dialog');dialog.id='storyFilm';dialog.className='pixel-workshop';dialog.setAttribute('aria-label','飞船重启剧情');document.body.append(dialog);
 const nav=document.querySelector('.topbar nav'),button=document.createElement('button');button.textContent='重启航行日志';nav.append(button);
 const status=document.createElement('div');status.id='shipStoryStatus';status.setAttribute('role','status');document.querySelector('.topbar').after(status);
 function finish(){if(active){seen.add(active);persist()}active=null;dialog.close()}
 function play(id){const s=storyScenes.find(s=>s.id===id);if(!s)return;active=id;dialog.innerHTML=`<header><small>SPACEQAT · 重启记录</small><h2>${s.title}</h2></header><div class="story-visual cinema-visual" data-scene="${s.scene}">${openingVisual(s.scene)}</div><p>${s.text}</p><footer><button id="storyContinue">继续探索 →</button><button id="storySkip">跳过动画</button><button id="storyPause" aria-pressed="false">暂停动画</button></footer>`;dialog.querySelector('#storyContinue').onclick=finish;dialog.querySelector('#storySkip').onclick=finish;dialog.querySelector('#storyPause').onclick=e=>{const paused=dialog.classList.toggle('story-paused');e.target.textContent=paused?'播放动画':'暂停动画';e.target.setAttribute('aria-pressed',String(paused))};dialog.classList.remove('story-paused');if(!dialog.open)dialog.showModal()}
 dialog.addEventListener('cancel',e=>{e.preventDefault();finish()});
 button.onclick=()=>{const ids=read();active=null;dialog.innerHTML='<header><h2>重启航行日志</h2></header><p>每份验证记录，都让飞船离重新启航更近一步。这里记录剧情，不替代航行总日志的完整启航检查。</p><div class="story-records">'+storyScenes.map(s=>`<button data-story="${s.id}" ${ids.includes(s.id)?'':'disabled'}>${ids.includes(s.id)?'▶':'◇'} ${s.title}</button>`).join('')+'</div><footer><button id="closeStory">返回探索</button></footer>';dialog.querySelectorAll('[data-story]').forEach(b=>b.onclick=()=>play(b.dataset.story));dialog.querySelector('#closeStory').onclick=finish;dialog.showModal()};
 function scan(){if(document.hidden)return;const ids=read();for(const id of ids)if(!last.includes(id)&&!seen.has(id)&&!queue.includes(id))queue.push(id);last=ids;queue=queue.filter(id=>ids.includes(id)&&!seen.has(id));
 const chapters=ids.filter(id=>id.startsWith('chapter')).length;
 status.textContent=`飞船重启计划 · ${ids.includes('beacon')?'信标在线':'等待点亮信标'} · 章节验证 ${chapters}/6 · 主线设备记录 ${ids.filter(id=>id.startsWith('run-')).length}/4`;
 document.body.classList.toggle('ship-beacon-online',ids.includes('beacon'));document.body.dataset.shipChapters=String(chapters);
 if(queue.length&&!document.querySelector('dialog[open], .scene-guide-active')&&!document.querySelector('.pixel-transition'))play(queue.shift());
 }
 scan();setInterval(scan,900);
}
