export function outcomeChart(probabilities,counts,basis){
 const total=counts.reduce((a,b)=>a+b,0);
 return probabilities.map((p,j)=>{
  const symbols=basis==='XX'?['++','+−','−+','−−'][j]:['00','01','10','11'][j];
  const badges=[...symbols].map(c=>`<b class="outcome-bit ${c==='+'||c==='0'?'cool':'warm'}">${c}</b>`).join('');
  const frequency=total?counts[j]/total*100:0;
  return `<div class="outcome-card"><strong class="outcome-badges" aria-label="测量结果 ${symbols}">${badges}</strong><div class="bridge-track" aria-label="样本频率 ${frequency.toFixed(2)}%，理论 ${(p*100).toFixed(2)}%"><i style="width:${frequency}%"></i><em class="theory-tick" style="left:clamp(0px,calc(${p*100}% - 1px),calc(100% - 3px))"></em></div><span>理论 ${(p*100).toFixed(0)}% · 样本 ${counts[j]}/${total}</span></div>`;
 }).join('');
}
export function inputLamps(values){return `<div class="rail-input">${values.map((v,i)=>`<div class="input-line"><span>q${i}</span><i class="input-lamp ${v==='1'?'lit':v==='+'?'superposed':v==='?'?'mixed':'dark'}" aria-hidden="true"></i><b>${v==='?'?'混合':`|${v}⟩`}</b></div>`).join('')}</div>`}
export const cxSwitch='<span class="cx-structure" aria-hidden="true"><i class="cx-pillar"></i><i class="cx-control"></i><i class="cx-target"></i></span><b class="cx-tag">CX</b><small>已接入</small>';
export const dualDetector='<div class="dual-detector" role="img" aria-label="q0 与 q1 双轨探测器"><i class="detector-dial"></i><i class="detector-dial"></i><small>双轨测量</small></div>';
