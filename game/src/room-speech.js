const timers=new WeakMap();
export function roomSpeech(el,text){
 clearTimeout(timers.get(el));el.setAttribute('aria-label',text);el.setAttribute('role','status');el.replaceChildren();
 const ink=document.createElement('span');ink.setAttribute('aria-hidden','true');el.append(ink);
 const letters=Array.from(text);let n=0;
 function tick(){const reduce=document.body.classList.contains('reduced')||matchMedia('(prefers-reduced-motion: reduce)').matches;n=reduce?letters.length:n+1;ink.textContent=letters.slice(0,n).join('');if(n<letters.length)timers.set(el,setTimeout(tick,30))}
 tick();
}
