import {KEY,pieces,hotspots,wires,views,order} from './config.js';
import {prepareGraph,prepareBridgeGraphWithInputs,measureEquatorial,applyPauliInPlace,fidelity,wireTarget,bridgeTarget,runBridge2x3,samplePauliCorrelation} from './engine.js';
const fresh=()=>({version:1,view:'room_overview',mode:'story',largeText:false,angles:{top:-Math.PI/4,bottom:0},opened:[],installed:[],connections:[],powered:false,delay:2,synced:false,wire:null,apprentice:null,fusion:'empty',attempts:0,successes:0,serial:0,bridge:[],frame:[0,0,0,0],confirmed:false,checks:{XZ:[],ZX:[]},history:[],undo:[]});
export const ready=s=>s.installed.length===17&&s.connections.length===13;
export const operational=s=>ready(s)&&s.powered&&s.synced&&Math.abs(s.delay)<=.25;
export const frameFor=bits=>{const [a,b,c,d]=bits;return [c^b,a,d^a,b]};
export function wireState(records){let st=prepareGraph(3,[[0,1],[1,2]]);for(const r of records)st=measureEquatorial(st,0,r.angle,()=>0,r.bit).state;return st}
export function wirePassed(records){if(records?.length!==2)return false;const [a,b]=records;if(a.angle!==-Math.PI/4||b.angle!==(a.bit?-Math.PI/4:Math.PI/4))return false;let st=wireState(records);if(a.bit)applyPauliInPlace(st,0,'Z');if(b.bit)applyPauliInPlace(st,0,'X');return fidelity(st,wireTarget())>1-1e-8}
export function bridgeState(bits,frame=null){let st=prepareBridgeGraphWithInputs();for(const bit of bits)st=measureEquatorial(st,0,0,()=>0,bit).state;if(frame&&bits.length===4){if(frame[1])applyPauliInPlace(st,0,'Z');if(frame[0])applyPauliInPlace(st,0,'X');if(frame[3])applyPauliInPlace(st,1,'Z');if(frame[2])applyPauliInPlace(st,1,'X')}return st}
export const bridgePassed=s=>s.bridge.length===4&&s.frame.every((v,i)=>v===frameFor(s.bridge)[i])&&fidelity(bridgeState(s.bridge,s.frame),bridgeTarget())>1-1e-8;
export const complete=s=>operational(s)&&wirePassed(s.apprentice)&&s.fusion==='success'&&s.confirmed&&bridgePassed(s)&&['XZ','ZX'].every(k=>s.checks[k].length===20&&s.checks[k].every(r=>r.top===r.bottom));
function invalidate(s){s.synced=false;s.wire=null;s.fusion='empty';s.bridge=[];s.frame=[0,0,0,0];s.confirmed=false;s.checks={XZ:[],ZX:[]}}
const bitsOK=a=>Array.isArray(a)&&a.length<=4&&a.every(v=>v===0||v===1);
const recordsOK=a=>Array.isArray(a)&&a.length<=2&&a.every(r=>r&&Number.isFinite(r.angle)&&Math.abs(r.angle)<=Math.PI&&(r.bit===0||r.bit===1));
export function normalize(raw){const s=fresh();if(!raw||raw.version!==1)return s;
 s.largeText=raw.largeText===true;
 for(const rail of ['top','bottom'])if([-Math.PI/4,0,Math.PI/4].includes(raw.angles?.[rail]))s.angles[rail]=raw.angles[rail];
 s.opened=hotspots.filter(h=>Array.isArray(raw.opened)&&raw.opened.includes(h.id)).map(h=>h.id);const found=hotspots.filter(h=>s.opened.includes(h.id)).flatMap(h=>h.gives);
 s.installed=pieces.filter(p=>found.includes(p.id)&&Array.isArray(raw.installed)&&raw.installed.includes(p.id)).map(p=>p.id);
 s.connections=wires.filter(w=>Array.isArray(raw.connections)&&raw.connections.includes(w.id)&&[w.from,w.to].every(p=>s.installed.includes(p.split('.')[0]))).map(w=>w.id);
 s.view=views[raw.view]?raw.view:s.view;s.mode=['story','explore','research'].includes(raw.mode)?raw.mode:'story';s.powered=raw.powered===true&&s.installed.includes('pump');s.delay=Number.isFinite(raw.delay)?Math.max(-4,Math.min(4,raw.delay)):2;s.synced=raw.synced===true&&ready(s)&&s.powered&&Math.abs(s.delay)<=.25;
 s.attempts=Number.isSafeInteger(raw.attempts)&&raw.attempts>=0?raw.attempts:0;s.successes=Math.max(0,Math.min(s.attempts,Number.isSafeInteger(raw.successes)?raw.successes:0));s.serial=Math.max(s.attempts,Number.isSafeInteger(raw.serial)?raw.serial:0);
 if(recordsOK(raw.apprentice)&&wirePassed(raw.apprentice))s.apprentice=raw.apprentice;
 s.history=Array.isArray(raw.history)?raw.history.filter(r=>r&&r.type==='complete'&&typeof r.at==='string').slice(-12):[];
 if(operational(s)){s.wire=recordsOK(raw.wire)?raw.wire:null;if(s.apprentice&&['prepared','failed','success'].includes(raw.fusion))s.fusion=raw.fusion;
 if(s.fusion==='success'&&bitsOK(raw.bridge)){s.bridge=raw.bridge;s.frame=bitsOK(raw.frame)&&raw.frame.length===4?raw.frame:[0,0,0,0];s.confirmed=raw.confirmed===true&&bridgePassed(s);
 if(s.confirmed)for(const basis of ['XZ','ZX']){const rs=raw.checks?.[basis];if(Array.isArray(rs)&&rs.length===20&&rs.every(r=>bitsOK(r.bits)&&r.bits.length===4&&[0,1].includes(r.top)&&r.top===r.bottom))s.checks[basis]=rs;}
 }}return s;
}
export function objective(s){if(!ready(s))return `搜寻零件，装配 ${s.installed.length}/17，接好 ${s.connections.length}/13 根信号线。`;if(!operational(s))return '打开泵浦电源，调节延迟线，让两路光脉冲同时到达。';if(!s.apprentice)return '进入簇态图板：先练习三颗光子的接力，读数决定下一次角度。';if(s.fusion!=='success')return '发射上下两片新资源，再尝试融合。失败可以重新发射。';if(!s.confirmed)return '按 T0、B0、T1、B1 测量，再记录两轨修正卡。';if(!complete(s))return '收集 XZ 和 ZX 两组关联记录，每组20个全新试次。';return '织光成网完成！已验证自适应、前馈与双轨关联。';}
export function transition(current,a,rng=Math.random){const s=structuredClone(current);const no=message=>({state:current,ok:false,message});let message='进度已保存。';const resetTrial=()=>{s.bridge=[];s.frame=[0,0,0,0];s.confirmed=false;s.checks={XZ:[],ZX:[]}};
 switch(a.type){
 case 'view':if(!views[a.id])return no('未知工作区');s.view=a.id;break;
 case 'mode':if(!['story','explore','research'].includes(a.id))return no('未知阅读模式');s.mode=a.id;break;
 case 'textSize':s.largeText=!s.largeText;break;
 case 'angle':if(!['top','bottom'].includes(a.rail)||![-Math.PI/4,0,Math.PI/4].includes(a.value))return no('无效测量镜');s.angles[a.rail]=a.value;message='分析器角度已更新；不会改写已测量光子的记录。';break;
 case 'collect':{const h=hotspots.find(h=>h.id===a.id);if(!h||s.opened.includes(h.id))return no('这个箱子已经检查过了。');s.opened.push(h.id);message='找到：'+h.gives.map(id=>pieces.find(p=>p.id===id).label).join('、');break;}
 case 'install':{const found=hotspots.filter(h=>s.opened.includes(h.id)).flatMap(h=>h.gives);if(a.id!==a.slot||!found.includes(a.id)||s.installed.includes(a.id))return no('先选背包里的零件，再放到同名安装座；零件不会丢失。');s.installed.push(a.id);s.undo.push({type:'remove',id:a.id});invalidate(s);message='卡扣到位！接下来连接设备边缘的端口。';break;}
 case 'remove':if(!s.installed.includes(a.id))return no('该座没有零件。');s.installed=s.installed.filter(id=>id!==a.id);s.connections=s.connections.filter(id=>{const w=wires.find(w=>w.id===id);return ![w.from,w.to].some(p=>p.startsWith(a.id+'.'))});if(a.id==='pump')s.powered=false;invalidate(s);message='已收回背包；相连电缆拔除，当前试次失效。';break;
 case 'connect':{const w=wires.find(w=>w.from===a.from&&w.to===a.to);if(!w)return no('接线不匹配。先选发送口，再选蓝图中的接收口；时钟、光路和经典信号不能混接。');if(![w.from,w.to].every(p=>s.installed.includes(p.split('.')[0])))return no('两端设备都要先安装。');if(s.connections.includes(w.id))return no('这根线已接好。');s.connections.push(w.id);s.undo.push({type:'disconnect',id:w.id});invalidate(s);message='信号线已接通。';break;}
 case 'disconnect':if(!s.connections.includes(a.id))return no('电缆尚未连接。');s.connections=s.connections.filter(id=>id!==a.id);invalidate(s);message='已拔线。旧光子试次不能继续使用，请重新同步。';break;
 case 'undo':{const last=s.undo.pop();if(!last)return no('没有可撤销的装配动作。');return transition(s,last,rng);}
 case 'power':if(!s.installed.includes('pump'))return no('请先安装泵浦模块。');s.powered=!s.powered;invalidate(s);message=s.powered?'封装源已上电（教学模式）。调节延迟，试发同步脉冲。':'已断电；当前试次清空。';break;
 case 'delay':if(!Number.isFinite(a.value))return no('无效延迟');if(a.value!==s.delay){s.delay=Math.max(-4,Math.min(4,a.value));invalidate(s)}break;
 case 'sync':if(!ready(s)||!s.powered)return no('先安装17件零件、接通13根线并打开泵浦电源。');s.synced=Math.abs(s.delay)<=.25;message=s.synced?'两路重合！同步就绪，可进行光子接力。':'两路错开了。把时间差调到 −0.25 至 +0.25 格，再试发。';break;
 case 'wireStart':if(!operational(s))return no('先完成线路和同步。');s.wire=[];message='三颗新光子已准备。先选 q0 的左斜镜（−π/4）。';break;
 case 'wireMeasure':{if(!operational(s)||!s.wire||s.wire.length>=2||a.node!=='q'+s.wire.length)return no('按顺序选择还未被测量的节点。已探测光子不能再次测量。');if(![-Math.PI/4,0,Math.PI/4].includes(a.angle))return no('请选择测量镜角度。');const r=measureEquatorial(wireState(s.wire),0,a.angle,rng);s.wire.push({angle:a.angle,bit:r.outcome});message=`读数 ${r.outcome} 是正常的随机结果。`+(s.wire.length===1?`下一面镜请选择${r.outcome?'左斜':'右斜'}。`:'记录修正卡，再验证输出。');break;}
 case 'wireConfirm':if(!operational(s)||!wirePassed(s.wire))return no('角度没有实现目标接力。请用新资源重试：第一步左斜；读数0用右斜，读数1用左斜。');s.apprentice=structuredClone(s.wire);message='接力通过！修正后与目标态保真度100%（理想模型）。';break;
 case 'prepare':if(!operational(s)||!s.apprentice)return no('先完成同步和三节点自适应练习。');s.fusion='prepared';s.serial++;resetTrial();message='两片封装图态已发射：6个逻辑节点＋FT、FB两个辅助叶。';break;
 case 'fuse':if(!operational(s)||s.fusion!=='prepared')return no('本批资源不可用。请先发射新的图态片段。');s.attempts++;resetTrial();if(rng()<.5){s.successes++;s.fusion='success';message='符合信号成功！FT、FB已消耗，留下六节点五条边。已计入已知局域修正。'}else{s.fusion='failed';message='融合未成功：辅助光子被消耗，本批全部丢弃。请重发，失败不扣分。'}break;
 case 'bridgeMeasure':if(!operational(s)||s.fusion!=='success'||s.bridge.length>=4||a.node!==order[s.bridge.length])return no('请按 T0 → B0 → T1 → B1 顺序测量尚未探测的节点。');if(a.angle!==0)return no('这一双轨构件要求平镜（X基，角度0）。');s.bridge.push(measureEquatorial(bridgeState(s.bridge),0,0,rng).outcome);message='光子已探测消耗，读数已传到经典前馈机。';break;
 case 'frame':if(s.bridge.length!==4||!Number.isInteger(a.index)||a.index<0||a.index>3)return no('先完成四个节点测量。');s.frame[a.index]^=1;s.confirmed=false;s.checks={XZ:[],ZX:[]};break;
 case 'confirm':if(!operational(s)||!bridgePassed(s))return no('修正卡还不匹配。用读数提示检查两个“不同则1”的组合。');s.confirmed=true;message='经典前馈匹配！两输出态经修正后与目标保真度100%。';break;
 case 'sample':{if(!operational(s)||!s.confirmed||!bridgePassed(s)||!['XZ','ZX'].includes(a.basis))return no('先完成四次测量和修正卡确认。');if(s.checks[a.basis].length)return no('本组20个全新试次已收集。');const records=[];let attempts=0; // Fresh conditional resources: no photon is measured twice.
 while(records.length<20&&attempts<1000){attempts++;if(rng()>=.5)continue;const r=runBridge2x3({rng});const sample=samplePauliCorrelation(r.state,...a.basis,rng);records.push({bits:r.outcomes,...sample});}
 if(records.length!==20)return no('这批资源未收齐。请再次尝试；尚未提交统计。');s.checks[a.basis]=records;s.attempts+=attempts;s.successes+=20;s.serial+=attempts;message=`${a.basis}：20个全新成功资源，融合尝试${attempts}次；逐批计算、前馈、探测。`;
 if(complete(s)){s.history.push({type:'complete',at:new Date().toISOString()});message='✦ 织光成网完成！XZ、ZX各20次全新资源验证通过。'}break;}
 default:return no('未知操作');
 }s.undo=s.undo.slice(-40);s.history=s.history.slice(-12);return {state:s,ok:true,message};
}
export function createStore(storage=globalThis.localStorage,rng=()=>globalThis.crypto.getRandomValues(new Uint32Array(1))[0]/4294967296){let state=fresh();try{state=normalize(JSON.parse(storage?.getItem(KEY)))}catch{}return {get state(){return state},dispatch(a){const r=transition(state,a,rng);if(r.ok){state=r.state;try{storage?.setItem(KEY,JSON.stringify(state))}catch{r.message+=' 本次无法写入存档，请保持页面打开。'}globalThis.document?.dispatchEvent(new Event('photonicprogress'))}return r}}}
