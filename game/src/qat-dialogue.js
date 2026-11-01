import {drawCat} from './cozy-world.js';

export function qatDialogue(root,text){
 const heading=root.querySelector('.workbench-head>div');
 if(!heading)return;
 heading.querySelector('.qat-npc')?.remove();heading.classList.toggle('qat-speaking',!!text);
 if(!text)return;
 const npc=document.createElement('div');npc.className='qat-npc';
 npc.innerHTML='<div class="qat-portrait-frame"><canvas width="40" height="36" role="img" aria-label="Qat：黑色小猫，黄绿色眼睛"></canvas><b>QAT</b></div><div class="qat-speech"><span class="qat-line"></span></div>';
 npc.querySelector('.qat-line').textContent=text;heading.prepend(npc);
 const canvas=npc.querySelector('canvas'),ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.fillStyle='#d9b875';ctx.fillRect(0,0,40,36);drawCat(ctx,6,5,1,0);
}
