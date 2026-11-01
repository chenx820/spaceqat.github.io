import {drawPlayer} from './player-avatar.js';
import {chapterResident} from './chapter-interaction.js';
// Brand mascot: black cat, asymmetric lime eyes, open quantum box.
export function drawCat(ctx,x,y,s=1,frame=0,blink=false){
 const p=(a,b,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x+a*s,y+b*s,w*s,h*s)};
 const ink='#101210',eye='#c8f31c',edge='#343a2c',bob=frame%2;
 p(2,24,25,2,'#24302644');
 p(5,5+bob,18,14,ink);p(3,1+bob,4,9,ink);p(7,4+bob,3,5,ink);p(20,bob,4,9,ink);p(17,3+bob,4,5,ink);
 p(6,11+bob,8,4,eye);p(8,15+bob,4,1,eye);p(11,11+bob,2,4,ink);
 p(16,7+bob,7,9,eye);p(15,9+bob,9,5,eye);p(20,8+bob,2,7,ink);
 if(blink){p(6,7+bob,18,9,ink);p(7,13+bob,6,1,eye);p(17,12+bob,6,1,eye)}
 p(3,18,22,7,ink);p(5,20,10,3,edge);p(17,20,6,3,edge);p(15,18,2,7,ink);
 p(1,17,13,2,ink);p(3,15,11,2,ink);p(0,19,12,2,ink);p(18,16,7,2,ink);p(20,18,7,2,ink);
 p(4,25,4,1,ink);p(21,25,4,1,ink);
}
export function createWorld(canvas,{getProgress,onInteract,onExit,isPaused,reduced}){
 const ctx=canvas.getContext('2d');canvas.width=1672;canvas.height=940;
 const bg=new Image();bg.src='./assets/art/quantum-cottage.png';
 const player={x:322,y:274},keys=new Set(),terminals=[157,268,375,482];let nearest=-1,last=0,nearExit=false,destination=null,clock=0,dust=[];
 let resident=null,nearResident=false,guide=null,welcomed=false;
 const quiet=()=>reduced()||matchMedia('(prefers-reduced-motion: reduce)').matches;
 const exit=document.createElement('button');exit.className='chapter-room-exit';exit.innerHTML='<i class="interaction-marker" aria-hidden="true">▼</i><span class="interaction-label"><kbd>E</kbd> 出口 · 返回广场</span>';exit.setAttribute('aria-label','态制备舱出口，返回广场');canvas.parentElement.append(exit);
 const key=document.createElement('kbd');key.className='chapter-cat-key';key.textContent='E';key.hidden=true;key.setAttribute('aria-hidden','true');canvas.parentElement.append(key);
 function leave(){if(isPaused())return;guide?.cancel();keys.clear();destination=null;player.x=322;player.y=274;nearExit=false;onExit?.()}
 function approach(i){if(isPaused())return;keys.clear();destination=i<0?{x:322,y:319,i:-1}:{x:terminals[i],y:195,i}}
 exit.onclick=()=>approach(-1);
 function talk(){if(isPaused()||!resident)return;guide?.cancel();keys.clear();destination=null;resident.speak()}
 function approachResident(){if(isPaused()||!resident)return;guide?.interruptMovement();keys.clear();destination={x:Math.max(88,Math.min(546,resident.point.x*6.4-24)),y:Math.max(193,Math.min(326,resident.point.y*3.6)),npc:true}}
 const p=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h)};
 function draw(moving){ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=false;ctx.fillStyle='#b69765';ctx.fillRect(0,0,canvas.width,canvas.height);if(bg.complete&&bg.naturalWidth)ctx.drawImage(bg,0,0,canvas.width,canvas.height);ctx.setTransform(canvas.width/640,0,0,canvas.height/360,0,0);
 dust.forEach(d=>{ctx.globalAlpha=d.life/.3;p(d.x,d.y,1,1,'#fff7e4')});ctx.globalAlpha=1;
 p(player.x-10,player.y-1,20,3,'#19120c88');p(player.x-7,player.y-2,14,5,'#19120c55');
 drawPlayer(ctx,Math.round(player.x)-14,Math.round(player.y)-25,1,quiet()?0:Math.floor(clock/(moving?100:400)),!quiet()&&!moving&&clock%4800<120,drawCat);
 }
 function tick(now){const dt=Math.min((now-last)/1000,.04);last=now;clock=now;let moving=false;
 if(!isPaused()&&!document.hidden){let dx=+(keys.has('d')||keys.has('arrowright'))-+(keys.has('a')||keys.has('arrowleft')),dy=+(keys.has('s')||keys.has('arrowdown'))-+(keys.has('w')||keys.has('arrowup'));
 if(destination){dx=destination.x-player.x;dy=destination.y-player.y;if(Math.hypot(dx,dy)<Math.max(1,72*dt)){const {i,npc,guided}=destination;player.x=destination.x;player.y=destination.y;destination=null;dx=dy=0;if(guided){}else if(npc)talk();else if(i<0)leave();else onInteract(i)}}
 if(dx||dy){moving=true;const n=Math.hypot(dx,dy);player.x=Math.max(88,Math.min(546,player.x+dx/n*72*dt));player.y=Math.max(193,Math.min(326,player.y+dy/n*72*dt));if(!quiet()&&(!dust.length||dust[dust.length-1].life<.2))dust.push({x:player.x,y:player.y+2,life:.3})}
 }else{keys.clear();destination=null}
 dust=dust.map(d=>({...d,life:d.life-dt,y:d.y-dt*6})).filter(d=>d.life>0);if(quiet())dust=[];
 nearExit=Math.hypot(player.x-322,player.y-319)<25;nearest=terminals.findIndex(x=>Math.hypot(player.x-x,player.y-195)<30);
 if(!isPaused()&&resident?.startGuide&&!welcomed&&!guide){guide=resident.startGuide({getPlayer:()=>({x:player.x/6.4,y:player.y/3.6}),walk:(_action,x,y)=>{keys.clear();destination={x:x*6.4,y:y*3.6,guided:true}},cancelWalk:()=>{keys.clear();destination=null},onGreet:()=>{welcomed=true},onFinish:()=>{guide=null},reduced:quiet})}if(!isPaused())guide?.tick(dt,moving);else if(guide)guide.cancel();
 nearResident=!!resident&&Math.hypot(player.x-resident.point.x*6.4,player.y-resident.point.y*3.6)<chapterResident.radius;resident?.button.classList.toggle('near',nearResident&&!isPaused());
 exit.classList.toggle('near',nearExit&&!isPaused());document.querySelectorAll('.device-hotspot').forEach((b,i)=>b.classList.toggle('near',i===nearest&&!isPaused()));
 key.hidden=isPaused()||(!nearResident&&!nearExit&&nearest<0);key.style.left=player.x/640*100+'%';key.style.top=(player.y-33)/360*100+'%';document.getElementById('interactButton').hidden=true;draw(moving);requestAnimationFrame(tick)}
 window.addEventListener('keydown',e=>{if(isPaused()||e.ctrlKey||e.metaKey||e.altKey||e.target.matches('input,select,textarea'))return;const k=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(k)){e.preventDefault();guide?.interruptMovement();keys.add(k);destination=null}if(k==='e'&&!e.repeat){if(nearResident){e.preventDefault();talk()}else if(nearExit){e.preventDefault();leave()}else if(nearest>=0){e.preventDefault();keys.clear();destination=null;onInteract(nearest)}}});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{keys.clear();destination=null});document.addEventListener('visibilitychange',()=>{keys.clear();destination=null});
 canvas.addEventListener('click',e=>{if(isPaused())return;const b=canvas.getBoundingClientRect(),x=(e.clientX-b.left)*640/b.width,y=(e.clientY-b.top)*360/b.height;const i=terminals.findIndex(t=>Math.abs(t-x)<42&&y>96&&y<195);if(i>=0)approach(i)});
 requestAnimationFrame(tick);return {approach,registerResident(button,speak,startGuide,point={x:chapterResident.x/6.4,y:chapterResident.y/3.6}){resident={button,speak,startGuide,point};button.onclick=approachResident}};
}
