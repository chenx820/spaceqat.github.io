// 1 = parity mismatch, 0 = parity match; null means not measured yet.
export function checkLights(values=[null,null]){
 return values.map((value,i)=>{
  const name=i?'B':'A',pair=i?'中 ↔ 右':'左 ↔ 中',state=value===null?'idle':value?'red':'green';
  const label=value===null?'尚未读取':value?'红灯，不同':'绿灯，相同';
  return `<div class="signal-unit" role="img" aria-label="共鸣水晶 ${name}：${label}" title="${name}：${label}"><b>${name}</b><div class="resonator-core" aria-hidden="true"><i class="signal-bulb ${state}"><i class="crystal-facet"></i></i><em class="resonance-mark">${value===null?'·':value?'×':'✓'}</em></div><small>${pair}</small></div>`;
 }).join('');
}
export const lightLegend='<p class="signal-legend"><i class="legend-red"></i> 红灯 × 不同 <i class="legend-green"></i> 绿灯 ✓ 相同</p>';

export function magicBoard(values=[null,null],error=-1,live=false){
 return `<div class="pixel-board"><div ${live?'id="logicalVisual"':''} class="pixel-bits ${live?'logical-visual':''}">${[0,1,2].map(i=>`<div class="pixel-bit ${i===error?'pixel-hit':''}"><span class="covered-lantern" style="--bob-delay:${i*.2}s" role="img" aria-label="${['左','中','右'][i]}侧罩布提灯，内部状态未读取"><i class="lantern-handle" aria-hidden="true"></i><i class="lantern-cap" aria-hidden="true"></i><i class="lantern-cloth" aria-hidden="true"><i></i></i><i class="lantern-foot" aria-hidden="true"></i></span><small>${['左','中','右'][i]}</small></div>`).join('')}</div><div class="pixel-wires" aria-hidden="true">${values.map((v,i)=>`<div class="conduit conduit-${i} ${v===null?'idle':v?'red':'green'}"><i></i></div>`).join('')}</div><div ${live?'id="correctionLamps"':''} class="check-lamps signal-lamps">${checkLights(values)}</div></div>`;
}
export function paintCheckLights(host,values=[null,null]){
 host.innerHTML=checkLights(values);
 host.closest('.pixel-board')?.querySelectorAll('.conduit').forEach((pipe,i)=>{pipe.className=`conduit conduit-${i} ${values[i]===null?'idle':values[i]?'red':'green'}`});
}
