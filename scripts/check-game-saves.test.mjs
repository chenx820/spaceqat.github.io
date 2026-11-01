import test from 'node:test';
import assert from 'node:assert/strict';
import {backup,parseBackup,restore,ROOM,keys} from '../game/src/save-data.js';
function memory(init={}){const m=new Map(Object.entries(init));return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}}
test('save backup round trip includes all progress keys, room and avatar; excludes unrelated data',()=>{
 const s=memory(Object.fromEntries(keys.map(k=>[k,k===ROOM?'chapter':k.includes('player-avatar')?'alien-purple':k.includes('opening-restart')?'seen':'{}'])));s.setItem('other-site','private');const b=parseBackup(JSON.stringify(backup(s)));assert.equal(b.data['other-site'],undefined);assert.equal(Object.keys(b.data).length,keys.length);const dest=memory({'other-site':'keep'});restore(dest,b);for(const k of keys)assert.equal(dest.getItem(k),s.getItem(k));assert.equal(dest.getItem('other-site'),'keep');
});
test('save rejects malformed, foreign and future files before writes',()=>{for(const text of ['bad','{}',JSON.stringify({format:'spaceqat-save',version:2,data:{[ROOM]:'chapter'}}),JSON.stringify({format:'spaceqat-save',version:1,data:{[ROOM]:'fake'}}),JSON.stringify({format:'spaceqat-save',version:1,data:{other:'x'}})])assert.throws(()=>parseBackup(text))});
test('failed import rolls back previous progress and room',()=>{const s=memory({[ROOM]:'storage','spaceqat-chapter1-v1':'{"version":1}'});const original=s.setItem;let fail=true;s.setItem=(k,v)=>{if(k===ROOM&&fail){fail=false;throw Error('quota')}return original(k,v)};assert.throws(()=>restore(s,{data:{[ROOM]:'chapter'}}));assert.equal(s.getItem(ROOM),'storage');assert.equal(s.getItem('spaceqat-chapter1-v1'),'{"version":1}');});
