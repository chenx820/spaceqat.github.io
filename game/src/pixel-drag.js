// Pointer events support mouse, pen and touch. The original button remains a keyboard fallback.
export function bindPixelDrop(source,target,onDrop){
 let start=null,ghost=null,moved=false,suppressClick=false;
 function clean(){ghost?.remove();ghost=null;source.classList.remove('is-dragging');target.classList.remove('drop-ready');start=null;}
 source.addEventListener('pointerdown',e=>{if(e.button!==0||source.disabled)return;start={x:e.clientX,y:e.clientY,id:e.pointerId};moved=false;suppressClick=false;source.setPointerCapture(e.pointerId);});
 source.addEventListener('pointermove',e=>{if(!start||start.id!==e.pointerId)return;if(!moved&&Math.hypot(e.clientX-start.x,e.clientY-start.y)<6)return;moved=true;if(!ghost){ghost=source.cloneNode(true);ghost.removeAttribute('id');ghost.removeAttribute('data-pact');ghost.classList.add('pixel-drag-ghost');ghost.setAttribute('aria-hidden','true');ghost.tabIndex=-1;(source.closest('dialog[open]')||source.ownerDocument.body).append(ghost);source.classList.add('is-dragging');target.classList.add('drop-ready');}ghost.style.left=4*Math.round(e.clientX/4)+'px';ghost.style.top=4*Math.round(e.clientY/4)+'px';});
 source.addEventListener('pointerup',e=>{if(!start||start.id!==e.pointerId)return;const r=target.getBoundingClientRect(),inside=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;const drop=moved&&inside;suppressClick=moved;clean();if(drop)onDrop();});
 source.addEventListener('pointercancel',()=>{suppressClick=moved;clean();});
 source.addEventListener('lostpointercapture',clean);
 source.addEventListener('click',e=>{if(suppressClick){suppressClick=false;if(e.detail===0)return;e.preventDefault();e.stopImmediatePropagation();}},true);
}
