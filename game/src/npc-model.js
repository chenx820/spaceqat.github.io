import {KEY as ION_KEY} from './ion/config.js';
import {normalize as normalizeIon,objective as ionObjective} from './ion/model.js';
import {KEY as PH_KEY} from './photonic/config.js';
import {normalize as normalizePH,objective as phObjective} from './photonic/model.js';
import {KEY as SC_KEY} from './superconducting/config.js';
import {normalize as normalizeSC,objective as scObjective} from './superconducting/model.js';
import {normalizeExpedition} from './expedition-state.js';
import {normalizeCampaign} from './campaign-state.js';
import {normalize as normalizeTweezer,getNextObjective,missing} from './tweezer/model.js';
import {KEY as TWEEZER_KEY} from './tweezer/config.js';
export const residents={
 entry:{name:'Mira',role:'迎航员',gender:'女',coat:'#669db1',intro:'欢迎登船！我是迎航员 Mira，来自长着触角的苔星族。这里是气闸入口，进入飞船后会到中央广场。',fact:'按W或上方向键沿舷梯走，靠近舱门按E；也可以点击目标让Qat寻路。'},
 plaza:{name:'Dr. Liang',role:'舰长',gender:'男',coat:'#497b99',intro:'我是这艘 SpaceQat 飞船的舰长 Dr. Liang。尘暴之后，飞船进入安全停航。我们的任务是修复设备、完成验证，让 SpaceQat 安全重启。',fact:'广场连接游乐场、实验舱和探索房间。每个房间都能步行返回广场；航线图可快速找到目的地。'},
 chapter:{name:'Dr. Lin',role:'态制备研究员',gender:'女',coat:'#8b70b1',intro:'我是 Dr. Lin，负责态制备舱。我们从一盏小灯开始认识量子状态。',fact:'X交换0和1，H可以准备叠加态；布洛赫球是状态地图，不是粒子在空间里的位置。'},
 playroom:{name:'Nora',role:'游乐场辅导员',gender:'女',coat:'#8ba75a',intro:'我是 Nora，来自鳍耳星的游乐场辅导员。这里没有考试，你可以按自己的节奏玩三台装置。',fact:'翻灯、收星星、调旋钮是三个不同活动。一次随机结果不能代表理论概率，试着多收集一些。'},
 storage:{name:'Owen',role:'器材管理员',gender:'男',coat:'#b68a50',intro:'我是岩星居民 Owen，负责星际储藏室。每只箱子都放着有用的线索。',fact:'找到配件和激活配件是两回事。先搜寻，再到相应实验完成任务，最后安装到机器。'},
 observatory:{name:'Dr. Taylor',role:'星窗观测员',gender:'女',coat:'#658bb9',intro:'我是 Dr. Taylor，这里用观察和记录寻找规律。',fact:'一次测量只给出一个结果。想比较概率，需要准备同样的状态并重复观察。'},
 bridge:{name:'Dr. Wilson',role:'关联研究员',gender:'男',coat:'#558b86',intro:'我是 Dr. Wilson，欢迎来到纠缠桥。两颗星星之间的关系，比单独看一颗更有意思。',fact:'贝尔态和经典混合在ZZ中都可能显示相同结果，但换XX观察镜可以区分。不能仅凭同色判断纠缠。'},
 deck:{name:'Ada',role:'轮机工程师',gender:'女',coat:'#b77754',intro:'我是轮机工程师 Ada，负责四间量子操作室的维护。',fact:'超导、中性原子、离子阱和光子是不同硬件路线。完成装配不等于完成纠错，主线还要接上逻辑保护。'},
 'ops-sc':{name:'Dr. Li',role:'超导研究员',gender:'男',coat:'#5589b2',intro:'我是 Dr. Li，负责超导量子计算机。欢迎来看看低温装置里的小电路。',fact:'稀释制冷机让超导芯片工作在毫开尔文级极低温，接近但不是绝对零度。金色屏蔽层隔离热辐射，同轴线缆传递控制和读出信号。场景微光是美术效果，不是实际温度读数。'},
 'ops-neutral':{name:'Dr. Chen',role:'中性原子研究员',gender:'女',coat:'#568f79',intro:'我是 Dr. Chen，负责中性原子实验室。让我们用光镊给原子安排座位吧。',fact:'SLM塑造光阱图案，物镜聚焦激光，相机记录荧光。有光阱不代表一定装载了原子；真空、冷却和互锁已在设备中内置。'},
 'ops-ion':{name:'Dr. Kim',role:'离子阱研究员',gender:'女',coat:'#9b79ae',intro:'我是 Dr. Kim，照看这里的离子阱。离子带电，中性原子不带净电荷，束缚方式也不同。',fact:'电磁场可以束缚离子，激光用于控制和读出。路由时刻盘来自编译工坊的研究任务。'},
 'ops-photon':{name:'Dr. Ren',role:'光量子研究员',gender:'男',coat:'#ab7d49',intro:'我是 Dr. Ren，负责光量子计算机。跟着光路和探测器，一起找出结果的线索。',fact:'光子可承载量子信息，探测器把测量变成记录；这里的光路与统计展示是教学模型。'},
 measurement:{name:'Dr. Park',role:'测量港研究员',gender:'女',coat:'#6793ac',intro:'我是 Dr. Park。测量港把观察变成纸条，再用纸条控制后续操作。',fact:'交换经典记录不会改变量子输入。重置和条件反馈要分别检查两种可能的测量历史。'},
 compiler:{name:'Dr. Patel',role:'编译工程师',gender:'男',coat:'#a18961',intro:'我是 Dr. Patel。编译工坊把量子线路翻译成硬件能执行的安排。',fact:'逻辑比特像乘客，物理位置像座位。交换之后要继续跟踪乘客；并行操作不能占用同一个资源。'},
 hardware:{name:'Dr. Sharma',role:'阵列调度员',gender:'女',coat:'#658f70',intro:'我是 Dr. Sharma。先确认座位里有原子，再讨论它们的量子状态。',fact:'空座位不是0态。CZ会改变联合相位，普通ZZ测量未必看得出，要选择适合的观察镜。'},
 pulse:{name:'Dr. Gao',role:'脉冲研究员',gender:'男',coat:'#8974aa',intro:'我是 Dr. Gao。这里研究理想控制与实际噪声之间的差别。',fact:'目标成功率高还不够，要检查泄漏。算法迭代也不是越多越好，要比较不同轮数与噪声。'},
 voyage:{name:'Rui',role:'航行记录官',gender:'男',coat:'#ac8157',intro:'我是云海星的水母居民 Rui，负责记录航行准备。舰长需要确认实验、装配和保护系统全部就绪。',fact:'起航清单同时检查六章、四机装配和启动、纠错与四件升级。研究日志记录已经得到的发现。'}
};
export function npcClue(room,c={}){if(room==='ops-ion')return ionObjective(normalizeIon(c.ion));const e=normalizeExpedition(c.expedition),a=c.adventure||{},q=normalizeCampaign(c.campaign),t=normalizeTweezer(c.tweezer);
 if(room==='ops-photon')return phObjective(normalizePH(c.photonic))+'。进入中央检修台，蓝图会标出每根线的发送口与接收口。';
 if(room==='ops-sc')return scObjective(normalizeSC(c.superconducting))+'。点击中央检修台进入超导工坊；机柜和剖面的端口可跨视图连接。';
 if(room==='ops-neutral'){if(!t.completed)return getNextObjective(t)+(t.chassisInstalled?'。具体校准：M1 45°、M2 135°，SLM为010/111/010，调焦55–70。':'。点击房间中央的检修台进入工坊，先看蓝图。');return e.corrected.length<3?'五阱三原子完成了！接下来在逻辑守护训练中修复左、中、右三种故障。':'捕获与逻辑保护已就绪。若贝尔桥已激活，可启动原主线计算机；第五章还能获得阵列定位晶体。';}
 if(room==='plaza')return !a.items?.includes('lens')?'去星际储藏室左侧旧航海箱找星光透镜。':!a.items?.includes('cell')?'去星窗观测室，亲手翻转小灯两次，给稳态电池充能。':!a.beacon?'两件道具齐了，回广场中央修复星图信标。':'信标已经点亮！从态制备舱开始，或去航线廊查看后续四章。';
 if(room==='storage')return !a.items?.includes('lens')?'星光透镜在左侧旧航海箱，不在中央配件货架。':'中央零件货架有微波与电极模块；分别完成02-1、02-3激活，再带回对应操作室。';
 if(room==='observatory')return !a.items?.includes('cell')?'电池需要完成翻转小灯实验：从关开始，两次翻转后又关上。':'右侧光学配件台保留主线配件入口。新光镊工坊的底座和九件零件，要到中性原子室的箱柜亲手寻找。';
 if(room==='chapter'){const i=[0,1,2,3].find(i=>!(c.first?.stars?.[i]>0));return i===undefined?'四台终端已修复，去纠缠桥继续双比特实验。':[`第一台：先预测1，把一个X放入空槽再运行。`,`第二台：一个H可准备各半；少量样本不一定恰好平分。`,`第三台：在两个H之间放Z，查看前两步快照与最后测量的区别。`,`第四台：调节RY角度让1的理论概率接近75%，约120°，再比较另一个角度。`][i];}
 if(room==='bridge'){const i=e.done.findIndex(x=>!x);return i<0?'四座桥完成。去操作室装配，或练习三盏灯纠错，再前往测量港。':[`双轨开关：从10加入CX得到11，然后保留CX并切换叠加输入再收集。`,`成对星桥：只要一个H0，再接CX；目标态普通测量是00或11。`,`先收集贝尔态和经典混合的ZZ结果，再比较两者的XX结果。`,`加入Z后，ZZ概率可不变；切到XX查看联合相位改变。`][i];}
 const m={'ops-sc':['sc',0,'储藏室微波模块','第六章稳相控制环'],'ops-ion':['ion',2,'储藏室电极模块','第四章路由时刻盘'],'ops-photon':['photon',3,'观测室光路探测模块','第三章记录晶片']}[room];if(m){if(!e.parts.includes(m[0]))return '先找'+m[2]+'，完成02-'+(m[1]+1)+'后回来装配。';if(!e.done[m[1]])return '配件已经找到，去纠缠桥完成02-'+(m[1]+1)+'激活。';if(!e.installed.includes(m[0]))return '配件已激活，打开中央检修台，将它拖到同形接口。';if(e.corrected.length<3)return `还差逻辑守护训练：已完成${e.corrected.length}/3。红绿校验灯帮助定位单次翻转。`;return '可启动教学计算机。航行升级来自'+m[3]+'。';}
 const lessons={measurement:['measurement',['分别收集1、64、256次并比较样本与金色理论线。','交换c0/c1接线，只交换打印记录，不改输入小灯。','两种历史都要试，先重置再X，检查末端都为1。','分别测量两条分支，再用记录控制是否翻转。']],compiler:['compiler',['H1→CZ→H1可分解CX，顺序和目标位要一致。','把要交互的逻辑比特安排到有连边的物理座位。','执行SWAP后继续跟踪逻辑乘客，别把P当成q。','把H0和H2放第1层，CZ01和CZ23放第2层；资源不冲突。']],hardware:['hardware',['检查连接图，只连接允许相邻的座位。','先装载A/B，再翻转A；空座位不是暗灯。','两颗都H准备，比较有CZ与无CZ，再用H1观察镜。','收集含空座位的样本，空位标记不能归入0态。']],pulse:['pulse',['分别比较理想、噪声和读出误差，绿色条是真实样本。','先H、等待、再H；等待时直接Z依旧各半。','先观察卡A和卡B，目标≥90%且泄漏≤1%才合适。','比较0到3轮，再比较两轮噪声模型；本例两轮更合适。']]};
 if(lessons[room]){const [key,clues]=lessons[room],i=q[key].findIndex(v=>!v);return i<0?'本章四关完成！带航行升级去对应操作室，或从航线廊前往下一章。':`先到0${{measurement:3,compiler:4,hardware:5,pulse:6}[room]}-${i+1}：${clues[i]}`;}
 if(room==='deck')return `目前教学机器已运行${e.runs.length}/4。中性原子室有完整光镊工坊；其余机器先搜寻、激活、装配，再完成纠错。`;
 if(room==='voyage')return '点击右侧起航装置查看缺项；第三至六章入口依次排列，上一章四关完成后解锁下一章。';
 return residents[room]?.fact||'可以打开航线图寻找下一间实验室。';}
export function readNpcContext(storage=localStorage){const read=k=>{try{return JSON.parse(storage.getItem(k)||'null')}catch{return null}};return {first:read('spaceqat-chapter1-v1'),expedition:read('spaceqat-expedition-v2'),campaign:read('spaceqat-campaign-v1'),adventure:read('spaceqat-adventure-v1'),tweezer:read(TWEEZER_KEY),superconducting:read(SC_KEY),photonic:read(PH_KEY),ion:read(ION_KEY)}}
