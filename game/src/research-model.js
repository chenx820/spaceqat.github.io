import {levels} from './levels.js';
import {bridgeNames,bridgeLessons,measurementNotes,compilerNotes,hardwareNotes,pulseNotes} from './chapter-knowledge.js';
import {measurementNames} from './measurement-model.js';
import {compilerNames} from './routing-model.js';
import {hardwareNames} from './hardware-model.js';
import {pulseNames} from './pulse-model.js';
import {normalizeCampaign} from './campaign-state.js';
import {normalizeExpedition} from './expedition-state.js';
export const chapterCatalog=[
 {name:'态制备舱',names:levels.map(l=>l.name),notes:levels.map(l=>l.knowledge)},
 {name:'纠缠桥',names:bridgeNames,notes:bridgeLessons.map(l=>l[1]+' '+l[2])},
 {name:'测量港',names:measurementNames,notes:measurementNotes},
 {name:'编译工坊',names:compilerNames,notes:compilerNotes},
 {name:'硬件调度台',names:hardwareNames,notes:hardwareNotes},
 {name:'脉冲核心',names:pulseNames,notes:pulseNotes}
];
export function researchProgress(first,second,campaign){
 const e=normalizeExpedition(second),c=normalizeCampaign(campaign),done=[Array.from({length:4},(_,i)=>Number.isInteger(first?.stars?.[i])&&first.stars[i]>0),e.done,c.measurement,c.compiler,c.hardware,c.pulse];
 return {chapters:chapterCatalog.map((chapter,j)=>({...chapter,completed:done[j].filter(Boolean).length,cards:chapter.names.map((name,i)=>({name,code:`0${j+1}-${i+1}`,done:done[j][i],note:done[j][i]?chapter.notes[i]:null,stars:j===0?Math.max(0,Math.min(3,Number.isInteger(first?.stars?.[i])?first.stars[i]:0)):null}))})),total:done.flat().filter(Boolean).length,corrected:e.corrected,installed:e.installed,runs:e.runs,upgrades:[c.recordChipInstalled,c.routeDiskInstalled,c.arrayCrystalInstalled,c.controlRingInstalled]};
}
