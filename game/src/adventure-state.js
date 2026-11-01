export const ADVENTURE_KEY='spaceqat-adventure-v1';
export function normalizeAdventure(raw={}){return {version:1,introSeen:raw.introSeen===true,items:['lens','cell'].filter(x=>Array.isArray(raw.items)&&raw.items.includes(x)),beacon:raw.beacon===true&&['lens','cell'].every(x=>raw.items?.includes(x))}}
export function collectItem(state,id){if(!['lens','cell'].includes(id)||state.items.includes(id))return false;state.items.push(id);return true}
export function activateBeacon(state){if(!['lens','cell'].every(x=>state.items.includes(x)))return false;state.beacon=true;return true}
