import {KEY,pieces,hotspots,wires,ports,pattern,opticalPath} from './config.js';
export const initial=()=>({schemaVersion:1,phase:'intro',blueprintViewed:false,foundChassis:false,chassisInstalled:false,openedHotspots:[],pieces:Object.fromEntries(pieces.map(p=>[p.id,'unknown'])),connectedWires:[],mirrorSteps:{mirror1:0,mirror2:0},slmCells:Array(9).fill(false),focus:25,powerOn:false,hasPlayedCaptureAnimation:false,captureOccupiedCells:[],completed:false});
export const areAllPiecesInstalled=s=>pieces.every(p=>s.pieces[p.id]==='installed');
export const areAllWiresConnected=s=>wires.every(w=>s.connectedWires.includes(w.id));
export const areMirrorsAligned=s=>s.pieces.mirror1==='installed'&&s.pieces.mirror2==='installed'&&s.mirrorSteps.mirror1===1&&s.mirrorSteps.mirror2===3;
export const isSlmPatternValid=s=>s.pieces.slm==='installed'&&pattern.every((v,i)=>s.slmCells[i]===v);
export const isFocusValid=s=>s.pieces.objective==='installed'&&s.focus>=55&&s.focus<=70;
export const canPowerOn=s=>['power','controller','laser'].every(id=>s.pieces[id]==='installed')&&['laserPower','controllerPower'].every(id=>s.connectedWires.includes(id));
export const canStartCapture=s=>s.chassisInstalled&&areAllPiecesInstalled(s)&&areAllWiresConnected(s)&&areMirrorsAligned(s)&&isSlmPatternValid(s)&&isFocusValid(s)&&s.powerOn;
export const cameraOnline=s=>s.powerOn&&s.pieces.camera==='installed'&&s.connectedWires.includes('cameraData');
export function missing(s){return [!s.chassisInstalled&&'固定底座',!areAllPiecesInstalled(s)&&'装齐9件零件',!areAllWiresConnected(s)&&'接齐4条电缆',!areMirrorsAligned(s)&&'调整两面镜子',!isSlmPatternValid(s)&&'设置十字图案',!isFocusValid(s)&&'调焦55–70',!s.powerOn&&'打开电源'].filter(Boolean)}
export function getNextObjective(s){if(!s.blueprintViewed)return '先看墙上的蓝图';if(!s.foundChassis)return '找左侧橡木工具箱，取出主机底座';if(!s.chassisInstalled)return '把背包里的主机底座放到工作台中央';if(s.completed)return '5个光阱、3个原子！可查看知识卡或继续主线';const unfound=pieces.find(p=>s.pieces[p.id]==='unknown');return unfound?`寻找${unfound.name}：${hotspots.find(h=>h.id===unfound.hotspot).name}`:missing(s)[0]||'条件齐全，启动原子捕获'}
export function moduleStatus(s){return s.completed?'已完成捕获':s.powerOn?'已激活':s.chassisInstalled?'装配中':s.foundChassis?'已找到':'未找到'}
function phase(s){return s.completed?'completed':canStartCapture(s)?'ready':areAllPiecesInstalled(s)?'wiring_and_calibration':s.chassisInstalled?'assembly':s.foundChassis?'chassis_placement':s.blueprintViewed?'exploration':'intro'}
export function lightPath(s){if(!s.powerOn||s.pieces.laser!=='installed')return [];const out=['laser'];for(const id of opticalPath.slice(1)){if(id!=='atomChamber'&&s.pieces[id]!=='installed')break;out.push(id);if(id==='mirror1'&&s.mirrorSteps.mirror1!==1||id==='mirror2'&&s.mirrorSteps.mirror2!==3||id==='slm'&&!s.connectedWires.includes('slmControl'))break;}return out}
export function normalize(raw){const s=initial();if(!raw||raw.schemaVersion!==1)return s;
 s.blueprintViewed=raw.blueprintViewed===true;s.openedHotspots=hotspots.filter(h=>Array.isArray(raw.openedHotspots)&&raw.openedHotspots.includes(h.id)).map(h=>h.id);
 s.foundChassis=s.openedHotspots.includes('bench_crate');s.chassisInstalled=s.foundChassis&&raw.chassisInstalled===true;
 pieces.forEach(p=>{if(s.openedHotspots.includes(p.hotspot))s.pieces[p.id]=s.chassisInstalled&&raw.pieces?.[p.id]==='installed'?'installed':'inventory'});
 s.connectedWires=wires.filter(w=>raw.connectedWires?.includes?.(w.id)&&[w.from,w.to].every(id=>s.pieces[ports.find(p=>p.id===id).piece]==='installed')).map(w=>w.id);
 for(const id of ['mirror1','mirror2'])s.mirrorSteps[id]=s.pieces[id]==='installed'&&Number.isInteger(raw.mirrorSteps?.[id])&&raw.mirrorSteps[id]>=0&&raw.mirrorSteps[id]<=3?raw.mirrorSteps[id]:0;
 s.slmCells=s.pieces.slm==='installed'?pattern.map((_,i)=>raw.slmCells?.[i]===true):Array(9).fill(false);
 s.focus=s.pieces.objective==='installed'&&Number.isFinite(raw.focus)?Math.min(100,Math.max(0,raw.focus)):25;
 s.powerOn=raw.powerOn===true&&canPowerOn(s);s.completed=raw.completed===true&&canStartCapture(s);s.hasPlayedCaptureAnimation=s.completed;s.captureOccupiedCells=s.completed?[1,4,7]:[];s.phase=phase(s);return s;
}
export function transition(state,a){let s=structuredClone(state),message='',ok=true;const fail=t=>{ok=false;message=t};
 switch(a.type){
 case 'blueprint':s.blueprintViewed=true;break;
 case 'collect':{const h=hotspots.find(h=>h.id===a.id);if(!s.blueprintViewed)fail('先看墙上光路图，再找零件。');else if(!h||s.openedHotspots.includes(a.id))fail('这里已经取过了，零件在背包或工作台。');else{s.openedHotspots.push(a.id);h.items.forEach(id=>id==='chassis'?s.foundChassis=true:s.pieces[id]='inventory');message=h.items.map(id=>id==='chassis'?'主机底座':pieces.find(p=>p.id===id).name).join('、')+' 已收入背包';}break;}
 case 'install':if(a.id!==a.slot)fail('这不是它的位置，看看接口形状。');else if(a.id==='chassis'){if(!s.foundChassis||s.chassisInstalled)fail('先找到底座，且不能重复安装。');else s.chassisInstalled=true;}else if(!s.chassisInstalled)fail('先把大底座固定在工作台中央吧。');else if(s.pieces[a.id]!=='inventory')fail('先找到这件零件。');else{s.pieces[a.id]='installed';message='咔哒！设备固定好了。'}break;
 case 'remove':if(s.pieces[a.id]!=='installed')fail('设备尚未安装。');else{s.pieces[a.id]='inventory';s.connectedWires=s.connectedWires.filter(id=>{const w=wires.find(w=>w.id===id);return [w.from,w.to].every(p=>ports.find(x=>x.id===p).piece!==a.id)});if(a.id.startsWith('mirror'))s.mirrorSteps[a.id]=0;if(a.id==='slm')s.slmCells.fill(false);if(a.id==='objective')s.focus=25;}break;
 case 'wire':{const w=wires.find(w=>w.from===a.from&&w.to===a.to||w.to===a.from&&w.from===a.to);if(!w||![w.from,w.to].every(p=>s.pieces[ports.find(x=>x.id===p).piece]==='installed'))fail('接口不匹配。金色接电源，绿色接数据，看看接口名称。');else if(!s.connectedWires.includes(w.id)){s.connectedWires.push(w.id);message='接口亮了，电缆已接好。'}break;}
 case 'unwire':s.connectedWires=s.connectedWires.filter(id=>id!==a.id);break;
 case 'mirror':if(['mirror1','mirror2'].includes(a.id)&&s.pieces[a.id]==='installed')s.mirrorSteps[a.id]=(s.mirrorSteps[a.id]+1)%4;else fail('先装好镜子。');break;
 case 'cell':if(s.pieces.slm==='installed'&&Number.isInteger(a.index)&&a.index>=0&&a.index<9)s.slmCells[a.index]=!s.slmCells[a.index];else fail('先装好SLM。');break;
 case 'focus':if(s.pieces.objective==='installed'&&Number.isFinite(a.value))s.focus=Math.max(0,Math.min(100,a.value));else fail('先装好物镜。');break;
 case 'power':if(s.powerOn)s.powerOn=false;else if(canPowerOn(s))s.powerOn=true;else fail('没有电，激光器还在睡觉。先接好两根金色电源线。');break;
 case 'capture':if(!canStartCapture(s))fail('还差：'+missing(s).join('、'));else{s.completed=true;s.hasPlayedCaptureAnimation=true;s.captureOccupiedCells=[1,4,7];message='成功！5个光阱捕获3个原子，另外两个是空光阱。';}break;
 case 'retry':s.powerOn=false;s.mirrorSteps={mirror1:0,mirror2:0};s.slmCells.fill(false);s.focus=25;s.completed=false;break;
 case 'reset':return {state:initial(),ok:true,message:'本关已重置，其他章节不受影响。'};
 default:fail('未知操作');
 }
 if(!ok)return {state,message,ok};
 if(!canPowerOn(s))s.powerOn=false;
 if(!canStartCapture(s)||a.type==='retry'){s.completed=false;s.hasPlayedCaptureAnimation=false;s.captureOccupiedCells=[];}
 s.phase=phase(s);return {state:s,ok,message:message||getNextObjective(s)};
}
export function createStore(storage=localStorage){let s;try{s=normalize(JSON.parse(storage.getItem(KEY)))}catch{s=initial()}return {get state(){return s},dispatch(a){const r=transition(s,a);s=r.state;try{storage.setItem(KEY,JSON.stringify(s))}catch{r.message+='（存档暂不可用，请保持页面打开）'}if(typeof document!=='undefined')document.dispatchEvent(new CustomEvent('tweezerprogress',{detail:s}));return r}}}
