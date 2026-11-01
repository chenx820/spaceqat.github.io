// Sixteen-pixel shutters: opaque cover, scene swap, then reveal. No opacity fade.
export function shutterWidth(progress,width){return Math.min(width,Math.ceil(Math.max(0,Math.min(1,progress))*width/16)*16)}
export async function pixelTransition(swap,reduced=false){
 if(reduced){swap();return}
 const canvas=document.createElement('canvas');canvas.className='pixel-scene-wipe';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);
 const ctx=canvas.getContext('2d');
 const paint=p=>{canvas.width=innerWidth;canvas.height=innerHeight;ctx.fillStyle='#12101b';const w=shutterWidth(p,canvas.width);for(let y=0;y<canvas.height;y+=16)ctx.fillRect((y/16)%2?canvas.width-w:0,y,w,16)};
 const wait=()=>new Promise(resolve=>setTimeout(resolve,40));
 try{for(let i=1;i<=8;i++){paint(i/8);await wait()}swap();for(let i=8;i>=0;i--){paint(i/8);await wait()}}
 finally{canvas.remove()}
}
