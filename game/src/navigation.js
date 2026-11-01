// Coordinates are percentages of a 16:9 scene; constrain feet to walkable floor.
const campaignRooms=new Set(['measurement','compiler','hardware','pulse']);
export function constrainPosition(room,x,y){
 if(room==='chapter')return {x:Math.max(88/6.4,Math.min(546/6.4,x)),y:Math.max(193/3.6,Math.min(326/3.6,y))};
 if(room==='voyage')return {x:Math.max(8,Math.min(92,x)),y:Math.max(39,Math.min(89,y))};
 if(campaignRooms.has(room)){x=Math.max(12,Math.min(88,x));return {x,y:Math.max(60,Math.min(Math.abs(x-50)<=6?89:80,y))};}
 const minY=room==='entry'?61:['plaza','deck'].includes(room)?47:room==='playroom'?60:['storage','observatory','bridge'].includes(room)?56:60;
 y=Math.max(minY,Math.min(89,y));
 const half=room==='entry'?7+(y-61)*.43:['plaza','deck'].includes(room)?40:38;
 return {x:Math.max(50-half,Math.min(50+half,x)),y};
}
export function movePosition(room,pos,dx,dy,dt){const n=Math.hypot(dx,dy);if(!n)return {...pos};let x=pos.x+dx/n*18*dt;const y=pos.y+dy/n*32*dt;if(campaignRooms.has(room)&&pos.y>80&&y>80)x=Math.max(44,Math.min(56,x));return constrainPosition(room,x,y)}
export function distance(a,b){return Math.hypot(a.x-b.x,(a.y-b.y)*9/16)}

// Click destinations and keyboard proximity share the same reachable floor point.
// The former universal +20 placed small cabinets' interaction centres far away.
export function interactionPoint(room,x,y,kind='door'){
 const offset=kind==='room-exit'?0:kind==='npc'?4:8;
 return constrainPosition(room,x,kind==='airlock'?64:y+offset);
}
