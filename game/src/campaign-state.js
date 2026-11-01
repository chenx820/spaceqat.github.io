import {normalizeMeasurement} from './measurement-model.js';
import {normalizeCompiler} from './routing-model.js';
import {normalizeHardware} from './hardware-model.js';
import {normalizePulse} from './pulse-model.js';
export const CAMPAIGN_KEY='spaceqat-campaign-v1';
export function normalizeCampaign(raw={}){
 raw=raw&&typeof raw==='object'?raw:{};
 const completed=key=>Array.from({length:4},(_,i)=>raw[key]?.[i]===true);
 const done=completed('measurement'),compiler=completed('compiler'),hardware=completed('hardware');
 return {version:1,measurement:done,drafts:Array.from({length:4},(_,i)=>normalizeMeasurement(raw.drafts?.[i])),recordChipInstalled:done.every(Boolean)&&raw.recordChipInstalled===true,
 compiler,compilerDrafts:Array.from({length:4},(_,i)=>normalizeCompiler(raw.compilerDrafts?.[i])),routeDiskInstalled:compiler.every(Boolean)&&raw.routeDiskInstalled===true,
 hardware,hardwareDrafts:Array.from({length:4},(_,i)=>normalizeHardware(raw.hardwareDrafts?.[i])),arrayCrystalInstalled:hardware.every(Boolean)&&raw.arrayCrystalInstalled===true,
 pulse:completed('pulse'),pulseDrafts:Array.from({length:4},(_,i)=>normalizePulse(raw.pulseDrafts?.[i])),controlRingInstalled:completed('pulse').every(Boolean)&&raw.controlRingInstalled===true,endingSeen:raw.endingSeen===true};
}
export function canOpenMeasurement(state,index,bridgeComplete){return Number.isInteger(index)&&index>=0&&index<4&&bridgeComplete&&(index===0||state.measurement[index-1])}
export function saveCampaignSection(storage,current,section){
 const keys=section==='measurement'?['measurement','drafts','recordChipInstalled']:section==='compiler'?['compiler','compilerDrafts','routeDiskInstalled']:section==='hardware'?['hardware','hardwareDrafts','arrayCrystalInstalled']:section==='pulse'?['pulse','pulseDrafts','controlRingInstalled']:section==='ending'?['endingSeen']:null;if(!keys)throw Error('Unknown campaign section');
 let latest=current;const stored=storage.getItem(CAMPAIGN_KEY);if(stored){try{latest=normalizeCampaign(JSON.parse(stored))}catch{}}
 const merged={...latest};for(const key of keys)merged[key]=current[key];storage.setItem(CAMPAIGN_KEY,JSON.stringify(merged));return merged;
}
