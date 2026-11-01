// Shared educational labels: nicknames never replace scientific names or state.
import {names,port,wires} from './config.js';
const card=(title,subtitle,sentences)=>({title,subtitle,sentences});
export const science={
 drive_source:card('节拍指挥盒','微波脉冲源 · Microwave drive',['它像给量子比特打节拍的指挥员，用微波脉冲控制状态。','脉冲的幅度、时长和相位都会影响操作，本关只让你调宽度。','这里的节拍是比喻，游戏宽度不是实际设备的时间单位。']),
 readout_source:card('回声问讯盒','读出微波源 · Readout source',['它像向回声房轻轻问一句话，把微波送进读出谐振器。','量子比特状态会改变返回信号的特征，仪器据此进行判读。','它与控制脉冲走不同的输入通道，不是用光照着看芯片。']),
 room_amp:card('回信扩音盒','室温接收放大器 · Room amplifier',['冷端传回的信号像很轻的回信，需要继续放大。','这台室温放大器接在低温读出链之后，把信号交给采集仪。','放大器也会引入噪声，放大不等于凭空恢复所有信息。']),
 digitizer:card('答案记录员','采集与判读仪 · Digitizer',['它像记录员，把模拟读出信号采集后判为0或1。','每轮重新准备再测量，多轮统计才能估计结果概率。','20次不保证刚好符合理论比例，也不是直接看见量子态。']),
 temp_controller:card('寒冷气象站','温度监测控制台 · Thermometry',['它像分层气象站，读取各个冷板的温度。','真正带走热量的是制冷系统，温度计本身不负责降温。','这里显示的是教学模拟值，不是真实设备传感器数据。']),
 feedthrough:card('信号海关','顶部密封进线座 · Feedthrough',['它像信号进出冷宫的海关，让线路穿过密封边界。','控制输入、读出输入和读出返回分别经过各自的端口。','双色线束表示两根独立线路，不是把两种功能混成一根线。']),
 attenuator_4k:card('第一道降噪驿站','4 K 双通道衰减盒 · Attenuator',['把室温线路的热噪声想成跟着信号来的小火苗。','冷板上充分热化的衰减器减弱信号，并抑制从较暖处传来的噪声。','它不是冰块或制冷机，也不是只减噪声却不减信号的魔法盒。']),
 attenuator_100mk:card('第二道降噪驿站','100 mK 双通道衰减盒 · Attenuator',['信号继续向更冷的楼层前进，再经过一道降噪驿站。','这一层的衰减器与冷板热接触，进一步抑制输入线路带来的热噪声。','逐级衰减也会减弱控制信号，因此工程师需要校准输入功率。']),
 filter_20mk:card('杂波筛选门','20 mK 双通道滤波盒 · Filter',['它像按频率挑选访客的筛选门，减少不需要的频段。','控制输入和读出输入各有滤波通道，目标是减少杂散干扰。','滤波不能清除所有噪声，也不会让测量变成百分之百准确。']),
 qubit_cartridge:card('量子小屋','超导量子芯片盒 · Qubit package',['铜盒里住着由电路制成的量子比特，不是发光的小原子。','本关用含约瑟夫森结和电容的transmon电路作示意。','低温、屏蔽和合适的控制共同保护状态，量子信息依然可能出错。']),
 isolator_20mk:card('回信单向门','低温读出隔离器 · Isolator',['它像回信路上的单向门，让读出信号朝放大器前进。','隔离器有助于减少放大器一侧的反向噪声传回芯片。','它有实际损耗和有限隔离能力，不能保证绝对没有干扰。']),
 hemt_4k:card('低温回声放大盒','4 K HEMT低噪放大器',['芯片的回信很微弱，这个盒子先在低温处把它放大。','本关把HEMT放在4 K层，该层比最冷层能承受更多热负载。','它不是20 mK制冷部件，真实读出链还可能有其他放大级。']),
 '300K':card('温暖出发站','室温顶盖 · 约300 K',['这是室温仪器与冷端线路相接的出发站。','300 K约为27摄氏度，K使用开尔文温标。','“出发站”只是比喻，真实装置还需要真空与热屏蔽。']),
 '50K':card('第一层寒霜门','一级冷板 / 热屏蔽 · 目标约50 K',['这一层像挡住外面热风的第一道门。','预冷级带走热量，冷屏有助于减小传向更冷层的热辐射。','50 K仍高于绝对零度，本关的温度台阶是简化演示。']),
 '4K':card('深寒中转站','4 K冷板 · 目标约4 K',['这里是信号继续前往冷端的深寒中转站。','4 K层可承载本关的衰减器和HEMT放大器，并帮助线路热化。','4 K不是0 K，也不等于所有超导量子比特都能在这里正常工作。']),
 '800mK':card('冷却循环站','仍室 Still · 目标约800 mK',['这里像帮助冷却循环持续工作的中转站。','稀释制冷机的仍室帮助抽取富含氦3的气体，维持循环。','800 mK等于0.8 K，图中的逐层变冷不代表真实降温只需几秒。']),
 '100mK':card('深寒缓冲站','冷板 · 目标约100 mK',['到达最冷的小屋前，线路还要经过一道寒冷缓冲站。','冷板与线路和器件热接触，帮助减少传向最冷端的热负载。','100 mK等于0.1 K，这里的衰减盒仍然不会自己制造低温。']),
 '20mK':card('近零度冰宫','混合室冷板 · 目标约20 mK',['这里像给脆弱量子状态准备的安静冰宫，但不是绝对零度。','20 mK等于0.020 K，极低温帮助减少热激发与热噪声，仍需要屏蔽和滤波。','超导发生在材料的临界温度以下，并非必须恰好20 mK；进入超导态也不等于量子比特没有噪声。'])
};
export const dualLabel=id=>science[id]||card(names[id]||'温度总线',names[id]||'内置温度总线',[]);
export const friendlyWire=w=>`${dualLabel(port(w.fromPort).piece).title} → ${dualLabel(port(w.toPort).piece).title}`;
export function routeProgress(state){return [
 {title:'送出两封微波信',ids:wires.slice(0,2).map(w=>w.id)},
 {title:'经过冷端降噪驿站',ids:wires.slice(2,6).map(w=>w.id)},
 {title:'把芯片回信带回来',ids:wires.slice(6,11).map(w=>w.id)},
 {title:'接通寒冷气象站',ids:[wires[11].id]}
 ].map(g=>({...g,done:g.ids.filter(id=>state.connections.includes(id)).length,total:g.ids.length}));}
export const scienceSources=[['IBM：低温与热噪声','https://www.ibm.com/quantum/blog/modular-cryogenics'],['PRX Quantum：线路热噪声','https://doi.org/10.1103/PRXQuantum.5.030302']];
