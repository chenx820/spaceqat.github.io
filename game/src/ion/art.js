import {pieces} from './config.js';
export function drawPart(canvas,id,angle=45){const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,64,48);const rect=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)},frame=(x,y,w,h,col)=>{rect(x,y,w,h,'#251e29');rect(x+2,y+2,w-4,h-4,'#b88b50');rect(x+4,y+4,w-8,h-8,col);rect(x+3,y+2,w-6,2,'#f3d59c')};rect(5,42,54,4,'#201b26');
 if(id==='trap_chip'){frame(5,7,54,32,'#aca991');rect(12,14,40,5,'#f3c56e');rect(12,28,40,5,'#d7a449');rect(12,20,40,6,'#283943');for(let x=12;x<53;x+=8){rect(x,10,5,3,'#edd6a0');rect(x,35,5,3,'#b68b53')}return}
 if(id.includes('feedthrough')){const rf=id.startsWith('rf');rect(22,4,20,36,'#7d6655');frame(9,12,46,23,rf?'#b56951':'#b68c43');for(let x=15;x<53;x+=7)rect(x,16,3,15,rf?'#f9a276':'#f3cd68');rect(26,7,12,4,'#e6ceac');return}
 if(id.includes('mirror')){rect(28,30,7,12,'#bc985b');frame(13,8,38,28,'#263b42');c.save();c.translate(32,22);c.rotate(angle*Math.PI/180);rect(-20,-2,40,4,id==='cooling_mirror'?'#82dce8':'#f5a68b');rect(-17,-2,34,1,'#fff2ce');c.restore();rect(18,40,30,4,'#c49b65');return}
 if(id==='collection_objective'){rect(7,17,39,18,'#b7b6a0');for(let x=10;x<43;x+=7)rect(x,14,3,24,'#d6c69d');frame(39,8,20,33,'#6c9ec7');rect(46,13,7,8,'#d7f2f1');return}
 if(id==='fluorescence_filter'){frame(15,4,35,34,'#34355d');rect(22,10,21,21,'#6c5ba6');rect(23,11,7,6,'#c6c1f2');rect(28,38,7,5,'#b8a06b');return}
 if(id==='beam_combiner'){frame(12,7,42,33,'#353c4f');rect(20,16,27,3,'#77d9e9');rect(20,23,27,3,'#eeb279');rect(20,30,27,3,'#c7677b');rect(43,16,4,17,'#e9e3b1');for(let y=14;y<=30;y+=8)rect(5,y,9,5,'#cfac67');rect(54,22,8,5,'#ece5ad');return}
 const p=pieces.find(p=>p.id===id),laser=p?.physicalRole==='laser';
 frame(5,8,54,33,laser?'#415553':'#39434b');
 if(laser){const index=['cooling_397','repump_866','quench_854','qubit_729'].indexOf(id),col=['#6edbe9','#eda572','#b65475','#f27c71'][index];rect(10,14,20,14,'#202e38');for(let x=12;x<28;x+=4)rect(x,18+(x%8),3,2,col);rect(35,15,15,14,col);rect(39,18,11,8,'#253039');rect(51,20,12,5,col);for(let x=11;x<47;x+=6)rect(x,33,2,4,'#debe77');rect(13+index*6,4,7,5,col);
 }else{rect(11,14,41,19,'#182b32');switch(id){
 case 'rf_driver':for(let x=13;x<50;x+=3)rect(x,23+Math.round(Math.sin(x/4)*5),3,2,'#f3936d');break;
 case 'dc_dac':for(let x=14;x<50;x+=7){rect(x,16,2,14,'#a08c62');rect(x-1,18+(x%5)*2,4,3,'#f1cc74')}break;
 case 'vacuum_monitor':for(let x=14;x<48;x+=7)rect(x,18,4,9,'#82d5ba');rect(43,28,5,2,'#c8e3bb');break;
 case 'pulse_sequencer':for(let y=17;y<32;y+=5){rect(13,y,34,1,['#74d2ec','#eda472','#bf96d8'][(y-17)/5]);rect(18+(y%3)*7,y-2,8,3,'#d9c799')}break;
 case 'ion_loader_console':for(let x of [22,40]){rect(x-5,18,10,10,'#508ba2');rect(x-2,21,4,4,'#e0ffff')}break;
 case 'photon_counter':for(let x=13;x<50;x+=6)rect(x,31-(x%7)*2,4,(x%7)*2+1,'#bb9bde');break;
 }for(let x=12;x<50;x+=9)rect(x,36,4,3,'#b8aa78')}
}
export function drawBoard(canvas,view,s){const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;const r=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};r(0,0,250,155,'#795036');r(3,3,244,149,'#c59860');r(6,6,238,143,view==='optics_bench'?'#3b5352':'#283b43');
 for(let x=9;x<245;x+=10)for(let y=9;y<148;y+=10){r(x,y,1,1,'#182c32');r(x+1,y+1,1,1,'#728176')}
 if(view==='trap_cutaway'){for(let y=0;y<112;y++){const dy=(y-56)/56,w=Math.floor(Math.sqrt(Math.max(0,1-dy*dy))*64);r(118-w,20+y,w*2,1,'#a88e63');const w2=Math.max(0,w-5);r(118-w2,20+y,w2*2,1,'#243946')}r(46,32,8,92,'#a8b2ac');r(177,32,8,92,'#abb8ad');for(let y=35;y<120;y+=17){r(48,y,4,4,'#f4d491');r(179,y,4,4,'#f4d491')}r(92,124,52,12,'#596d6d');r(97,126,42,3,'#c8b784');
 }else if(view==='control_rack'){for(let x of [35,148]){r(x,10,66,134,'#171d29');r(x,10,4,134,'#9b815a');r(x+62,10,4,134,'#b1a284');for(let y of [59,100,143])r(x,y,66,4,'#a3885f');}for(let x of [44,60,74,88,158,174,188,204])r(x,145,5,4,'#1e1c26')}
 for(let [x,y] of [[3,3],[243,3],[3,147],[243,147]]){r(x,y,4,4,'#f4d38d');r(x+1,y+1,2,2,'#90613a')}
}
export function drawMonitor(canvas,s,frame=0){const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;const r=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};r(0,0,240,120,'#25333f');for(let y=8;y<112;y++){const w=Math.floor(Math.sqrt(Math.max(0,1-((y-60)/52)**2))*105);r(120-w,y,2*w,1,'#b89e6d');r(124-w,y,Math.max(0,2*w-8),1,'#182f3b')}
 for(let y of [35,81]){r(40,y,160,5,'#e0ba6d');for(let x=45;x<200;x+=18)r(x,y+(y===35?8:-7),10,3,'#ac936b')}
 // Electric confinement changes with both independent field controls.
 r(37,50,3+s.rf,20,'#a05b4a');r(200-s.rf,50,3+s.rf,20,'#a05b4a');r(68,97,Math.max(2,s.dc*10),3,'#d3a751');
 for(let i=0;i<s.loaded;i++){let x=(s.loaded===1?120:100+i*40)+s.x*2,y=60+s.y;if(frame&&s.loaded){const jitter=!s.cooled?3:Math.abs(s.x)>1||Math.abs(s.y)>1?1:0;x+=((frame+i)%3-1)*jitter;y+=((frame+i)%2)*jitter}const dark=s.last?.[i]==='1';r(x-6,y-6,12,12,'#527586');r(x-4,y-4,8,8,dark?'#213949':'#8addeb');if(!dark)r(x-2,y-2,4,4,'#ecffed');}
 if(s.msRun){for(let x=95;x<146;x+=4)r(x,60+Math.round(Math.sin(x/5+(frame%8)*.5)*5),3,2,'#e4b98b')}
}
