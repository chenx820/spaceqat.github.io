import {KEY,pieces,hotspots,manual,routes,views} from './config.js';
import {bellState,piPulseState,probabilities,shots,measuredCorrelation,mulberry32} from './engine.js';
export const fresh=(seed=Date.now()>>>0)=>({version:1,view:'room_overview',mode:'story',large:false,owned:[],installed:[],connections:[],clamps:[],latches:[],vacuum:false,rf:0,dc:0,mirrors:{cooling:0,gate:0},loaded:0,detuning:'on_resonance',cooled:false,x:4,y:-4,side:'carrier',cycles:0,target:0,ticks:50,single:null,prepared:false,msRun:false,msTicks:80,phase:false,basis:'ZZ',checks:{ZZ:null,XX:null},last:null,history:[],badge:false,seed,draws:0,undo:[]});
const has=(s,...ids)=>ids.every(id=>s.installed.includes(id));
export const connected=(s,...ids)=>ids.every(id=>s.connections.includes(id)&&manual.some(r=>r.id===id&&[r.source,r.target].every(p=>p.startsWith('chamber.')||has(s,p.split('.')[0]))));
export const fixedReady=(s,id)=>id==='L19'?has(s,'ion_loader_console'):s.clamps.length===4&&has(s,'trap_chip',id==='L02'?'rf_feedthrough':'dc_feedthrough');
export const sealed=s=>s.latches.length===2&&s.clamps.length===4&&has(s,'trap_chip','rf_feedthrough','dc_feedthrough');
export const fieldReady=s=>sealed(s)&&s.vacuum&&connected(s,'L01','L03','L05')&&fixedReady(s,'L02')&&fixedReady(s,'L04');
export const stable=s=>fieldReady(s)&&Math.abs(s.rf-6)<=1&&Math.abs(s.dc-5)<=1;
export const coolingReady=s=>stable(s)&&s.loaded===2&&connected(s,'L06','L08','L09','L10','L12')&&s.mirrors.cooling===45;
export const compensated=s=>s.cooled&&coolingReady(s)&&Math.abs(s.x)<=1&&Math.abs(s.y)<=1;
export const sideReady=s=>compensated(s)&&connected(s,'L07','L11','L13','L14')&&s.mirrors.gate===135;
export const motionReady=s=>sideReady(s)&&s.cycles>=3;
export const readoutReady=s=>connected(s,'L15','L16','L17','L18');
export const gateReady=s=>motionReady(s)&&readoutReady(s);
export const singlePassed=s=>gateReady(s)&&s.single?.records?.length===16&&s.single.target===0&&Math.abs(s.single.ticks-100)<=8&&s.single.records.filter(v=>v[0]==='1').length>=12;
export const countRecords=rs=>{const c={'00':0,'01':0,'10':0,'11':0};for(const r of rs||[])c[r]++;return c};
export const score=s=>['ZZ','XX'].every(b=>s.checks[b]?.length===40)?['ZZ','XX'].reduce((v,b)=>v+measuredCorrelation(countRecords(s.checks[b])),0):null;
export const complete=s=>pieces.every(p=>has(s,p.id))&&manual.every(r=>connected(s,r.id))&&['L02','L04','L19'].every(id=>fixedReady(s,id))&&singlePassed(s)&&s.msRun&&Math.abs(s.msTicks-120)<=10&&s.phase&&score(s)!==null&&score(s)>=1.4;
export function objective(s){if(s.installed.length<18||s.connections.length<16)return '探索房间，逐件装配 '+s.installed.length+'/18；亲手连接 '+s.connections.length+'/16 条线路。拿到一件就能装。';if(!sealed(s))return '去真空腔：固定芯片四角，再关闭左右维护把手。';if(!s.vacuum)return '去控制机柜读取真空状态；这不是启动真空泵。';if(!stable(s))return 'RF径向表调到6附近，DC轴向表调到5附近。';if(s.loaded!==2)return '用遥控台申请两粒钙离子，电场将它们困住。';if(!s.cooled)return '冷却镜转到45°，选择红失谐；397与866一起维持冷却循环。';if(!compensated(s))return '补偿X和Y，让平均位置回到中心±1格。';if(!motionReady(s))return '门光镜转到135°；选红边带，完成三次降能循环。';if(!singlePassed(s))return '点选离子A，脉冲调至100 tick，重复16次验证暗态概率。';if(!s.msRun)return '准备新的00，启用双频MS门，把门时长调到120 tick再执行。';if(!s.phase)return 'MS已产生纠缠；给B补相+π/2，使两种方向的关联便于比较。';if(!complete(s))return '分别切换ZZ和XX，各收集40轮全新实验。两个角度都要验证。';return '离子守护者！两批新实验共同验证了双离子关联。';}
function archive(s){if(s.single||s.checks.ZZ||s.checks.XX)s.history.push({single:s.single,checks:s.checks,msTicks:s.msTicks,phase:s.phase});s.history=s.history.slice(-8)}
function invalidate(s,level=0){archive(s);if(level<=0)s.loaded=0;if(level<=1)s.cooled=false;if(level<=2)s.cycles=0;if(level<=3)s.single=null;s.prepared=false;s.msRun=false;s.checks={ZZ:null,XX:null};s.last=null;}
function reconcile(s){if(!fieldReady(s))s.vacuum=s.vacuum&&sealed(s)&&connected(s,'L05');if(!stable(s)){s.loaded=0;s.cooled=false}if(!coolingReady(s)||s.detuning!=='red')s.cooled=false;if(!sideReady(s))s.cycles=0;if(!gateReady(s))s.single=null;if(!singlePassed(s)){s.prepared=false;s.msRun=false}s.checks=s.msRun?s.checks:{ZZ:null,XX:null};return s}
const validRecords=(r,n)=>Array.isArray(r)&&r.length===n&&r.every(x=>['00','01','10','11'].includes(x));
export function normalize(raw){let s=fresh();if(raw?.version!==1)return s;s.owned=Array.isArray(raw.owned)?[...new Set(raw.owned)].filter(id=>pieces.some(p=>p.id===id)):[];s.installed=Array.isArray(raw.installed)?[...new Set(raw.installed)].filter(id=>s.owned.includes(id)):[];s.connections=manual.filter(r=>Array.isArray(raw.connections)&&raw.connections.includes(r.id)&&[r.source,r.target].every(p=>p.startsWith('chamber.')||s.installed.includes(p.split('.')[0]))).map(r=>r.id);s.clamps=has(s,'trap_chip')?['tl','tr','bl','br'].filter(x=>Array.isArray(raw.clamps)&&raw.clamps.includes(x)):[];s.latches=['left','right'].filter(x=>Array.isArray(raw.latches)&&raw.latches.includes(x));s.vacuum=raw.vacuum===true;
 for(const [k,min,max] of [['rf',0,10],['dc',0,10],['x',-4,4],['y',-4,4],['ticks',0,200],['msTicks',0,240],['cycles',0,3],['loaded',0,2],['target',0,1]])if(Number.isInteger(raw[k])&&raw[k]>=min&&raw[k]<=max)s[k]=raw[k];
 for(const k of ['cooling','gate'])if([0,45,90,135,180,225,270,315].includes(raw.mirrors?.[k]))s.mirrors[k]=raw.mirrors[k];
 for(const k of ['cooled','prepared','msRun','phase','badge','large'])s[k]=raw[k]===true;
 s.view=views[raw.view]?raw.view:s.view;s.mode=['story','explore','research'].includes(raw.mode)?raw.mode:'story';s.detuning=['blue','on_resonance','red'].includes(raw.detuning)?raw.detuning:s.detuning;s.side=['blue_sideband','carrier','red_sideband'].includes(raw.side)?raw.side:s.side;s.basis=raw.basis==='XX'?'XX':'ZZ';
 if(validRecords(raw.single?.records,16)&&[0,1].includes(raw.single.target)&&Number.isFinite(raw.single.ticks))s.single=raw.single;
 for(const b of ['ZZ','XX'])if(validRecords(raw.checks?.[b],40))s.checks[b]=raw.checks[b];if(['00','01','10','11'].includes(raw.last))s.last=raw.last;
 s.seed=Number.isSafeInteger(raw.seed)?raw.seed>>>0:s.seed;s.draws=Number.isSafeInteger(raw.draws)&&raw.draws>=0?raw.draws:0;s.history=Array.isArray(raw.history)?raw.history.slice(-8):[];s.undo=Array.isArray(raw.undo)?raw.undo.filter(a=>['remove','disconnect'].includes(a.type)).slice(-40):[];return reconcile(s);
}
export function transition(current,a){const s=structuredClone(current),no=message=>({state:current,ok:false,message});let message='进度已保存。';const sample=(factory,basis,n)=>{const rs=[];for(let i=0;i<n;i++){// Every independent experiment initializes a fresh state and applies the gates.
 const rng=mulberry32((s.seed+s.draws*0x6D2B79F5)>>>0);s.draws++;const counts=shots(probabilities(factory(),basis[0],basis[1]),1,rng);rs.push(Object.keys(counts).find(k=>counts[k]));}return rs};
 switch(a.type){
 case 'view':if(!views[a.id])return no('未知工作区');s.view=a.id;break;
 case 'mode':if(!['story','explore','research'].includes(a.id))return no('未知阅读层级');s.mode=a.id;break;
 case 'large':s.large=!s.large;break;
 case 'collect':{const h=hotspots.find(h=>h.id===a.id),id=h?.items.find(id=>!s.owned.includes(id));if(!id)return no('这里已经找过啦。');s.owned.push(id);message='找到 '+pieces.find(p=>p.id===id).name+'！'+(h.items.some(id=>!s.owned.includes(id))?'箱里还有零件，再打开看看。':'已收好，可以去装配。');break;}
 case 'install':{const p=pieces.find(p=>p.id===a.id);if(!p||!s.owned.includes(a.id))return no('先在房间找到这件零件。');if(s.installed.includes(a.id))return no('已经安装，无需重复。');if(a.slot!==a.id||a.view!==p.scene)return no(p.incorrectHint);if(sealed(s)&&p.scene==='trap_cutaway')return no('先停止实验并进入维护模式。');s.installed.push(a.id);s.undo.push({type:'remove',id:a.id});message='卡扣到位！'+p.learnText;break;}
 case 'remove':{if(!has(s,a.id))return no('这件还没有安装。');if(sealed(s)||s.loaded)return no('设备已锁闭。先停止实验，进入维护模式再拆件。');invalidate(s);s.installed=s.installed.filter(id=>id!==a.id);s.connections=s.connections.filter(id=>!routes.find(r=>r.id===id).source.startsWith(a.id+'.')&&!routes.find(r=>r.id===id).target.startsWith(a.id+'.'));if(a.id==='trap_chip')s.clamps=[];s.vacuum=false;message='零件回到背包，相连线路已拆下；历史记录保留。';break;}
 case 'connect':{const r=manual.find(r=>r.source===a.from&&r.target===a.to);if(!r)return no('端口不匹配。按蓝图同编号发送口→接收口；RF、DC、冷却与门光不能混接。');if(![r.source,r.target].every(p=>p.startsWith('chamber.')||has(s,p.split('.')[0])))return no('先安装这条路径两端的实体设备。');if(s.connections.includes(r.id))return no('这条已经接好。');s.connections.push(r.id);s.undo.push({type:'disconnect',id:r.id});message=r.label+'已连接。';break;}
 case 'disconnect':if(!s.connections.includes(a.id))return no('这根还没有接上。');s.connections=s.connections.filter(id=>id!==a.id);invalidate(s,['L01','L03','L05'].includes(a.id)?0:['L06','L08','L09','L10','L12'].includes(a.id)?1:['L07','L11','L13','L14'].includes(a.id)?2:3);if(a.id==='L05')s.vacuum=false;message='线路已拔下，相关实验需重新准备；历史统计仍可查看。';break;
 case 'undo':{const last=s.undo.pop();if(!last)return no('没有可撤销的装配或接线。');return transition(s,last);}
 case 'clamp':if(!has(s,'trap_chip')||sealed(s)||!['tl','tr','bl','br'].includes(a.id))return no('先在维护窗里安装芯片，再逐角固定。');if(!s.clamps.includes(a.id))s.clamps.push(a.id);message='固定 '+s.clamps.length+'/4 个角。';break;
 case 'latch':if(!has(s,'trap_chip','rf_feedthrough','dc_feedthrough')||s.clamps.length!==4)return no('先安装芯片、两个馈通并固定四角。');if(!['left','right'].includes(a.id))return no('请选择窗边把手');if(!s.latches.includes(a.id))s.latches.push(a.id);message=sealed(s)?'教学维护窗已锁闭，可以读取真空监测。':'这一边已锁好，再关闭另一边。';break;
 case 'maintenance':invalidate(s);s.latches=[];s.vacuum=false;message='模拟实验已停止，回到维护模式；零件、线路和历史荣誉保留。';break;
 case 'vacuum':if(!sealed(s)||!connected(s,'L05'))return no('先锁闭维护窗并连接L05监测线。');s.vacuum=true;message='已读取：技术员预装的真空系统模拟就绪。';break;
 case 'field':if(!['rf','dc'].includes(a.id)||!Number.isInteger(a.value)||a.value<0||a.value>10)return no('请选择0–10的虚拟档位。');if(!fieldReady(s))return no('先锁窗、确认真空、连接L01和L03。');if(s[a.id]!==a.value){s[a.id]=a.value;invalidate(s)}message=stable(s)?'径向与轴向都稳定，可以装载两颗离子。':'RF目标6±1，DC目标5±1；这是虚拟刻度，不是电压。';break;
 case 'load':if(!stable(s)||!fixedReady(s,'L19'))return no('先让RF/DC稳定，并安装装载遥控台。');if(![1,2].includes(a.count))return no('选择1或2粒');invalidate(s);s.loaded=a.count;message='已遥控装载'+a.count+'粒离子。电场束缚≠已经冷却。';break;
 case 'mirror':if(!['cooling','gate'].includes(a.id)||!has(s,a.id==='cooling'?'cooling_mirror':'gate_mirror')||![0,45,90,135,180,225,270,315].includes(a.value))return no('先装镜架，再选择八档方向。');if(s.mirrors[a.id]!==a.value){s.mirrors[a.id]=a.value;invalidate(s,a.id==='cooling'?1:2)}message='镜面已转动；虚拟冷却路径目标45°，门光路径目标135°。';break;
 case 'detuning':if(!['blue','on_resonance','red'].includes(a.value))return no('请选择失谐');if(s.detuning!==a.value){s.detuning=a.value;invalidate(s,1)}break;
 case 'cool':if(!coolingReady(s))return no('需要2离子、稳定电场、L06/08/09/10/12和45°冷却镜。');if(s.detuning!=='red')return no(s.detuning==='blue'?'偏蓝会添运动，试试频率稍低的红失谐。':'共振能散射光；本关净冷却请选择红失谐。');s.cooled=true;message='普通运动减小！接下来减少RF带来的额外微运动。';break;
 case 'comp':if(!s.cooled)return no('先完成多普勒冷却。');if(!['x','y'].includes(a.id)||!Number.isInteger(a.value)||Math.abs(a.value)>4)return no('选择−4至4格');if(s[a.id]!==a.value){s[a.id]=a.value;invalidate(s,2)}message=compensated(s)?'平均位置回到中心附近，微运动已补偿。':'两轴都要回到中心±1格。';break;
 case 'side':if(!['blue_sideband','carrier','red_sideband'].includes(a.value))return no('请选择边带');s.side=a.value;break;
 case 'cycle':if(!sideReady(s))return no('先补偿两轴；接好729、854、866光路和时序，门光镜135°。');if(s.side!=='red_sideband')return no(s.side==='carrier'?'载波改变内部态；降运动能量请选择红边带。':'蓝边带不会完成降能，试试红运动边带。');s.cycles=Math.min(3,s.cycles+1);message='运动能量示意 '+[5,3,2,1][s.cycles]+'，不是实际温度或精确声子数。';break;
 case 'target':if(![0,1].includes(a.value))return no('选择A或B');s.target=a.value;break;
 case 'ticks':if(!Number.isInteger(a.value)||a.value<0||a.value>200)return no('脉冲范围0–200 tick');if(s.ticks!==a.value){invalidate(s,3);s.ticks=a.value}break;
 case 'single':{if(!gateReady(s))return no('先完成低运动准备，并连接L15–L18荧光与数据读出。');if(![1,16].includes(a.count))return no('选择1轮或16轮');const rs=sample(()=>piPulseState(s.ticks,s.target),'ZZ',a.count);s.last=rs.at(-1);if(a.count===16){archive(s);s.single={ticks:s.ticks,target:s.target,records:rs};s.msRun=false;s.prepared=false;s.checks={ZZ:null,XX:null}}message=singlePassed(s)?'A的π脉冲校准完成！暗态1仍是留在阱里的离子。':'这是重新备态后的抽样；主线点选A，调到100 tick再重复16轮。';break;}
 case 'prepare':if(!singlePassed(s))return no('先完成A的16轮π脉冲验证。');archive(s);s.prepared=true;s.msRun=false;s.checks={ZZ:null,XX:null};s.last=null;message='两离子已重新准备为00；现在选择双频MS时长。';break;
 case 'msTicks':if(!Number.isInteger(a.value)||a.value<0||a.value>240)return no('门时长范围0–240 tick');if(s.msTicks!==a.value){archive(s);s.msTicks=a.value;s.msRun=false;s.checks={ZZ:null,XX:null}}break;
 case 'ms':if(!singlePassed(s)||!s.prepared)return no('先完成单比特校准并重新准备00。');s.msRun=true;s.prepared=false;s.checks={ZZ:null,XX:null};message=Math.abs(s.msTicks-120)<=10?'MS有效XX门已执行。给B补相，再比较ZZ与XX。':'门已模拟，但节拍未校准；观察分布后可准备新00再试120 tick。';break;
 case 'phase':if(typeof a.value!=='boolean')return no('无效相位');if(s.phase!==a.value){archive(s);s.phase=a.value;s.checks={ZZ:null,XX:null}}message=s.phase?'B的虚拟相位框已补+π/2；需两批新实验。':'未补相MS仍可能纠缠，XX≈0不代表无纠缠。';break;
 case 'basis':if(!['ZZ','XX'].includes(a.value))return no('选择ZZ或XX');s.basis=a.value;break;
 case 'batch':if(!singlePassed(s)||!s.msRun)return no('先校准单比特并执行一次MS门。');if(s.checks[s.basis])archive(s);s.checks[s.basis]=sample(()=>bellState({gateTicks:s.msTicks,virtualZ:s.phase}),s.basis,40);s.last=s.checks[s.basis].at(-1);message=s.basis+'：40轮重新初始化→MS→补相→'+(s.basis==='XX'?'基变换→':'')+'荧光读出已记录。';break;
 default:return no('未知操作');
 }
 reconcile(s);if(complete(s)&&!s.badge){s.badge=true;message='✦ 离子守护者！ZZ与XX两组新实验验证通过。'}s.undo=s.undo.slice(-40);return {state:s,ok:true,message};
}
export function createStore(storage=globalThis.localStorage){let state=fresh();try{state=normalize(JSON.parse(storage?.getItem(KEY)))}catch{}return {get state(){return state},dispatch(a){const r=transition(state,a);if(r.ok){state=r.state;try{storage?.setItem(KEY,JSON.stringify(state))}catch{r.message+=' 存档不可写，请保持页面打开。'}globalThis.document?.dispatchEvent(new Event('ionprogress'))}return r}}}
