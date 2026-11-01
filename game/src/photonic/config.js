export const config={
  "$schemaNote": "Reference spec; adapt to existing game engine rather than assuming these are literal source paths.",
  "levelId": "photonic_mbqc_lab",
  "questId": "ph_weave_the_light",
  "title": "光量子操作室：织光成网",
  "locale": "zh-CN",
  "targets": {
    "minInstallations": 17,
    "requiredPlayerWires": 13,
    "hotspots": 12,
    "fusionDemoProbability": 0.5,
    "bridgeLogicalNodes": 6,
    "fusionConsumedLeaves": 2,
    "recommendedShotsPerSetting": 20
  },
  "views": {
    "room_overview": {
      "scene": "photonic_mbqc_lab",
      "role": "explore_and_navigate"
    },
    "optical_bench": {
      "logicalSize": [
        1800,
        720
      ],
      "role": "assemble_photon_generation_and_fusion",
      "areas": {
        "source": [
          0,
          0.49
        ],
        "fusion": [
          0.5,
          1
        ]
      }
    },
    "measurement_closeup": {
      "logicalSize": [
        1000,
        650
      ],
      "role": "assemble_measurement_and_feedforward"
    },
    "mbqc_graph_board": {
      "logicalSize": [
        1000,
        600
      ],
      "role": "interactive_abstract_graph_not_literal_still_photons"
    }
  },
  "pieces": [
    {
      "id": "clock",
      "label": "同步时钟盒",
      "view": "optical_bench",
      "position": {
        "x": 0.09,
        "y": 0.19
      },
      "area": "source",
      "ports": [
        "outTop",
        "outBottom"
      ],
      "state": "undiscovered"
    },
    {
      "id": "pump",
      "label": "光源驱动盒",
      "view": "optical_bench",
      "position": {
        "x": 0.09,
        "y": 0.57
      },
      "area": "source",
      "ports": [
        "outPumpTop",
        "outPumpBottom"
      ],
      "state": "undiscovered"
    },
    {
      "id": "source_top",
      "label": "上轨图态光子源",
      "view": "optical_bench",
      "position": {
        "x": 0.25,
        "y": 0.22
      },
      "area": "source",
      "ports": [
        "inClock",
        "inPump",
        "outFuse",
        "outData"
      ],
      "state": "undiscovered"
    },
    {
      "id": "source_bottom",
      "label": "下轨图态光子源",
      "view": "optical_bench",
      "position": {
        "x": 0.25,
        "y": 0.61
      },
      "area": "source",
      "ports": [
        "inClock",
        "inPump",
        "outFuse",
        "outData"
      ],
      "state": "undiscovered"
    },
    {
      "id": "delay_line",
      "label": "光纤延迟线",
      "view": "optical_bench",
      "position": {
        "x": 0.41,
        "y": 0.78
      },
      "area": "source",
      "ports": [
        "inTop",
        "inBottom",
        "outTop",
        "outBottom"
      ],
      "state": "undiscovered"
    },
    {
      "id": "coupler_top",
      "label": "上轨光纤耦合器",
      "view": "optical_bench",
      "position": {
        "x": 0.55,
        "y": 0.21
      },
      "area": "fusion",
      "ports": [
        "inFiber",
        "out"
      ],
      "state": "undiscovered"
    },
    {
      "id": "coupler_bottom",
      "label": "下轨光纤耦合器",
      "view": "optical_bench",
      "position": {
        "x": 0.55,
        "y": 0.61
      },
      "area": "fusion",
      "ports": [
        "inFiber",
        "out"
      ],
      "state": "undiscovered"
    },
    {
      "id": "fusion_bs",
      "label": "双光子干涉分束器",
      "view": "optical_bench",
      "position": {
        "x": 0.69,
        "y": 0.43
      },
      "area": "fusion",
      "ports": [
        "inA",
        "inB",
        "outA",
        "outB"
      ],
      "state": "undiscovered"
    },
    {
      "id": "fusion_detector_a",
      "label": "融合探测器 A",
      "view": "optical_bench",
      "position": {
        "x": 0.82,
        "y": 0.23
      },
      "area": "fusion",
      "ports": [
        "in",
        "outTTL"
      ],
      "state": "undiscovered"
    },
    {
      "id": "fusion_detector_b",
      "label": "融合探测器 B",
      "view": "optical_bench",
      "position": {
        "x": 0.82,
        "y": 0.62
      },
      "area": "fusion",
      "ports": [
        "in",
        "outTTL"
      ],
      "state": "undiscovered"
    },
    {
      "id": "herald_ctrl",
      "label": "符合判定控制器",
      "view": "optical_bench",
      "position": {
        "x": 0.93,
        "y": 0.43
      },
      "area": "fusion",
      "ports": [
        "inA",
        "inB"
      ],
      "state": "undiscovered"
    },
    {
      "id": "measurement_router",
      "label": "时序测量路由器",
      "view": "measurement_closeup",
      "position": {
        "x": 0.13,
        "y": 0.49
      },
      "area": "measurement",
      "ports": [
        "inFeedback",
        "outTop",
        "outBottom",
        "inTop",
        "inBottom"
      ],
      "state": "undiscovered"
    },
    {
      "id": "analyzer_top",
      "label": "上轨测量基分析器",
      "view": "measurement_closeup",
      "position": {
        "x": 0.43,
        "y": 0.24
      },
      "area": "measurement",
      "ports": [
        "in",
        "out",
        "inBasis"
      ],
      "state": "undiscovered"
    },
    {
      "id": "analyzer_bottom",
      "label": "下轨测量基分析器",
      "view": "measurement_closeup",
      "position": {
        "x": 0.43,
        "y": 0.72
      },
      "area": "measurement",
      "ports": [
        "in",
        "out",
        "inBasis"
      ],
      "state": "undiscovered"
    },
    {
      "id": "measurement_detector_top",
      "label": "上轨单光子探测器",
      "view": "measurement_closeup",
      "position": {
        "x": 0.69,
        "y": 0.23
      },
      "area": "measurement",
      "ports": [
        "in",
        "outTTL"
      ],
      "state": "undiscovered"
    },
    {
      "id": "measurement_detector_bottom",
      "label": "下轨单光子探测器",
      "view": "measurement_closeup",
      "position": {
        "x": 0.69,
        "y": 0.72
      },
      "area": "measurement",
      "ports": [
        "in",
        "outTTL"
      ],
      "state": "undiscovered"
    },
    {
      "id": "feedforward",
      "label": "实时前馈控制器",
      "view": "measurement_closeup",
      "position": {
        "x": 0.88,
        "y": 0.49
      },
      "area": "measurement",
      "ports": [
        "inTop",
        "inBottom",
        "outAngle"
      ],
      "state": "undiscovered"
    }
  ],
  "hotspots": [
    {
      "id": "wall_clock_case",
      "gives": [
        "clock"
      ],
      "visualClue": "墙边滴答的铜钟盒"
    },
    {
      "id": "pump_cabinet",
      "gives": [
        "pump"
      ],
      "visualClue": "光源区左侧带闪灯的低柜"
    },
    {
      "id": "top_source_vault",
      "gives": [
        "source_top"
      ],
      "visualClue": "上层透明防尘盒"
    },
    {
      "id": "bottom_source_vault",
      "gives": [
        "source_bottom"
      ],
      "visualClue": "下层带紫色图案的防尘盒"
    },
    {
      "id": "delay_crate",
      "gives": [
        "delay_line"
      ],
      "visualClue": "卷着盘线的木箱"
    },
    {
      "id": "fiber_case",
      "gives": [
        "coupler_top",
        "coupler_bottom"
      ],
      "visualClue": "双层光纤零件盒"
    },
    {
      "id": "splitter_drawer",
      "gives": [
        "fusion_bs"
      ],
      "visualClue": "镜片小抽屉"
    },
    {
      "id": "fusion_detector_shelf",
      "gives": [
        "fusion_detector_a",
        "fusion_detector_b"
      ],
      "visualClue": "两个像素计数灯的探测器架"
    },
    {
      "id": "herald_case",
      "gives": [
        "herald_ctrl"
      ],
      "visualClue": "带对勾灯的测量逻辑盒"
    },
    {
      "id": "analyzer_cart",
      "gives": [
        "measurement_router",
        "analyzer_top",
        "analyzer_bottom"
      ],
      "visualClue": "带两条测量轨道的推车"
    },
    {
      "id": "readout_rack",
      "gives": [
        "measurement_detector_top",
        "measurement_detector_bottom"
      ],
      "visualClue": "右墙的上下双光子探测器柜"
    },
    {
      "id": "control_lockbox",
      "gives": [
        "feedforward"
      ],
      "visualClue": "控制台旁边写有箭头的盒子"
    }
  ],
  "playerWires": [
    {
      "id": "sync_top",
      "from": "clock.outTop",
      "to": "source_top.inClock",
      "signalType": "clock",
      "purpose": "同步上轨光子源"
    },
    {
      "id": "sync_bottom",
      "from": "clock.outBottom",
      "to": "source_bottom.inClock",
      "signalType": "clock",
      "purpose": "同步下轨光子源"
    },
    {
      "id": "source_top_fuse",
      "from": "source_top.outFuse",
      "to": "coupler_top.inFiber",
      "signalType": "optical",
      "purpose": "上轨辅助光子进入融合区"
    },
    {
      "id": "source_bottom_fuse",
      "from": "source_bottom.outFuse",
      "to": "coupler_bottom.inFiber",
      "signalType": "optical",
      "purpose": "下轨辅助光子进入融合区"
    },
    {
      "id": "coupler_top_bs",
      "from": "coupler_top.out",
      "to": "fusion_bs.inA",
      "signalType": "optical",
      "purpose": "上轨光进入干涉器"
    },
    {
      "id": "coupler_bottom_bs",
      "from": "coupler_bottom.out",
      "to": "fusion_bs.inB",
      "signalType": "optical",
      "purpose": "下轨光进入干涉器"
    },
    {
      "id": "bs_detector_a",
      "from": "fusion_bs.outA",
      "to": "fusion_detector_a.in",
      "signalType": "optical",
      "purpose": "干涉输出 A 进入探测器"
    },
    {
      "id": "bs_detector_b",
      "from": "fusion_bs.outB",
      "to": "fusion_detector_b.in",
      "signalType": "optical",
      "purpose": "干涉输出 B 进入探测器"
    },
    {
      "id": "herald_a",
      "from": "fusion_detector_a.outTTL",
      "to": "herald_ctrl.inA",
      "signalType": "classical",
      "purpose": "探测器 A 的点击信息"
    },
    {
      "id": "herald_b",
      "from": "fusion_detector_b.outTTL",
      "to": "herald_ctrl.inB",
      "signalType": "classical",
      "purpose": "探测器 B 的点击信息"
    },
    {
      "id": "readout_top",
      "from": "measurement_detector_top.outTTL",
      "to": "feedforward.inTop",
      "signalType": "classical",
      "purpose": "上轨测量结果送入前馈"
    },
    {
      "id": "readout_bottom",
      "from": "measurement_detector_bottom.outTTL",
      "to": "feedforward.inBottom",
      "signalType": "classical",
      "purpose": "下轨测量结果送入前馈"
    },
    {
      "id": "adaptive_angle",
      "from": "feedforward.outAngle",
      "to": "measurement_router.inFeedback",
      "signalType": "classical",
      "purpose": "前馈更新下一轮测量角度"
    }
  ],
  "fixedInternalRoutes": [
    {
      "from": "pump.outPumpTop",
      "to": "source_top.inPump",
      "role": "visible prewired pump control; no dragging"
    },
    {
      "from": "pump.outPumpBottom",
      "to": "source_bottom.inPump",
      "role": "visible prewired pump control; no dragging"
    },
    {
      "from": "source_top.outData",
      "to": "delay_line.inTop",
      "role": "prewired top data modes; do not include the detected fusion leaf"
    },
    {
      "from": "source_bottom.outData",
      "to": "delay_line.inBottom",
      "role": "prewired bottom data modes; do not include the detected fusion leaf"
    },
    {
      "from": "delay_line.outTop",
      "to": "measurement_router.inTop",
      "role": "prewired top logical time-bin bus"
    },
    {
      "from": "delay_line.outBottom",
      "to": "measurement_router.inBottom",
      "role": "prewired bottom logical time-bin bus"
    },
    {
      "from": "measurement_router.outTop",
      "to": "analyzer_top.in",
      "role": "prewired optical path inside measurement console"
    },
    {
      "from": "measurement_router.outBottom",
      "to": "analyzer_bottom.in",
      "role": "prewired optical path inside measurement console"
    },
    {
      "from": "analyzer_top.out",
      "to": "measurement_detector_top.in",
      "role": "prewired optical measurement path"
    },
    {
      "from": "analyzer_bottom.out",
      "to": "measurement_detector_bottom.in",
      "role": "prewired optical measurement path"
    },
    {
      "from": "feedforward.outAngle",
      "to": "analyzer_top.inBasis",
      "role": "logical internal control path routed by router"
    },
    {
      "from": "feedforward.outAngle",
      "to": "analyzer_bottom.inBasis",
      "role": "logical internal control path routed by router"
    }
  ],
  "resourceRecipe": {
    "representation": "polarization qubits (|H>, |V>); abstract graph-state picture",
    "topFragment": {
      "nodes": [
        "T0",
        "T1",
        "T2",
        "FT"
      ],
      "edges": [
        [
          "T0",
          "T1"
        ],
        [
          "T1",
          "T2"
        ],
        [
          "T1",
          "FT"
        ]
      ]
    },
    "bottomFragment": {
      "nodes": [
        "B0",
        "B1",
        "B2",
        "FB"
      ],
      "edges": [
        [
          "B0",
          "B1"
        ],
        [
          "B1",
          "B2"
        ],
        [
          "B1",
          "FB"
        ]
      ]
    },
    "fusion": {
      "inputLeaves": [
        "FT",
        "FB"
      ],
      "consumesLeaves": true,
      "abstractSuccessEffect": "connect T1--B1 up to known local Clifford/Pauli corrections; yield canonical target graph after frame tracking",
      "idealSuccessProbability": 0.5,
      "failureEffect": "herald failure: discard and re-prepare fragment pair"
    },
    "targetGraph": {
      "nodes": [
        "T0",
        "B0",
        "T1",
        "B1",
        "T2",
        "B2"
      ],
      "edges": [
        [
          "T0",
          "T1"
        ],
        [
          "B0",
          "B1"
        ],
        [
          "T1",
          "T2"
        ],
        [
          "B1",
          "B2"
        ],
        [
          "T1",
          "B1"
        ]
      ],
      "boardNodes": [
        {
          "id": "T0",
          "x": 0.21,
          "y": 0.31
        },
        {
          "id": "B0",
          "x": 0.21,
          "y": 0.69
        },
        {
          "id": "T1",
          "x": 0.5,
          "y": 0.31
        },
        {
          "id": "B1",
          "x": 0.5,
          "y": 0.69
        },
        {
          "id": "T2",
          "x": 0.79,
          "y": 0.31
        },
        {
          "id": "B2",
          "x": 0.79,
          "y": 0.69
        }
      ]
    }
  },
  "mbqcPatterns": {
    "wire3": {
      "nodes": [
        0,
        1,
        2
      ],
      "edges": [
        [
          0,
          1
        ],
        [
          1,
          2
        ]
      ],
      "input": "plus",
      "baseAnglesRadians": [
        -0.7853981633974483,
        0.7853981633974483
      ],
      "order": [
        0,
        1
      ],
      "secondAngle": "(-1)^s1 * alpha2",
      "outputFrame": "X^s2 Z^s1",
      "gateConvention": "J(alpha)=H Rz(-alpha), B(alpha)=(|0> ± exp(i alpha)|1>)/sqrt(2)"
    },
    "bridge2x3": {
      "inputs": {
        "T0": "zero",
        "B0": "zero"
      },
      "measureOrder": [
        "T0",
        "B0",
        "T1",
        "B1"
      ],
      "allMeasurementBases": "X",
      "outputs": [
        "T2",
        "B2"
      ],
      "topFrame": {
        "x": "sT1 XOR sB0",
        "z": "sT0"
      },
      "bottomFrame": {
        "x": "sB1 XOR sT0",
        "z": "sB0"
      },
      "idealEffectiveGate": "(H tensor H) CZ (H tensor H)",
      "idealOutputFor00": "(|00>+|01>+|10>-|11>)/2",
      "checkCorrelations": [
        "X_top * Z_bottom = +1",
        "Z_top * X_bottom = +1"
      ],
      "warning": "Uniform Z/Z output histogram is NOT an entanglement witness"
    }
  },
  "questSteps": [
    "read_blueprint",
    "discover_parts",
    "assemble_17_slots",
    "connect_13_wires",
    "sync_delay_and_activate",
    "wire3_adaptive_measurement",
    "heralded_fusion",
    "bridge2x3_graph_and_measurement",
    "stabilizer_correlations",
    "complete"
  ],
  "uiSettings": {
    "snapRadiusLogicalPx": 38,
    "touchHitMinCSSPx": 44,
    "spriteGrid": 16,
    "viewportMode": "pixelated_integer_scale_when_possible",
    "reduceMotionSupported": true,
    "autoSave": true
  },
  "scopeAndSafety": {
    "noDangerousRealWorldAssembly": true,
    "simulateSourcesAndFusion": true,
    "photonDestructiveDetectors": true,
    "noFakeDeterministicFusion": true,
    "opticalPathsAreAbstract": true,
    "graphNodesAreNotTrappedPhotons": true,
    "twoDimensionalGraphIsSmallExampleNotArbitraryUniversalMachine": true
  }
};
export const KEY='spaceqat.photonic.mbqc.v1';
export const {pieces,hotspots,playerWires:wires,fixedInternalRoutes:fixed}=config;
export const views={room_overview:'实验室总览',optical_bench:'星光光学台',measurement_closeup:'测量与前馈机柜',mbqc_graph_board:'簇态图板'};
export const names=Object.fromEntries(pieces.map(p=>[p.id,p.label]));
export const sizes={optical_bench:[1800,720],measurement_closeup:[1000,650]};
export const colors={optical:'#80d8eb',clock:'#f8c875',classical:'#a4d286'};
// At least 48px between neighboring interactive connectors at 1× zoom.
export const ports=pieces.flatMap(p=>{const active=p.ports.filter(n=>wires.some(w=>[w.from,w.to].includes(p.id+'.'+n)));return active.map(n=>{const id=p.id+'.'+n,w=wires.find(w=>[w.from,w.to].includes(id)),out=w.from===id,same=active.filter(k=>wires.some(e=>(out?e.from:e.to)===p.id+'.'+k)),i=same.indexOf(n),[width,height]=sizes[p.view];return {id,piece:p.id,view:p.view,out,type:w.signalType,x:p.position.x+(out?76:-76)/width,y:p.position.y+(i-(same.length-1)/2)*54/height};});});
export const getPort=id=>ports.find(p=>p.id===id);
export const connectionName=w=>names[w.from.split('.')[0]]+' → '+names[w.to.split('.')[0]];
export const order=['T0','B0','T1','B1'];
export const nodes=config.resourceRecipe.targetGraph.boardNodes;
export const cards=[
 ['先织网，再计算','偏振编码H/V代表0/1。先制备纠缠资源，再选择测量基推进计算，经典前馈帮助不同随机分支得到一致输出。'],
 ['不是停在板上的光子','图板显示CZ连接拓扑和时间进度。真实光子沿光路传播，探测会消耗光子；输出时间槽尚未测量。'],
 ['封装光源与融合','源是预设的先进多光子资源模块，不是普通激光器。融合采用理想Type-II风格教学抽象，50%并非所有协议的普遍成功率；成功后按已知局域修正准备标准目标图。'],
 ['为什么还要校准','除了到达时间，真实干涉还要求频谱、偏振和空间模式匹配。本关视作封装系统已处理这些条件；时间格不是实际时间单位。'],
 ['小图与通用计算','三节点和六节点展示单比特与纠缠双比特构件。六个光子不能运行任意大型算法，还需要可扩展资源、纠错和大量光子。'],
 ['温度与探测','传播的光子不需要全部冷到毫开尔文；某些高性能探测器需要低温工程。本关不是现实设备操作教程。'],
 ['两种方向检查','已知理想模型下检查XZ与ZX稳定子。单独ZZ均匀直方图不足以判断纠缠；有限统计与有噪声实验还需误差分析。']];
