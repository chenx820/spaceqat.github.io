// Ambient decorations stay separate from hardware status overlays.
export const ambientRooms=['plaza','playroom','storage','observatory','bridge','deck','measurement','compiler','hardware','pulse','ops-sc','ops-neutral','ops-ion','ops-photon'];
const starRooms=new Set(['plaza','playroom','observatory','deck','bridge','ops-sc']);
const runeRooms=new Set(['plaza','deck','bridge']);
export function roomAtmosphere(room){
 if(!ambientRooms.includes(room))return '';
 const starX=room==='ops-sc'?[17,21,25,29,72,76,80,84]:[17,26,35,44,53,62,71,80];
 return `<div class="shared-room-atmosphere" aria-hidden="true">${starRooms.has(room)?'<div class="room-window-sparks">'+starX.map((x,i)=>`<i style="left:${x}%;top:${3+i%3*2}%"></i>`).join('')+'</div>':''}<div class="voyage-torches">${[[4,35],[96,35],[8,70],[92,70]].map(([x,y],i)=>`<i style="left:${x}%;top:${y}%;animation-delay:-${i*.2}s"></i>`).join('')}</div>${runeRooms.has(room)?'<div class="voyage-runes">'+[[42,65],[58,65],[50,74]].map(([x,y],i)=>`<i style="left:${x}%;top:${y}%;animation-delay:-${i*.7}s"></i>`).join('')+'</div>':''}</div>`;
}
