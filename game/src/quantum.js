// Chapter one uses real amplitudes; complex gates must extend this model explicitly.
export function simulate(gates, thetaDegrees = 0) {
  if (!Number.isFinite(thetaDegrees) || thetaDegrees < 0 || thetaDegrees > 180) throw new Error('Angle outside chapter range');
  let state = [1, 0];
  const snapshots = [];
  for (const gate of gates) {
    if (!gate) continue;
    const [a,b] = state;
    switch(gate) {
      case 'X': state = [b,a]; break;
      case 'H': state = [(a+b)/Math.SQRT2,(a-b)/Math.SQRT2]; break;
      case 'Z': state = [a,-b]; break;
      case 'RY': { const t = thetaDegrees * Math.PI / 360; state = [Math.cos(t)*a-Math.sin(t)*b,Math.sin(t)*a+Math.cos(t)*b]; break; }
      default: throw new Error(`Unsupported gate: ${gate}`);
    }
    snapshots.push({ gate, state: [...state] });
  }
  return { state, probabilities: state.map(a=>a*a), snapshots };
}
export function judge(level, result) {
  if(level===0 || level===2) return result.probabilities[1] >= 1-1e-9;
  if(level===1) return ((result.state[0]+result.state[1])/Math.SQRT2)**2 >= 1-1e-9;
  return result.probabilities[1]>=.73-1e-9 && result.probabilities[1]<=.77+1e-9;
}
export function sample(probabilities, shots, seed) {
  if(![32,64,256].includes(shots)) throw new Error('Unsupported shot count');
  let s=seed>>>0; let ones=0;
  for(let i=0;i<shots;i++) { s=(Math.imul(s,1664525)+1013904223)>>>0; if(s/4294967296<probabilities[1]) ones++; }
  return [shots-ones,ones];
}
