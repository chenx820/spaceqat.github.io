// Pure-state display: theta is polar angle, phi is relative phase (radians).
export function blochVector(theta,phi){return [Math.sin(theta)*Math.cos(phi),Math.sin(theta)*Math.sin(phi),Math.cos(theta)]}
export function probabilityOne(theta){return (1-Math.cos(theta))/2}
export function createBloch(host){
 host.innerHTML=`<div class="pixel-orrery"><span class="orrery-pole">0 · 北极</span><canvas width="96" height="104" role="img" aria-label="黄铜星象仪：光束表示量子状态"></canvas><span class="equator-label">赤道 · 0 / 1 各半</span><span class="orrery-pole">1 · 南极</span></div><p class="bloch-readout" aria-live="polite"></p>`;
 let theta=0,phi=0,raf=0,trail=[],flash=0;const ctx=host.querySelector('canvas').getContext('2d');ctx.imageSmoothingEnabled=false;
 const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h)};
 function ring(rx,ry,c,dashed=false){for(let i=0;i<240;i++){if(dashed&&Math.floor(i/8)%2)continue;const a=i*Math.PI/120;rect(48+rx*Math.cos(a),43+ry*Math.sin(a),1,1,c)}}
 function beam(x1,y1,x2,y2,c,size=1){const n=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));for(let i=0;i<=n;i++){const f=n?i/n:0;rect(x1+(x2-x1)*f,y1+(y2-y1)*f,size,size,c)}}
 function draw(){ctx.clearRect(0,0,96,104);
 // Integer scanlines keep the globe, rings and brass stand on the same pixel grid.
 for(let y=-32;y<=32;y++){const w=Math.floor(Math.sqrt(32*32-y*y));rect(48-w,43+y,w*2+1,1,y<-10?'#4b425c':'#393246')}
 rect(44,77,9,13,'#9e6b1b');rect(46,77,3,11,'#f5c542');rect(34,88,29,4,'#d8a34c');rect(28,92,41,5,'#8c5230');rect(25,97,47,4,'#3d2314');rect(29,92,39,2,'#f0c877');
 ring(35,35,'#9e6b1b');ring(34,34,'#f0c877');ring(32,10,flash%2?'#4deeea':'#927b9e',true);ring(12,32,'#b5a4c7');beam(48,11,48,75,'#736882');beam(16,43,80,43,'#736882');
 rect(29,22,4,4,'#ffffff');rect(25,28,3,5,'#d4c9e4');rect(35,19,2,2,'#ffffff');
 const [x,y,z]=blochVector(theta,phi),px=Math.round(48+31*x+8*y),py=Math.round(43-31*z+8*y);
 trail.forEach(([tx,ty],i)=>{ctx.globalAlpha=.08+.06*i;beam(48,43,tx,ty,'#4deeea',2)});ctx.globalAlpha=1;
 beam(46,41,px-2,py-2,'#102630',6);beam(48,43,px,py,'#4deeea',2);
 for(let row=-4;row<=4;row++){const w=4-Math.abs(row);rect(px-w,py+row,w*2+1,1,'#102630')}
 for(let row=-3;row<=3;row++){const w=3-Math.abs(row);rect(px-w,py+row,w*2+1,1,'#4deeea')}
 rect(px-1,py-2,2,2,flash%2?'#4deeea':'#ffffff');rect(46,41,4,4,'#102630');
 host.querySelector('.pixel-orrery').classList.toggle('at-equator',Math.abs(z)<.001);
 const p=Math.round(probabilityOne(theta)*100);host.querySelector('.bloch-readout').textContent=`此状态直接测量：0 约 ${100-p}% · 1 约 ${p}%`}
 draw();return {set(t,p=0,animate=true){cancelAnimationFrame(raf);trail=[];flash=0;const a=theta,b=phi,start=performance.now();let previous=-1;const reduce=document.body.classList.contains('reduced')||matchMedia('(prefers-reduced-motion: reduce)').matches;
 function tick(now){const elapsed=now-start,f=!animate||reduce?1:Math.min(1,elapsed/850),frame=Math.floor(f*8),e=frame/8;
 if(frame!==previous){if(animate&&!reduce&&frame>0&&(a!==t||b!==p)){const [x,y,z]=blochVector(theta,phi);trail.push([Math.round(48+31*x+8*y),Math.round(43-31*z+8*y)]);trail=trail.slice(-5)}theta=a+(t-a)*e;phi=b+(p-b)*e;previous=frame}
 if(f===1){trail=[];flash=animate&&!reduce&&Math.abs(Math.cos(t))<.001?Math.max(0,6-Math.floor((elapsed-850)/100)):0}draw();if(f<1||flash>0)raf=requestAnimationFrame(tick)}
 if(!animate||reduce){theta=t;phi=p;draw()}else raf=requestAnimationFrame(tick)},stop(){cancelAnimationFrame(raf);trail=[];flash=0;draw()}};
}
