export const data={
 "schemaVersion": 1,
 "levelId": "sc_cold_start",
 "displayName": "超导量子操作室：唤醒零下宇宙",
 "targetAudience": "小学高年级、初中、高中",
 "views": [
  {
   "id": "room_overview",
   "logicalWidth": 1000,
   "logicalHeight": 600
  },
  {
   "id": "rack_closeup",
   "logicalWidth": 1000,
   "logicalHeight": 600
  },
  {
   "id": "fridge_cutaway",
   "logicalWidth": 1000,
   "logicalHeight": 600
  }
 ],
 "pieces": [
  {
   "id": "drive_source",
   "name": "微波脉冲源",
   "scene": "rack_closeup",
   "slot": {
    "x": 0.23,
    "y": 0.24
   },
   "temperatureStage": "room",
   "ports": [
    "OUT"
   ],
   "iconKey": "sc_drive_source"
  },
  {
   "id": "readout_source",
   "name": "读出微波源",
   "scene": "rack_closeup",
   "slot": {
    "x": 0.23,
    "y": 0.47
   },
   "temperatureStage": "room",
   "ports": [
    "OUT"
   ],
   "iconKey": "sc_readout_source"
  },
  {
   "id": "room_amp",
   "name": "室温接收放大器",
   "scene": "rack_closeup",
   "slot": {
    "x": 0.73,
    "y": 0.3
   },
   "temperatureStage": "room",
   "ports": [
    "IN",
    "OUT"
   ],
   "iconKey": "sc_room_amp"
  },
  {
   "id": "digitizer",
   "name": "采集与判读仪",
   "scene": "rack_closeup",
   "slot": {
    "x": 0.73,
    "y": 0.54
   },
   "temperatureStage": "room",
   "ports": [
    "IN"
   ],
   "iconKey": "sc_digitizer"
  },
  {
   "id": "temp_controller",
   "name": "温度监测控制台",
   "scene": "rack_closeup",
   "slot": {
    "x": 0.73,
    "y": 0.79
   },
   "temperatureStage": "room",
   "ports": [
    "MONITOR_OUT"
   ],
   "iconKey": "sc_temp_controller"
  },
  {
   "id": "feedthrough",
   "name": "顶部密封进线座",
   "scene": "fridge_cutaway",
   "slot": {
    "x": 0.5,
    "y": 0.12
   },
   "temperatureStage": "300K",
   "ports": [
    "DRIVE_ROOM_IN",
    "READOUT_ROOM_IN",
    "INPUT_CRYO_BUNDLE_OUT",
    "CRYO_RETURN_IN",
    "ROOM_RETURN_OUT"
   ],
   "iconKey": "sc_feedthrough"
  },
  {
   "id": "attenuator_4k",
   "name": "4 K 双通道衰减盒",
   "scene": "fridge_cutaway",
   "slot": {
    "x": 0.31,
    "y": 0.43
   },
   "temperatureStage": "4K",
   "ports": [
    "BUNDLE_IN",
    "BUNDLE_OUT"
   ],
   "iconKey": "sc_attenuator_4k"
  },
  {
   "id": "attenuator_100mk",
   "name": "100 mK 双通道衰减盒",
   "scene": "fridge_cutaway",
   "slot": {
    "x": 0.31,
    "y": 0.69
   },
   "temperatureStage": "100mK",
   "ports": [
    "BUNDLE_IN",
    "BUNDLE_OUT"
   ],
   "iconKey": "sc_attenuator_100mk"
  },
  {
   "id": "filter_20mk",
   "name": "20 mK 双通道滤波盒",
   "scene": "fridge_cutaway",
   "slot": {
    "x": 0.39,
    "y": 0.84
   },
   "temperatureStage": "20mK",
   "ports": [
    "BUNDLE_IN",
    "BUNDLE_OUT"
   ],
   "iconKey": "sc_filter_20mk"
  },
  {
   "id": "qubit_cartridge",
   "name": "超导量子芯片盒",
   "scene": "fridge_cutaway",
   "slot": {
    "x": 0.55,
    "y": 0.84
   },
   "temperatureStage": "20mK",
   "ports": [
    "INPUT_PAIR",
    "READOUT_OUT"
   ],
   "iconKey": "sc_qubit_cartridge"
  },
  {
   "id": "isolator_20mk",
   "name": "低温读出隔离器",
   "scene": "fridge_cutaway",
   "slot": {
    "x": 0.74,
    "y": 0.84
   },
   "temperatureStage": "20mK",
   "ports": [
    "IN",
    "OUT"
   ],
   "iconKey": "sc_isolator_20mk"
  },
  {
   "id": "hemt_4k",
   "name": "低温 HEMT 放大器",
   "scene": "fridge_cutaway",
   "slot": {
    "x": 0.75,
    "y": 0.43
   },
   "temperatureStage": "4K",
   "ports": [
    "IN",
    "OUT"
   ],
   "iconKey": "sc_hemt_4k"
  }
 ],
 "hotspots": [
  {
   "id": "pulse_drawer",
   "label": "双层微波抽屉",
   "items": [
    "drive_source",
    "readout_source"
   ],
   "x": 0.16,
   "y": 0.25
  },
  {
   "id": "measure_shelf",
   "label": "测量仪器架",
   "items": [
    "room_amp",
    "digitizer"
   ],
   "x": 0.16,
   "y": 0.42
  },
  {
   "id": "temp_case",
   "label": "温控工具箱",
   "items": [
    "temp_controller"
   ],
   "x": 0.14,
   "y": 0.77
  },
  {
   "id": "seal_box",
   "label": "顶部接线长木箱",
   "items": [
    "feedthrough"
   ],
   "x": 0.35,
   "y": 0.8
  },
  {
   "id": "cold_4k_drawer",
   "label": "4K 冷件抽屉",
   "items": [
    "attenuator_4k",
    "hemt_4k"
   ],
   "x": 0.85,
   "y": 0.33
  },
  {
   "id": "cold_100mk_drawer",
   "label": "100mK 冷件抽屉",
   "items": [
    "attenuator_100mk"
   ],
   "x": 0.85,
   "y": 0.48
  },
  {
   "id": "filter_case",
   "label": "滤波元件工具箱",
   "items": [
    "filter_20mk"
   ],
   "x": 0.88,
   "y": 0.69
  },
  {
   "id": "chip_vault",
   "label": "芯片防尘柜",
   "items": [
    "qubit_cartridge"
   ],
   "x": 0.89,
   "y": 0.19
  },
  {
   "id": "return_box",
   "label": "读出隔离器盒",
   "items": [
    "isolator_20mk"
   ],
   "x": 0.64,
   "y": 0.84
  }
 ],
 "fixedPorts": [
  {
   "deviceId": "fixed_temperature_bus",
   "portId": "IN",
   "scene": "fridge_cutaway",
   "x": 0.87,
   "y": 0.15
  }
 ],
 "connections": [
  {
   "id": "W01_drive_to_cap",
   "fromPort": "drive_source.OUT",
   "toPort": "feedthrough.DRIVE_ROOM_IN",
   "signalType": "drive",
   "renderAsParallelStrands": false
  },
  {
   "id": "W02_readout_to_cap",
   "fromPort": "readout_source.OUT",
   "toPort": "feedthrough.READOUT_ROOM_IN",
   "signalType": "readout_in",
   "renderAsParallelStrands": false
  },
  {
   "id": "W03_cap_to_4k",
   "fromPort": "feedthrough.INPUT_CRYO_BUNDLE_OUT",
   "toPort": "attenuator_4k.BUNDLE_IN",
   "signalType": "dual_input",
   "renderAsParallelStrands": true
  },
  {
   "id": "W04_4k_to_100mk",
   "fromPort": "attenuator_4k.BUNDLE_OUT",
   "toPort": "attenuator_100mk.BUNDLE_IN",
   "signalType": "dual_input",
   "renderAsParallelStrands": true
  },
  {
   "id": "W05_100mk_to_filter",
   "fromPort": "attenuator_100mk.BUNDLE_OUT",
   "toPort": "filter_20mk.BUNDLE_IN",
   "signalType": "dual_input",
   "renderAsParallelStrands": true
  },
  {
   "id": "W06_filter_to_qpu",
   "fromPort": "filter_20mk.BUNDLE_OUT",
   "toPort": "qubit_cartridge.INPUT_PAIR",
   "signalType": "dual_input",
   "renderAsParallelStrands": true
  },
  {
   "id": "W07_qpu_to_isolator",
   "fromPort": "qubit_cartridge.READOUT_OUT",
   "toPort": "isolator_20mk.IN",
   "signalType": "readout_out",
   "renderAsParallelStrands": false
  },
  {
   "id": "W08_isolator_to_hemt",
   "fromPort": "isolator_20mk.OUT",
   "toPort": "hemt_4k.IN",
   "signalType": "readout_out",
   "renderAsParallelStrands": false
  },
  {
   "id": "W09_hemt_to_cap",
   "fromPort": "hemt_4k.OUT",
   "toPort": "feedthrough.CRYO_RETURN_IN",
   "signalType": "readout_out",
   "renderAsParallelStrands": false
  },
  {
   "id": "W10_cap_to_amp",
   "fromPort": "feedthrough.ROOM_RETURN_OUT",
   "toPort": "room_amp.IN",
   "signalType": "readout_out",
   "renderAsParallelStrands": false
  },
  {
   "id": "W11_amp_to_digitizer",
   "fromPort": "room_amp.OUT",
   "toPort": "digitizer.IN",
   "signalType": "readout_out",
   "renderAsParallelStrands": false
  },
  {
   "id": "W12_temp_bus",
   "fromPort": "temp_controller.MONITOR_OUT",
   "toPort": "fixed_temperature_bus.IN",
   "signalType": "thermal",
   "renderAsParallelStrands": false
  }
 ],
 "temperatureStages": [
  {
   "id": "300K",
   "representativeKelvin": 300,
   "display": "~300 K",
   "y": 0.12,
   "playerLabel": false
  },
  {
   "id": "50K",
   "representativeKelvin": 50,
   "display": "~50 K",
   "y": 0.28,
   "playerLabel": true
  },
  {
   "id": "4K",
   "representativeKelvin": 4,
   "display": "~4 K",
   "y": 0.43,
   "playerLabel": true
  },
  {
   "id": "800mK",
   "representativeKelvin": 0.8,
   "display": "~800 mK",
   "y": 0.57,
   "playerLabel": false
  },
  {
   "id": "100mK",
   "representativeKelvin": 0.1,
   "display": "~100 mK",
   "y": 0.69,
   "playerLabel": true
  },
  {
   "id": "20mK",
   "representativeKelvin": 0.02,
   "display": "~20 mK",
   "y": 0.84,
   "playerLabel": true
  }
 ],
 "temperatureLabels": [
  "50K",
  "4K",
  "100mK",
  "20mK"
 ],
 "fasteners": [
  "NW",
  "NE",
  "SW",
  "SE"
 ],
 "shieldLatches": [
  "left",
  "right"
 ],
 "pulseCalibration": {
  "minWidth": 0,
  "maxWidth": 100,
  "targetWindow": [
   92,
   100
  ],
  "idealP1": "sin(pi * pulseWidth / 200)^2",
  "notes": "教学玩具模型：宽度 100 对应 X 旋转，宽度 50 对应 X/2"
 },
 "readoutCalibration": {
  "optionsGHz": [
   6.2,
   6.5,
   6.8
  ],
  "targetGHz": 6.5,
  "notes": "虚构谐振器的游戏示例，不是物理器件统一参数"
 },
 "measurement": {
  "shots": 20,
  "goodReadoutBitFlipRate": 0.03,
  "poorReadoutBitFlipRate": 0.16,
  "seededRandom": true
 },
 "uiConstraints": {
  "noAutoInstall": true,
  "noAutoWire": true,
  "keepOtherLevels": true,
  "useOriginalPixelAssets": true
 },
 "referenceNotice": "仅供游戏教学的参数和空间布局示例；非真实实验构建手册。"
};

export const KEY='spaceqat.superconducting.sc_cold_start.v1';
export const {pieces,hotspots,connections:wires,temperatureStages:stages,temperatureLabels:labels,fasteners,shieldLatches:latches}=data;
export const names=Object.fromEntries(pieces.map(p=>[p.id,p.name]));
export const views={room_overview:'实验室总览',rack_closeup:'室温机柜',fridge_cutaway:'制冷机剖面'};
export const colors={drive:'#66d8ed',readout_in:'#f7c86d',dual_input:'#66d8ed',readout_out:'#ba8ee4',thermal:'#9bca77'};
export const ports=pieces.flatMap(p=>p.ports.map((name,i)=>{let x=p.slot.x+(i===0?-.075:.075),y=p.slot.y-.055;
 if(p.id==='feedthrough'){x=.30+i*.10;y=.205;}
 return {id:p.id+'.'+name,piece:p.id,name,scene:p.scene,x,y,direction:wires.some(w=>w.fromPort===p.id+'.'+name)?'out':'in'};
})).concat([{id:'fixed_temperature_bus.IN',piece:'fixed_temperature_bus',name:'温度总线输入',scene:'fridge_cutaway',x:.90,y:.12,direction:'in'}]);
export const port=id=>ports.find(p=>p.id===id);
export const wireName=w=>(names[w.fromPort.split('.')[0]]||'温度总线')+' → '+(names[w.toPort.split('.')[0]]||'温度总线');
export const portName=id=>{const p=port(id);return p?(names[p.piece]||'内置温度总线')+' · '+p.name:''};
export function hitAnchor(rect,x,y,anchor){return Math.hypot((x-rect.left)/rect.width-anchor.x,((y-rect.top)/rect.height-anchor.y)*.6)<=.06;}
export const descriptions={
 drive_source:'微波脉冲源在室温机柜发送控制信号。宽度改变波形和预计概率。',readout_source:'这条微波用来探测读出谐振器，与控制输入是独立的通道。',room_amp:'把低温回来的读出信号再放大，送入采集仪。',digitizer:'将测量信号判为经典0或1。重复实验才能估计概率。',temp_controller:'连接已内置的温度总线，显示各层教学模拟值。',feedthrough:'密封进线座分开控制输入、读出输入和返回输出。双线束代表两根线，不是混成一根。',attenuator_4k:'4 K层的双通道衰减器帮助减少室温线路带下来的热噪声；它不放大信号。',attenuator_100mk:'100 mK冷板的双通道衰减器继续抑制输入噪声。',filter_20mk:'最冷层的双通道滤波盒，分别滤波控制与读出输入。',qubit_cartridge:'铜盒里是电路芯片，不是发光原子球。四角固定后才可锁闭。',isolator_20mk:'读出隔离器是单向守门员，箭头沿返回路线指向4 K放大器。',hemt_4k:'HEMT低噪放大器放在4 K层，不是最底部20 mK芯片座。'};
export const knowledge=[
 ['认识量子芯片','本关以transmon电路示意：电容电极、约瑟夫森结和读出谐振器。不同设备的设计并不完全相同。'],
 ['为什么要冷','极低温减少热激发和热环境干扰；仍需要屏蔽、滤波和低噪读出。K是开尔文，mK是千分之一K。'],
 ['衰减与放大','输入衰减盒减弱信号和噪声；输出回路用隔离器减少反向干扰，再由HEMT放大弱读出。'],
 ['教学简化','压缩机、气体循环、真空及低温核心已由专业人员安装。本关只操作虚拟教学装置，不能用12件游戏零件建造真实量子计算机。'],
 ['X与X/2','玩具模型θ=π×宽度/100，理想P(1)=sin²(θ/2)。100约为X，50约为X/2，游戏宽度没有真实ns单位。'],
 ['统计与读出','一次测量只有0或1，多次统计估计概率。6.5 GHz和读出误差仅为本关示例，并非真实设备指标。专业系统还可能有JPA/TWPA等放大级。']];
// Spread the bottom-stage coax connectors around the three adjacent devices.
const bottomPorts={'filter_20mk.BUNDLE_IN':[.315,.77],'filter_20mk.BUNDLE_OUT':[.43,.96],'qubit_cartridge.INPUT_PAIR':[.51,.96],'qubit_cartridge.READOUT_OUT':[.59,.96],'isolator_20mk.IN':[.69,.96],'isolator_20mk.OUT':[.815,.77]};
for(const [id,[x,y]] of Object.entries(bottomPorts))Object.assign(ports.find(p=>p.id===id),{x,y});
