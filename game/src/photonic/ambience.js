import {KEY} from './config.js';
import {normalize,operational,complete} from './model.js';
export function readPhotonScene(){try{return normalize(JSON.parse(localStorage.getItem(KEY)))}catch{return normalize()}}
export function photonCaption(s){return complete(s)?'星光织网台运行中 · 光路 / 符合探测 / 经典前馈已验证 · 本地教学演示':operational(s)?'星光织网台已同步 · 等待测量、前馈与验证':'星光织网台待修复 · 搜寻 / 装配 / 同步 / 测量';}
export function photonAmbience(s){const running=complete(s);return `<div class="ph-room-system ${running?'running':s.powered?'powered':'standby'}" aria-hidden="true"><div class="ph-room-status">${running?'● MBQC · 运行':'○ MBQC · 待验证'}</div>${running?`<div class="ph-room-path top"></div><div class="ph-room-path bottom"></div><div class="ph-room-feedback"></div>${[0,1,2].map(i=>`<b class="ph-detector-light" style="left:65%;top:${26+i*5.7}%;--i:${i}"></b>`).join('')}<div class="ph-room-graph">${Array.from({length:6},(_,i)=>'<b>◆</b>').join('')}</div><div class="ph-room-reactor"></div>`:''}</div>`}
