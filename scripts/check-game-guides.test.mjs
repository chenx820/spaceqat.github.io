import test from 'node:test';import assert from 'node:assert/strict';import {tours,guideStops,guideDestination,createRoomGuide} from '../game/src/room-guides.js';import {movePosition,distance,constrainPosition} from '../game/src/navigation.js';
test('central plaza and every adjacent room have guided introductions',()=>{
 for(const room of ['plaza','playroom','chapter','storage','observatory','bridge','deck']){
  assert.ok(tours[room]?.length>=3,room);
  assert.ok(tours[room].every(text=>typeof text==='string'&&text.length>0),room);
 }
 const {player,npc}=guideDestination('chapter');
 for(const point of [player,npc]){assert.ok(point.x*6.4>=88&&point.x*6.4<=546);assert.ok(point.y*3.6>=193&&point.y*3.6<=326)}
});
test('moving before the greeting keeps the guide following; greeting waits for idle',()=>{
 const old=globalThis.document;const element=()=>({classList:{add(){},remove(){}},style:{},append(){},remove(){},setAttribute(){},querySelector(){return {}}});
 globalThis.document={createElement:element};let finished=0,greeted=0;let player={x:60,y:75};const npc={x:35,y:60,button:element()};
 try{const guide=createRoomGuide({host:{querySelector:element},room:'ops-sc',npc,getPlayer:()=>player,walk(){},cancelWalk(){},onFinish(){finished++},onGreet(){greeted++},reduced:()=>true});
 guide.interruptMovement();for(let i=0;i<160;i++)guide.tick(.04,true);
 assert.equal(finished,0);assert.equal(greeted,0);assert.ok(npc.x>40);
 player={x:70,y:70};for(let i=0;i<200;i++)guide.tick(.04,false);
 assert.equal(greeted,1);assert.equal(finished,0);guide.cancel();assert.equal(finished,1);
 }finally{globalThis.document=old}
});
test('every guided destination is reachable from the room entry without changing rooms',()=>{for(const room of Object.keys(tours)){const {player,npc}=guideDestination(room);assert.deepEqual(constrainPosition(room,npc.x,npc.y),npc);let pos={x:50,y:74};for(let i=0;i<300&&distance(pos,player)>.5;i++)pos=movePosition(room,pos,player.x-pos.x,(player.y-pos.y)*9/16,.04);assert.ok(distance(pos,player)<1,room);assert.ok(distance(player,npc)>=6,room+' guide does not overlap player')}});


test('each narrated stop has a reachable facility destination, not a shared room centre',()=>{for(const [room,stops] of Object.entries(guideStops)){let pos={x:50,y:74};for(let page=1;page<=stops.length;page++){const goal=guideDestination(room,page);assert.ok(goal.label);for(let n=0;n<600&&distance(pos,goal.player)>.5;n++)pos=movePosition(room,pos,goal.player.x-pos.x,(goal.player.y-pos.y)*9/16,.04);assert.ok(distance(pos,goal.player)<1,room+' stop '+page);assert.ok(distance(goal.player,goal.npc)>=6)}}assert.notDeepEqual(guideDestination('storage',1).player,guideDestination('storage',2).player);});
