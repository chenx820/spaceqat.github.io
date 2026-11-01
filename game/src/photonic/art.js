// Original 48×40 sprites: drawn on a small integer grid, enlarged without smoothing.
export function drawPart(canvas,id){const c=canvas.getContext('2d');c.clearRect(0,0,48,40);c.imageSmoothingEnabled=false;const r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h)},line=(x,y,w,color)=>r(x,y,w,2,color);r(4,31,40,5,'#211c2a');r(7,27,34,5,'#a96e3b');r(9,8,30,22,'#d6a260');r(12,11,24,16,'#28444b');r(9,8,30,3,'#f9d295');r(9,27,30,3,'#784423');
 if(id==='clock'){r(16,12,16,14,'#ffe1a4');r(23,13,2,8,'#5a3431');r(23,19,7,2,'#5a3431');r(5,14,4,4,'#f5bf61');r(39,20,4,4,'#f5bf61');}
 else if(id==='pump'){r(14,15,18,7,'#ad6c81');r(16,15,5,7,'#f1aec0');r(32,17,12,3,'#83ebe3');r(5,18,7,5,'#efd78b');}
 else if(id.startsWith('source')){r(14,12,20,13,id.endsWith('top')?'#28396b':'#50336e');line(16,18,16,'#9b85d5');line(24,15,2,'#9b85d5');for(const [x,y] of [[16,17],[23,17],[30,17],[23,12]])r(x,y,3,3,id.endsWith('top')?'#81e5ef':'#f1b3ed');r(17,3,14,5,'#a583c4');}
 else if(id==='delay_line'){for(let i=0;i<4;i++){r(14+i*5,12,3,14,'#7bdad8');r(14+i*5,12,5,2,'#e1f5bd');r(14+i*5,24,5,2,'#508eae')}r(19,32,10,3,'#ead6a1');}
 else if(id.startsWith('coupler')){r(14,17,22,5,'#8be6e5');r(20,12,5,15,'#a8bedc');r(16,15,13,9,'#617991');r(21,15,3,9,'#fff0b2');}
 else if(id==='fusion_bs'){for(let i=0;i<6;i++){r(15+i*3,12+i*2,4,3,'#c9ebf1');r(15+i*3,24-i*2,3,2,'#b494cf')}r(6,18,8,2,'#8be6e5');r(35,18,8,2,'#8be6e5');}
 else if(id.includes('detector')){r(14,13,8,11,'#adc5cf');r(16,15,4,7,'#171f31');r(26,13,7,6,id.includes('fusion')?'#ffd975':'#7de2cd');r(27,15,2,2,'#fff8d2');r(27,22,3,3,'#ae79c4');r(6,17,8,5,'#7f9cab');}
 else if(id==='herald_ctrl'){for(let i=0;i<4;i++)r(15+i%2*12,13+Math.floor(i/2)*8,5,5,['#8ed2bc','#ffd778','#67536e','#8ed2bc'][i]);}
 else if(id==='measurement_router'){r(14,14,20,2,'#82e9dd');r(14,23,20,2,'#82e9dd');for(let i=0;i<5;i++)r(18+i*2,15+i*2,3,2,'#f4ca7b');}
 else if(id.startsWith('analyzer')){r(17,12,14,14,'#d7bd86');r(20,14,8,10,'#32465b');for(let i=0;i<5;i++)r(19+i*2,22-i*2,3,3,id.endsWith('top')?'#7fe4ec':'#cba2e5');}
 else {r(15,14,17,3,'#9ed98a');r(29,16,3,8,'#9ed98a');r(17,22,15,3,'#9ed98a');r(15,20,4,7,'#f8da91');r(12,22,5,3,'#f8da91')}
 for(const [x,y] of [[9,8],[36,8],[9,27],[36,27]])r(x,y,2,2,'#fff1c1');
}
export function drawBench(canvas,rack=false){const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;c.imageSmoothingEnabled=false;c.fillStyle='#263c41';c.fillRect(0,0,w,h);for(let y=10;y<h;y+=12)for(let x=10;x<w;x+=12){c.fillStyle='#172a31';c.fillRect(x,y,2,2);c.fillStyle='#526464';c.fillRect(x,y+2,2,1)}c.fillStyle='#aa7950';c.fillRect(0,0,w,4);c.fillRect(0,h-4,w,4);c.fillRect(0,0,4,h);c.fillRect(w-4,0,4,h);c.fillStyle='#ead69e';for(const x of [4,w-8])for(const y of [4,h-8])c.fillRect(x,y,4,4);if(rack){c.fillStyle='#51494c';c.fillRect(5,h/2-2,w-10,4)}else{c.fillStyle='#46524c';c.fillRect(w*.47,5,3,h-10)}}
