import {stable,complete} from './model.js';
export const progressCounts=s=>[s.owned.length,s.installed.length,s.connections.length,s.clamps.length,complete(s)?1:0];
export const increasedBadges=(before,after)=>after.flatMap((n,i)=>n>before[i]?[i]:[]);
export function soundEnabled(storage=globalThis.localStorage){try{return JSON.parse(storage?.getItem('spaceqat-chapter1-v1'))?.settings?.muted===false}catch{return false}}
export function createChime(){let context=null;return {play(){if(!soundEnabled())return;try{context??=new AudioContext();context.resume().catch(()=>{});const now=context.currentTime;[784,1175].forEach((frequency,i)=>{const o=context.createOscillator(),g=context.createGain(),t=now+i*.09;o.type='triangle';o.frequency.setValueAtTime(frequency,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.025,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+.16);o.connect(g).connect(context.destination);o.onended=()=>{o.disconnect();g.disconnect()};o.start(t);o.stop(t+.18)})}catch{}},dispose(){context?.close().catch(()=>{});context=null}}}
export function drawField(canvas,s,frame=0){const c=canvas.getContext('2d');c.clearRect(0,0,250,155);if(!stable(s))return;c.imageSmoothingEnabled=false;
 // Decorative field indicator, not particle trajectories or a computed RF field.
 for(let i=0;i<24;i++){const angle=i*Math.PI/12,x=Math.round(118+54*Math.cos(angle)),y=Math.round(76+45*Math.sin(angle)),bright=(i+frame)%12<2;c.fillStyle=bright?'#82b6b7':'#39555e';c.fillRect(x,y,bright?2:1,bright?2:1);if(bright&&s.loaded===2){c.fillStyle='#b6bc8d';c.fillRect(x-3,y+3,1,1)}}
 for(const [x,y]of [[45,42],[200,42]]){c.fillStyle=frame%8<3?'#90b7a9':'#536c68';c.fillRect(x-2,y+10,2,2);c.fillRect(x+2,y+13,2,2)}
}
