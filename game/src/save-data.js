import {KEY as ion} from './ion/config.js';
import {KEY as photon} from './photonic/config.js';
import {KEY as sc} from './superconducting/config.js';
import {KEY as neutral} from './tweezer/config.js';
export const META='spaceqat-save-meta-v1';
export const ROOM='spaceqat-last-room-v1';
export const rooms=['entry','plaza','playroom','chapter','storage','observatory','deck','bridge','voyage','measurement','compiler','hardware','pulse','ops-sc','ops-neutral','ops-ion','ops-photon'];
export const keys=['spaceqat-chapter1-v1','spaceqat-adventure-v1','spaceqat-expedition-v2','spaceqat-campaign-v1',ion,photon,sc,neutral,'spaceqat-player-avatar-v1','spaceqat-storage-search-v1','spaceqat-story-restart-v1','spaceqat-opening-restart-v3',ROOM];
export function snapshot(storage){return Object.fromEntries(keys.map(k=>[k,storage.getItem(k)]).filter(([,v])=>v!==null))}
export function backup(storage){return {format:'spaceqat-save',version:1,exportedAt:new Date().toISOString(),data:snapshot(storage)}}
export function parseBackup(text){
 if(text.length>5000000)throw Error('存档文件过大（上限 5 MB）。');
 const b=JSON.parse(text);
 if(b?.format!=='spaceqat-save'||b.version!==1||!b.data||typeof b.data!=='object'||Array.isArray(b.data)||!Object.keys(b.data).length)throw Error('不是支持的 SpaceQat 存档文件。');
 for(const [k,v] of Object.entries(b.data)){
  if(!keys.includes(k)||typeof v!=='string')throw Error('存档包含不支持的字段。');
  if(k===ROOM){if(!rooms.includes(v))throw Error('存档房间无效。');}
  else if(k==='spaceqat-player-avatar-v1'){if(!['cat','man','woman','grandpa','grandma','boy','girl','alien','alien-purple'].includes(v))throw Error('存档角色无效。');}
  else if(k==='spaceqat-opening-restart-v3'){if(v!=='seen')throw Error('序章记录无效。');}
  else {const value=JSON.parse(v);if(!value||typeof value!=='object')throw Error('存档进度格式无效。');}
 }
 return b;
}
export function restore(storage,b){
 const before=snapshot(storage),meta=storage.getItem(META);
 try{for(const k of keys){if(k in b.data)storage.setItem(k,b.data[k]);else storage.removeItem(k)}storage.setItem(META,new Date().toISOString())}
 catch(error){try{for(const k of keys){if(k in before)storage.setItem(k,before[k]);else storage.removeItem(k)}if(meta===null)storage.removeItem(META);else storage.setItem(META,meta)}catch{throw Error('恢复失败且无法完整回滚，请保留导出的备份文件。')}throw Error('浏览器无法写入存档，已恢复原记录。')}
}
export function rememberRoom(room){if(rooms.includes(room))try{localStorage.setItem(ROOM,room)}catch{}}

