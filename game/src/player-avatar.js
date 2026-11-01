export const AVATAR_KEY='spaceqat-player-avatar-v1';
export const skins=[
 {id:'cat',name:'Qat 猫猫',note:'翠绿眼睛的星际伙伴'},
 {id:'man',name:'青年男探索员',skin:'#d9a078',hair:'#493027',coat:'#518fa0'},
 {id:'woman',name:'青年女探索员',skin:'#f1bf91',hair:'#633f32',coat:'#a86b86',long:true},
 {id:'grandpa',name:'银发爷爷',skin:'#dbad85',hair:'#ddd9cf',coat:'#788d60',glasses:true},
 {id:'grandma',name:'银发奶奶',skin:'#efc39e',hair:'#e5dfd0',coat:'#9476a6',glasses:true,long:true},
 {id:'boy',name:'小小男探索员',skin:'#b97c57',hair:'#302d33',coat:'#d69a47',child:true},
 {id:'girl',name:'小小女探索员',skin:'#e1ac81',hair:'#49372d',coat:'#53a58e',child:true,long:true},
 {id:'alien',name:'薄荷星来客',skin:'#99d9af',hair:'#397b72',coat:'#777fb6',alien:true},
 {id:'alien-purple',name:'紫晶星来客',skin:'#c3a4df',hair:'#73558c',coat:'#52a2ab',alien:true}
];
export function normalizeSkin(id){return skins.some(s=>s.id===id)?id:'cat'}
export function savedSkin(){try{const id=localStorage.getItem(AVATAR_KEY);return skins.some(s=>s.id===id)?id:null}catch{return null}}
let selected=savedSkin()||'cat';
export function drawPlayer(ctx,x,y,scale,frame,blink,cat,id=selected){
 const a=skins.find(s=>s.id===id)||skins[0];if(a.id==='cat')return cat(ctx,x,y,scale,frame,blink);
 const bob=frame%2,short=a.child?3:0;
 const r=(u,v,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x+u*scale,y+(v+short)*scale,w*scale,h*scale)};
 const ink='#282832';
 r(8,18-short,6,7,ink);r(18,18-short,6,7,ink);
 r(6,24-short-(frame%2),8,2,ink);r(18,24-short-((frame+1)%2),8,2,ink);
 r(7,13+bob,18,9-short,a.coat);r(5,15+bob,3,6-short,a.skin);r(25,15+bob,3,6-short,a.skin);
 r(13,14+bob,6,2,'#f6d087');r(19,18+bob,3,2,'#ffdf8c');
 r(9,1+bob,14,12,a.hair);r(10,4+bob,12,9,a.skin);
 if(a.long){r(7,4+bob,3,12,a.hair);r(22,4+bob,3,12,a.hair)}
 if(a.alien){r(9,-short+bob,2,4,a.hair);r(21,-short+bob,2,4,a.hair);r(8,-short+bob,3,2,'#ffd87d');r(21,-short+bob,3,2,'#ffd87d')}
 r(12,7+bob,2,blink?1:3,ink);r(19,7+bob,2,blink?1:3,ink);r(15,11+bob,3,1,'#865957');
 if(a.glasses){r(11,6+bob,5,1,ink);r(18,6+bob,5,1,ink);r(11,10+bob,5,1,ink);r(18,10+bob,5,1,ink);r(16,8+bob,2,1,ink)}
}
export function chooseAvatar(cat,onDone=()=>{},required=false){
 const dialog=document.createElement('dialog');dialog.className='avatar-picker pixel-workshop';dialog.setAttribute('aria-labelledby','avatarTitle');let draft=selected;
 dialog.innerHTML=`<header><span>SPACEQAT · 探索员登记处</span><h2 id="avatarTitle">选择你的星际模样</h2><p>每一种模样都能探索全部房间。Qat 仍会陪你学习。</p></header><div class="avatar-grid">${skins.map(a=>`<button data-skin="${a.id}" aria-pressed="${a.id===draft}"><canvas width="32" height="28" aria-hidden="true"></canvas><strong>${a.name}</strong></button>`).join('')}</div><footer><p role="status">只改变外观，不改变能力和进度；以后可随时换装。</p><button class="primary avatar-confirm">${required?'选好了，开始航行 →':'保存装扮'}</button>${required?'':'<button class="avatar-cancel">取消</button>'}</footer>`;
 document.body.append(dialog);
 dialog.querySelectorAll('[data-skin]').forEach(b=>{drawPlayer(b.querySelector('canvas').getContext('2d'),0,0,1,0,false,cat,b.dataset.skin);b.onclick=()=>{draft=b.dataset.skin;dialog.querySelectorAll('[data-skin]').forEach(c=>c.setAttribute('aria-pressed',String(c===b)))}});
 dialog.querySelector('.avatar-confirm').onclick=()=>{selected=draft;try{localStorage.setItem(AVATAR_KEY,selected)}catch{dialog.querySelector('[role=status]').textContent='浏览器无法保存装扮，本次航程仍可使用。';}dialog.close();onDone()};
 dialog.querySelector('.avatar-cancel')?.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('cancel',e=>{if(required)e.preventDefault()});dialog.addEventListener('close',()=>dialog.remove(),{once:true});dialog.showModal();
}
