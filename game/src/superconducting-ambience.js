import {KEY} from './superconducting/config.js';
import {normalize,isCooled} from './superconducting/model.js';
export function readSCSceneState(){try{return normalize(JSON.parse(localStorage.getItem(KEY)))}catch{return normalize()}}
// Decorative glints, not simulated temperature readings.
export function superconductingAmbience(state=readSCSceneState()){
 const points=[[46,17],[50,15],[54,20],[48,23],[52,27],[46,29],[54,31],[49,34],[51,38],[48,41],[52,44],[44,22],[56,25],[45,34],[55,37],[50,30]];
 return '<div class="sc-cold-glimmer '+(isCooled(state)?'sc-cold-online':'sc-cold-idle')+'" aria-hidden="true">'+points.map(([x,y],i)=>'<i class="sc-cold-pixel '+(i%3===0?'blue':'')+'" style="left:'+x+'%;top:'+y+'%;animation-delay:-'+i*.137+'s"></i>').join('')+'</div>';
}
