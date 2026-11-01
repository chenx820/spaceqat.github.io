export const KEY='spaceqat.neutralAtom.tweezer.v1';
export const pattern=[false,true,false,true,true,true,false,true,false];
export const pieces=[
 ['laser','捕获激光器',.14,.35,'laser_cabinet','聚焦前的捕获光源，蓝色口朝向第一面镜子。'],
 ['mirror1','反射镜 M1',.29,.35,'mirror_drawer_a','把向右的光折向下方，试试45°。'],
 ['slm','SLM 调制器',.29,.62,'slm_box','塑造多点光场；本游戏用十字图案代表五个光阱。'],
 ['mirror2','反射镜 M2',.48,.62,'mirror_drawer_b','把向右的光折向上方，试试135°。'],
 ['dichroic','分色镜',.48,.35,'mirror_drawer_b','将捕获光导向物镜，将荧光导向相机；是简化二维示意。'],
 ['objective','显微物镜',.68,.35,'optics_rack','把捕获光聚焦到原子区域，调焦到55–70。'],
 ['camera','成像相机',.48,.12,'camera_shelf','记录荧光来检查占据情况。有光阱不等于已有原子。'],
 ['power','电源控制盒',.17,.84,'control_cart','金线给激光器和控制器供电，接好两线才可开实体开关。'],
 ['controller','数字控制板',.69,.84,'control_cart','传送SLM图案，并接收相机数据。']
].map(([id,name,x,y,hotspot,description])=>({id,name,x,y,hotspot,description,accept:id}));
export const hotspots=[
 ['bench_crate','橡木工具箱',.13,.72,'chassis'],['laser_cabinet','激光器柜',.12,.28,'laser'],
 ['mirror_drawer_a','光学小抽屉',.28,.26,'mirror1'],['mirror_drawer_b','双镜托架抽屉',.47,.27,'mirror2'],
 ['slm_box','黑色防尘盒',.39,.13,'slm'],['optics_rack','物镜仪器架',.68,.19,'objective'],
 ['camera_shelf','相机储物架',.86,.28,'camera'],['control_cart','控制工具车',.84,.72,'controller']
].map(([id,name,x,y,art])=>({id,name,x,y,art,items:id==='bench_crate'?['chassis']:pieces.filter(p=>p.hotspot===id).map(p=>p.id)}));
export const ports=[
 ['power.outLaser','power',.115,.79,'电源·激光输出'],['laser.inPower','laser',.10,.44,'激光·电源输入'],
 ['power.outControl','power',.23,.88,'电源·控制输出'],['controller.inPower','controller',.63,.91,'控制·电源输入'],
 ['controller.outSLM','controller',.64,.76,'控制·图案输出'],['slm.inControl','slm',.20,.62,'SLM·数据输入'],
 ['camera.outData','camera',.55,.12,'相机·数据输出'],['controller.inCamera','controller',.75,.85,'控制·相机输入']
].map(([id,piece,x,y,label])=>({id,piece,x,y,label}));
export const wires=[
 {id:'laserPower',from:'power.outLaser',to:'laser.inPower',name:'激光电源',kind:'power'},
 {id:'controllerPower',from:'power.outControl',to:'controller.inPower',name:'控制电源',kind:'power'},
 {id:'slmControl',from:'controller.outSLM',to:'slm.inControl',name:'SLM 图案',kind:'data'},
 {id:'cameraData',from:'camera.outData',to:'controller.inCamera',name:'相机数据',kind:'data'}
];
export const opticalPath=['laser','mirror1','slm','mirror2','dichroic','objective','atomChamber'];
export const chamber={id:'atomChamber',x:.88,y:.35};
export const intro='哎呀，光镊阵列的零件被整理进了不同柜子！先找找工作台旁边的光路图吧。';
export const knowledge='这是简化的光学装配教学，不是真实实验的完整搭建指南。真空、冷却/装载与安全互锁已内置。SLM塑造光阱，物镜聚焦捕获光，相机记录荧光；光阱不一定有原子。后续可用偏转光束搬运原子。';
export const pos=id=>pieces.find(p=>p.id===id)||chamber;
export const port=id=>ports.find(p=>p.id===id);
export function cablePoints(w){const a=port(w.from),b=port(w.to);return `${a.x*1000},${a.y*560} ${a.x*1000},${(a.y+b.y)*280} ${b.x*1000},${(a.y+b.y)*280} ${b.x*1000},${b.y*560}`}
export function toLogical(rect,x,y){return {x:(x-rect.left)/rect.width*1000,y:(y-rect.top)/rect.height*560}}
export function hitSlot(rect,x,y,id){const p=id==='chassis'?{x:.5,y:.5}:pos(id),q=toLogical(rect,x,y);return Math.hypot(q.x-p.x*1000,q.y-p.y*560)<=Math.max(36,22*1000/rect.width)}

