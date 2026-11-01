const colors={wall:'#1a303f',floor:'#1a2d38',edge:'#344e59',cyan:'#63c9c2',lime:'#d5ed8a'};
export function drawCat(ctx,x,y,scale=1,frame=0){
  const pixel=(a,b,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x+a*scale,y+b*scale,w*scale,h*scale)};
  pixel(2,19,22,3,'#0c1820');pixel(5,5,17,15,'#080f19');pixel(4,1,5,7,'#080f19');pixel(18,1,5,7,'#080f19');pixel(5,2,2,4,'#bac5ba');pixel(19,2,2,4,'#bac5ba');pixel(9,13,9,7,'#c7d1c3');pixel(6,8,15,5,'#b9db80');pixel(7,9,5,3,'#304438');pixel(15,9,5,3,'#304438');pixel(9,9,2,3,'#d9f19b');pixel(17,9,2,3,'#d9f19b');pixel(13,13,2,2,'#d19b99');pixel(7,20,4,2,'#d1d6ca');pixel(18,20,4,2,'#d1d6ca');pixel(22,13+(frame%2),4,3,'#101a23');pixel(24,8+(frame%2),3,6,'#101a23');
}
export function createWorld(canvas,{getProgress,onInteract,isPaused,reduced}) {
  const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
  const player={x:255,y:269}; const keys=new Set();
  const terminals=[{x:141,y:147},{x:263,y:147},{x:385,y:147},{x:507,y:147}];
  let nearest=-1,frame=0,last=0;const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h)};
  function line(x1,y1,x2,y2,c,w=1){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
  function text(t,x,y,c,size=7){ctx.font=`${size}px monospace`;ctx.fillStyle=c;ctx.fillText(t,x,y)}
  function crate(x,y){rect(x,y,27,21,'#11232c');rect(x+1,y+1,25,17,'#354a4c');rect(x+4,y+3,19,11,'#243838');rect(x+11,y+1,4,19,'#4e6660');rect(x+4,y+18,19,3,'#091924')}
  function rack(x,y){rect(x,y,35,66,'#0c1a26');rect(x+2,y+2,31,60,'#314855');for(let i=0;i<4;i++){rect(x+5,y+6+i*13,25,10,'#10232f');rect(x+8,y+8+i*13,2,2,i%2?'#bddb80':'#55b9ac');rect(x+13,y+8+i*13,13,1,'#34515c');rect(x+13,y+11+i*13,9,1,'#29434e')}rect(x-2,y+64,39,4,'#09151f')}
  function terminal(t,i,done,unlocked){const x=t.x-30,y=t.y-50;const accent=done?colors.lime:unlocked?colors.cyan:'#49616d';rect(x-6,y+45,72,11,'#0c1c26');rect(x,y+8,60,40,'#3c5660');rect(x+3,y+10,54,33,'#243c49');rect(x+7,y+13,46,25,'#0b212d');rect(x+10,y+16,40,1,'#294f54');
    if(i===0){rect(x+25,y+20,10,10,accent);rect(x+22,y+23,16,4,accent);rect(x+28,y+17,4,16,accent)}
    if(i===1){rect(x+16,y+25,9,7,accent);rect(x+35,y+25,9,7,accent);line(x+25,y+28,x+35,y+28,accent);rect(x+20,y+20,3,3,accent);rect(x+39,y+20,3,3,accent)}
    if(i===2){for(let n=0;n<30;n++)rect(x+15+n,y+25+Math.round(Math.sin(n*.3+frame*.025)*5),2,2,accent)}
    if(i===3){ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+30,y+26,9,0,Math.PI*2);ctx.stroke();line(x+30,y+26,x+36,y+20,accent,2)}
    rect(x-3,y+42,66,12,'#4d6263');rect(x,y+44,60,6,'#293f46');for(let j=0;j<9;j++)rect(x+5+j*5,y+45,3,2,'#718581');rect(x+5,y+54,9,9,'#1b303e');rect(x+47,y+54,9,9,'#1b303e');rect(x+26,y+48,8,2,accent);text(`0${i+1}`,x+25,y+6,accent,7);
    if(done){text('ONLINE',x+15,y+75,'#a7c97a',6)}else if(unlocked){text('CALIBRATE',x+8,y+75,'#6aaead',6)}else{text('OFFLINE',x+13,y+75,'#536b79',6)}
  }
  function draw(){const progress=getProgress();const completed=progress.filter(x=>x>0).length;ctx.clearRect(0,0,640,360);rect(0,0,640,360,'#0b1723');
    for(let i=0;i<55;i++){let x=(i*113+23)%640,y=(i*53+7)%85;rect(x,y,1,i%5===0?2:1,i%3?'#335260':'#8ea49c')}
    // Exterior windows and thick pixel-built walls.
    rect(38,74,564,245,'#091822');rect(44,76,552,235,'#213746');rect(48,83,544,63,'#304957');
    for(let i=0;i<9;i++){let x=56+i*59;rect(x,89,51,44,'#142b3a');rect(x+2,91,47,37,'#0d1e2d');rect(x+3,92,45,2,'#47616c');for(let j=0;j<4;j++)rect(x+8+j*10,99+(j*7+i*3)%22,1,1,'#86b5b8');line(x+25,94,x+25,125,'#263d4e')}
    rect(48,135,544,11,'#3b515b');rect(48,145,544,161,colors.floor);
    for(let y=146;y<306;y+=16)for(let x=48;x<592;x+=16){rect(x,y,15,15,(x/16+y/16)%2?'#1c303c':'#1a2c37');rect(x,y+15,16,1,'#102432');rect(x+15,y,1,16,'#142733');if((x+y)%80===0)rect(x+3,y+3,2,1,'#2b424b')}
    // Recessed conduit paths.
    for(let x=144;x<=512;x+=122){line(x,198,x,228,'#10232b',5);line(x,198,x,228,completed?'#536a4d':'#304951',1)}line(144,228,510,228,'#10232b',5);line(144,228,510,228,'#3d5b57');line(327,228,327,259,'#4c6c62',2);
    rect(42,144,8,164,'#354c57');rect(591,144,8,164,'#354c57');rect(43,306,554,11,'#41545c');rect(43,317,554,7,'#0a1824');rect(51,309,535,2,'#64746a');
    // Ceiling fixtures.
    for(let x of [167,350,533]){rect(x-25,72,50,9,'#122430');rect(x-22,75,44,3,'#a3bab1');rect(x-19,79,38,1,'#425b59')}
    rack(57,164);rack(548,164);crate(65,267);crate(90,278);crate(540,273);
    // Generator platform with a raised central hologram.
    rect(281,259,92,32,'#0e202d');rect(285,255,84,28,'#405661');rect(291,258,72,20,'#203d48');rect(300,261,54,12,'#17353e');rect(289,279,76,3,'#708276');
    for(let i=0;i<4;i++)rect(299+i*15,284,10,3,progress[i]?'#d5ed8a':'#3c5260');
    const float=reduced()?0:Math.round(Math.sin(frame*.025)*2);const cy=242+float;line(327,cy-19,348,cy-8,'#7bbaae');line(348,cy-8,327,cy+4,'#7bbaae');line(327,cy+4,306,cy-8,'#7bbaae');line(306,cy-8,327,cy-19,'#7bbaae');line(306,cy-8,306,cy+12,'#4d817d');line(348,cy-8,348,cy+12,'#4d817d');line(327,cy+4,327,cy+24,'#8fc0ae');line(306,cy+12,327,cy+24,'#4d817d');line(327,cy+24,348,cy+12,'#4d817d');text(`${completed}/4`,319,cy+13,colors.lime,8);
    // Floor markings and vegetation.
    text('STATE PREPARATION',261,303,'#607780',7);for(let i=0;i<6;i++)rect(190+i*6,291,3,2,'#6c7050');for(let i=0;i<6;i++)rect(420+i*6,291,3,2,'#6c7050');
    rect(565,241,18,15,'#4a615c');rect(568,237,12,9,'#67806a');rect(565,228,5,14,'#3f795c');rect(573,222,5,20,'#5d9470');rect(579,229,4,12,'#416f56');
    terminals.forEach((t,i)=>terminal(t,i,progress[i],i===0||progress[i-1]));
    const bob=keys.size&&!reduced()?Math.floor(frame/8)%2:0;rect(player.x-8,player.y+1,18,5,'#10212c');rect(player.x-6,player.y-15+bob,13,15,'#c6cbbc');rect(player.x-7,player.y-25+bob,15,12,'#c9d3c8');rect(player.x-5,player.y-23+bob,11,6,'#385c67');rect(player.x-3,player.y-22+bob,5,2,'#83c2c0');rect(player.x-3,player.y-13+bob,8,8,'#416f7b');rect(player.x-8,player.y-12+bob,3,9,'#8ca89e');rect(player.x+7,player.y-12+bob,3,9,'#8ca89e');rect(player.x-5,player.y,4,3,'#2b4554');rect(player.x+3,player.y,4,3,'#2b4554');
    drawCat(ctx,player.x+22,player.y-18,1,reduced()?0:Math.floor(frame/20));
    if(nearest>=0){let t=terminals[nearest];rect(t.x-7,t.y+40,14,14,'#abc77e');text('E',t.x-3,t.y+50,'#1c3126',9)}
    // Door indicator.
    rect(588,265,12,28,completed===4?'#a3c77e':'#233d49');rect(590,268,8,21,'#0c2028');
  }
  function tick(now){const dt=Math.min((now-last)/1000,.04);last=now;if(!isPaused()&&!document.hidden){let dx=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),dy=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);if(dx||dy){const n=Math.hypot(dx,dy);let nx=player.x+dx/n*70*dt,ny=player.y+dy/n*70*dt;nx=Math.max(108,Math.min(533,nx));ny=Math.max(195,Math.min(298,ny));if(!(nx>273&&nx<381&&ny>249&&ny<294)){player.x=nx;player.y=ny}}frame++;}
    nearest=terminals.findIndex(t=>Math.hypot(player.x-t.x,player.y-(t.y+47))<29);const b=document.getElementById('interactButton');b.hidden=nearest<0||isPaused();draw();requestAnimationFrame(tick)}
  window.addEventListener('keydown',e=>{if(isPaused()||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(k)){e.preventDefault();keys.add(k)}if((k==='e'||k==='enter')&&nearest>=0){e.preventDefault();keys.clear();onInteract(nearest)}});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>keys.clear());
  canvas.addEventListener('click',e=>{if(isPaused())return;const b=canvas.getBoundingClientRect(),x=(e.clientX-b.left)*640/b.width,y=(e.clientY-b.top)*360/b.height;const i=terminals.findIndex(t=>Math.abs(t.x-x)<39&&y>t.y-53&&y<t.y+36);if(i>=0)onInteract(i)});document.getElementById('interactButton').onclick=()=>{if(nearest>=0)onInteract(nearest)};requestAnimationFrame(tick);
}
