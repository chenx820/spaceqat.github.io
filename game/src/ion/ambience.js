import {KEY} from './config.js';
import {normalize,complete} from './model.js';
export function readIonScene(storage=globalThis.localStorage){try{return normalize(JSON.parse(storage?.getItem(KEY)))}catch{return normalize(null)}}
export function ionAmbience(s){return '<div class="it-room-state '+(complete(s)?'completed':'')+'" aria-hidden="true">'+Array.from({length:s.loaded},()=>'<i></i>').join('')+'</div>'}
export function ionCaption(s){return complete(s)?'双星线性保罗阱运行中 · ZZ / XX 已验证 · 本地理想模拟':'双星线性保罗阱 · '+s.installed.length+'/18 装配 · '+s.connections.length+'/16 接线'}
