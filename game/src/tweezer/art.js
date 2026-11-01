// Original 32px sprites, painted locally: no image downloads or external assets.
export function paintSprite(canvas,id,step=0){const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,32,32);const r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h)},edge='#2c211e',brass='#b87d3d',gold='#f3cb7f',blue='#56d8df',dark='#1e3541';
 r(4,27,24,3,'#241f23');
 if(id==='chassis'){r(1,7,30,19,edge);r(3,9,26,15,'#758077');r(5,11,22,11,'#3c5655');for(const x of [4,25])for(const y of [10,22])r(x,y,3,3,gold);}
 else if(id.startsWith('mirror')){r(9,24,14,3,brass);r(14,14,4,11,gold);r(6,4,20,17,edge);r(8,6,16,13,brass);c.save();c.translate(16,12);c.rotate(step*Math.PI/4);r(-10,-2,20,4,blue);r(-8,-2,14,1,'#effffa');c.restore();}
 else if(id==='laser'){r(2,10,27,15,edge);r(4,12,22,11,brass);r(5,12,18,3,gold);r(7,18,10,4,dark);for(let x=8;x<18;x+=3)r(x,18,1,4,gold);r(26,14,5,8,dark);r(28,16,3,4,blue);r(5,7,6,3,gold);r(20,16,3,3,'#99e550');}
 else if(id==='slm'){r(3,4,25,24,edge);r(5,6,21,20,brass);r(7,8,17,16,dark);for(let i=0;i<9;i++)r(9+i%3*5,9+Math.floor(i/3)*5,3,3,[1,3,4,5,7].includes(i)?blue:'#496375');for(let y=9;y<25;y+=5){r(0,y,3,2,gold);r(28,y,4,2,gold);}}
 else if(id==='dichroic'){r(10,25,14,3,brass);r(15,16,3,10,gold);for(let i=0;i<5;i++){r(7+i*3,4+i*3,5,5,edge);r(8+i*3,4+i*3,3,3,i%2?'#aa80d8':blue);}}
 else if(id==='objective'){r(3,9,26,16,edge);r(5,10,21,14,brass);for(const x of [6,12,18]){r(x,9,3,16,gold);r(x+1,12,1,9,'#93612f');}r(25,11,5,12,dark);r(28,13,3,8,blue);r(8,25,15,2,brass);}
 else if(id==='camera'){r(3,8,21,18,edge);r(5,10,17,14,'#40567c');r(5,5,9,4,brass);r(20,11,10,12,edge);r(22,13,8,8,'#916fbe');r(24,15,4,4,'#e2c3ff');r(7,12,8,5,blue);}
 else if(id==='power'){r(3,7,26,20,edge);r(5,9,22,16,brass);r(5,9,22,3,gold);[blue,'#99e550','#e97a47'].forEach((v,i)=>r(7+6*i,15,3,3,v));r(8,21,4,3,edge);r(20,21,4,3,edge);}
 else if(id==='controller'){r(2,7,28,20,edge);r(4,9,24,16,'#477b61');r(11,12,11,10,edge);r(13,14,7,6,'#72a6a3');for(let x=6;x<29;x+=4){r(x,26,2,3,gold);r(x,7,2,3,gold);}r(5,11,3,4,blue);}
 else {r(4,8,24,19,brass);r(6,10,20,15,gold);r(9,13,14,2,edge);r(9,18,14,2,edge);}
}
export function paintTable(canvas){const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;const r=(x,y,w,h,v)=>{c.fillStyle=v;c.fillRect(x,y,w,h)};r(0,0,500,280,'#6b472e');r(5,5,490,270,'#bc8b51');r(11,11,478,258,'#314e4d');r(16,16,468,248,'#3c5d58');for(let y=24;y<260;y+=16)for(let x=24;x<480;x+=16){r(x,y,2,2,'#243d3f');r(x+1,y+2,2,1,'#708579');}for(const x of [7,487])for(const y of [7,267])r(x,y,5,5,'#f3cb7f');
 // Vacuum chamber and built-in cooling/loading plumbing.
 r(411,72,62,53,'#20343a');r(415,70,54,57,'#b98948');r(419,75,46,46,'#e4c58a');r(424,80,36,36,'#152f3c');r(433,126,18,8,'#b98948');r(440,134,4,28,'#d0b77d');r(414,160,52,23,'#20343a');r(417,163,46,17,'#678785');r(420,167,13,8,'#80bcc0');r(441,165,17,3,'#d0b77d');r(441,171,17,3,'#d0b77d');
}
