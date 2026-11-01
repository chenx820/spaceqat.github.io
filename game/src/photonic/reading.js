import {names} from './config.js';

export const readingModes={
 story:{title:'童话冒险',icon:'✦',tag:'跟着 Qat 动手',description:'用小信使、接力镜和修正卡讲解。先告诉你怎么做，再解释为什么。'},
 explore:{title:'科学探索',icon:'⌕',tag:'观察现象，理解原理',description:'显示科学名称、角度数值、信号种类与测量因果关系。'},
 research:{title:'研究模式',icon:'Σ',tag:'核对公式与分支',description:'显示端口代号、测量基、前馈公式和分支回放；回放不计入实验成绩。'}
};
const friendly={clock:'节拍小钟',pump:'光源动力盒',source_top:'上路织网盒',source_bottom:'下路织网盒',delay_line:'光子的绕路盘',coupler_top:'上路接光头',coupler_bottom:'下路接光头',fusion_bs:'双路会合镜',fusion_detector_a:'接收铃 A',fusion_detector_b:'接收铃 B',herald_ctrl:'会合裁判盒',measurement_router:'测量分路器',analyzer_top:'上路接力镜',analyzer_bottom:'下路接力镜',measurement_detector_top:'上路读数盒',measurement_detector_bottom:'下路读数盒',feedforward:'读数回信盒'};
export function deviceName(id,mode){return mode==='story'?(friendly[id]||names[id]):names[id]}
export function angleLabel(a,mode){const direction=a<0?'↙ 左斜镜':a>0?'↗ 右斜镜':'↔ 平镜';return mode==='story'?direction:mode==='explore'?`${direction} · ${Math.round(a*180/Math.PI)}°${a===0?'（X基）':''}`:a===0?'B(0) · X基':`B(${a<0?'−':'+'}π/4)`}
const lessons={
 room_overview:[
  ['小信使出发前','先找会闪动的箱子。找到零件后，去同名安装座安家；不用等全部找齐。','光子像小信使，这只是比喻。它们沿光路传播，测量时会被探测器消耗。'],
  ['从器材到计算','青色线路传光，金色线路传时钟，绿色线路传经典读数。光路连通不代表已经完成量子计算。','本关采用偏振编码：H/V分别对应0/1。先准备纠缠资源，再通过测量推进计算。'],
  ['模型与验证约定','编码：|H⟩≡|0⟩，|V⟩≡|1⟩。封装资源源提供指定图态，CZ边表示逻辑纠缠关系。','融合是理想条件协议：P(success)=1/2。这里只演示小规模MBQC构件，不包含完整光学散射或噪声模型。']
 ],
 optical_bench:[
  ['给小信使接好路','先把背包零件放在相同图案的安装座。按蓝图的编号，先点 ▶ 发送口，再点 ◀ 接收口。','两路光子要同时到达。调节绕路盘，把两颗时间点对齐，再点“试发同步脉冲”。'],
  ['光路、时钟与符合判定','时钟使两路资源同步；耦合器把辅助光子送到分束器，探测后的经典信号送往符合判定控制器。','延迟只调节到达时间；真实干涉还要求偏振、频谱、空间模式匹配。本关由封装模块处理这些条件。'],
  ['路由与同步条件','13条玩家连接按发送→接收方向校验，12条固定内部路径单独显示。FT/FB是融合辅助叶，不是输出数据节点。','同步条件：全部装配、全部接线、泵浦开启且 |Δt|≤0.25 格。时间格为教学单位；改变延迟会使当前试次失效。']
 ],
 measurement_closeup:[
  ['读数决定下一步','接力镜决定怎样观察小信使。读数盒只给出0或1；出现1不是失败。','回信盒把这次读数送回去，提醒你下一面镜该怎么转。已读过的光子不能再读一次。'],
  ['破坏性测量与经典前馈','上、下轨分析器可独立选择 −45°、0°、+45°。0°对应X基；更改角度只影响未来测量。','探测器消耗光子并输出经典比特；经典线路将读数传给前馈控制器，再更新测量设置或修正记录。'],
  ['测量基与修正约定','B(α)={ (|0⟩+eⁱᵅ|1⟩)/√2, (|0⟩−eⁱᵅ|1⟩)/√2 }；两种投影分别记录为0、1。','三节点：α₁=−π/4，α₂=(−1)^s₁ π/4，输出修正 X^s₂ Z^s₁。角度由玩家选择，不自动替换。']
 ],
 wire:[
  ['三位小信使接力','先选 q0 的左斜镜。读到0，q1选右斜镜；读到1，q1仍选左斜镜。','最后把两个读数记到修正卡上。q2保留输出；前两颗光子已经被探测消耗。'],
  ['为什么第二面镜要改变','先以 −45°测量q0；若读数是0，q1用 +45°；若是1，q1改用 −45°。这就是自适应测量。','测量结果具有随机性，但按分支调整角度并修正输出后，四种读数组合应得到同一目标态。'],
  ['三节点计算公式','J(α)=H Rz(−α)；α₁=−π/4，α₂=(−1)^s₁ π/4；Pauli frame：X^s₂ Z^s₁。','投影按Born概率采样并移除被测节点。四分支回放强制选择读数，用于比较保真度，不改变当前实验。']
 ],
 bridge:[
  ['把两条接力路织成网','发射两片新资源，再尝试会合。失败就换一批，成功后中间才会出现桥。','按上左、下左、上中、下中的顺序用平镜观察。记下四个读数，再按提示填写修正卡。'],
  ['融合、测量与关联','融合消耗FT、FB两个辅助光子；成功留下六节点五条边。T0、B0、T1、B1按顺序在X基测量。','XZ与ZX分别检查两种联合关系，每次需要全新资源。单看ZZ均匀分布，不能证明纠缠。'],
  ['二维前馈与目标算符','令(a,b,c,d)=(sT0,sB0,sT1,sB1)。上轨 X^(c⊕b) Z^a；下轨 X^(d⊕a) Z^b。','U=(H⊗H)CZ(H⊗H)。输入|00⟩时，目标=(|00⟩+|01⟩+|10⟩−|11⟩)/2；理想目标满足 ⟨XZ⟩=⟨ZX⟩=+1。']
 ]
};
export function readingLesson(mode,view,graph='wire'){const level=['story','explore','research'].indexOf(mode);return lessons[view==='mbqc_graph_board'?graph:view]?.[Math.max(0,level)]||lessons.room_overview[0]}
export function readingPanel(mode,view,graph){const [title,...paragraphs]=readingLesson(mode,view,graph);return `<section class="ph-reading-panel"><h3>${title}</h3>${paragraphs.map(p=>`<p>${p}</p>`).join('')}</section>`}
