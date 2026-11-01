import {normalize} from './tweezer/model.js';
import {KEY} from './tweezer/config.js';
export function readNeutralSceneState(storage=localStorage){try{return normalize(JSON.parse(storage.getItem(KEY)))}catch{return normalize()}}
// Positions are percentages of the 16:9 neutral-atom room artwork.
export function neutralAmbience(state=readNeutralSceneState()){
 const active=state.completed===true;
 const grid='<div class="neutral-live-array">'+Array.from({length:9},(_,i)=>'<b class="'+([1,3,4,5,7].includes(i)?'trap ':'')+(active&&[1,4,7].includes(i)?'occupied':'')+'"></b>').join('')+'</div>';
 const dot=(kind,x,y,i)=>`<i class="${kind}" style="left:${x}%;top:${y}%;--phase:${i}" aria-hidden="true"></i>`;
 const lasers=[[32.4,30],[34,33],[35,30.5],[38,30.5],[40.7,30.5],[59.3,30.5],[62,30.5],[65.6,30.5],[68.7,30.5],[70.4,34],[70.4,37.2],[67.5,37.2],[65.5,37.2],[62.2,37.2],[35.5,37.2],[32.5,37.2]];
 const atoms=[[48.9,29,0.65,1.05],[59.2,9.8,1.3,2.2],[10.8,21.6,.6,1.1]].flatMap(([x,y,dx,dy])=>Array.from({length:16},(_,i)=>dot('atom-glimmer',x+i%4*dx,y+Math.floor(i/4)*dy,i)));
 return `<div class="neutral-vfx ${active?'is-running':'is-standby'}" aria-hidden="true"><div class="machine-halo"><div></div></div>${lasers.map(([x,y],i)=>dot('laser-mote',x,y,i)).join('')}${active?atoms.join(''):''}<div class="neutral-live-monitor">${grid}</div>${active?'<div class="neutral-running-lights"><b></b><b></b><b></b></div>':''}${[[3,19],[23.3,7],[76.6,7],[97,19],[44.2,94],[55.8,94]].map(([x,y],i)=>dot('lamp-halo',x,y,i)).join('')}</div>`;
}
