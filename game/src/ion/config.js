export const config={
  "schemaVersion": "1.0.0",
  "id": "ion_trap_lab",
  "questId": "it_catch_cool_entangle",
  "title": "离子阱操作室：点亮两颗离子星",
  "subtitle": "从电场困住离子，到两量子比特纠缠",
  "scienceModel": {
    "species": "40Ca+",
    "encoding": "optical_qubit",
    "logicalZero": "4S1/2 (bright with 397 nm + 866 nm)",
    "logicalOne": "3D5/2 (dark to 397 nm cycling light)",
    "laserNm": {
      "cooling": 397,
      "repump": 866,
      "quench": 854,
      "coherent": 729
    },
    "trapType": "linear RF Paul trap",
    "readout": "bright |0>, dark |1>",
    "gate": "Mølmer-Sørensen, UXX(χ)=exp(-iχ X⊗X), χ=π/4 yields (|00>-i|11>)/√2",
    "phaseCorrection": "virtual Rz(pi/2) on ion B yields (|00>+|11>)/√2 up to global phase",
    "entanglementWitness": "E_ZZ + E_XX > 1 is a sufficient entanglement witness (ideal +2)",
    "physicalSafety": "all operations are abstract virtual teaching actions, not real voltages/laser alignments"
  },
  "style": {
    "artDirection": "温暖像素风：原创 sprite、原木边框、黄铜/铜绿实验室、QAT 对话；只借鉴星露谷生活感",
    "pixelCanvas": {
      "logicalWidth": 1000,
      "logicalHeight": 620,
      "scaling": "nearest-neighbor"
    },
    "noCopiedAssets": true,
    "hintSystem": true,
    "reducedMotion": true
  },
  "views": [
    {
      "id": "room_overview",
      "width": 1071,
      "height": 1136,
      "role": "探索总览（适配已有比例）"
    },
    {
      "id": "trap_cutaway",
      "width": 1000,
      "height": 620,
      "role": "真空腔的教学维修剖面：固定螺丝及外侧物镜"
    },
    {
      "id": "optics_bench",
      "width": 1000,
      "height": 620,
      "role": "宽幅的真实空间光学工作台"
    },
    {
      "id": "control_rack",
      "width": 1000,
      "height": 620,
      "role": "RF/DC/时序/光子计数仪器架"
    },
    {
      "id": "ion_monitor",
      "width": 1000,
      "height": 620,
      "role": "离子微运动、冷却、门校准、统计测量面板"
    }
  ],
  "fixtures": [
    {
      "id": "chamber",
      "name": "固定真空腔体（不可拾取）",
      "ports": [
        {
          "id": "vacuum_sensor",
          "type": "data"
        },
        {
          "id": "cooling_window",
          "type": "optical"
        },
        {
          "id": "gate_window",
          "type": "optical"
        },
        {
          "id": "fluorescence_window",
          "type": "fluorescence"
        },
        {
          "id": "ion_source_ctrl",
          "type": "data"
        }
      ],
      "annotation": "含专业人员预装的真空泵、离子源、安全互锁、真空窗；玩家不直接装拆真空系统。"
    }
  ],
  "hotspots": [
    {
      "id": "chip_vault",
      "worldHint": "中央带锁的陶瓷盒",
      "items": [
        "trap_chip"
      ],
      "pickupFeedback": "解锁后看见有金色轨道的芯片封装"
    },
    {
      "id": "feedthrough_case",
      "worldHint": "真空腔边带红橙标志的双层手提箱",
      "items": [
        "rf_feedthrough",
        "dc_feedthrough"
      ],
      "pickupFeedback": "两枚不同接头逐一取出"
    },
    {
      "id": "imaging_drawer",
      "worldHint": "右墙镜头抽屉",
      "items": [
        "collection_objective",
        "fluorescence_filter"
      ],
      "pickupFeedback": "物镜玻璃与滤镜交替反光"
    },
    {
      "id": "rf_cabinet",
      "worldHint": "左侧刻有波形的铜柜",
      "items": [
        "rf_driver"
      ],
      "pickupFeedback": "波形灯亮一次"
    },
    {
      "id": "dc_workbox",
      "worldHint": "带多色细线的黄铜工具盒",
      "items": [
        "dc_dac"
      ],
      "pickupFeedback": "多个控制通道逐行闪烁"
    },
    {
      "id": "vacuum_shelf",
      "worldHint": "窗边的蓝色监测箱",
      "items": [
        "vacuum_monitor",
        "ion_loader_console"
      ],
      "pickupFeedback": "真空标记及“2粒离子”图标依次出现"
    },
    {
      "id": "clock_drawer",
      "worldHint": "挂钟下方的维修小抽屉",
      "items": [
        "pulse_sequencer"
      ],
      "pickupFeedback": "光点沿时间刻度闪动"
    },
    {
      "id": "detector_case",
      "worldHint": "摆放紫色小屏的防尘柜",
      "items": [
        "photon_counter"
      ],
      "pickupFeedback": "示意探测计数闪过 0→1"
    },
    {
      "id": "cooling_laser_cabinet",
      "worldHint": "左后墙贴雪花和回转箭头的柜",
      "items": [
        "cooling_397",
        "repump_866"
      ],
      "pickupFeedback": "两个激光盒分别装进背包"
    },
    {
      "id": "quench_crate",
      "worldHint": "木箱里有深红光口的金属小盒",
      "items": [
        "quench_854"
      ],
      "pickupFeedback": "854 nm 的小回转标识亮起"
    },
    {
      "id": "coherent_source_vault",
      "worldHint": "发着细红光的保险格",
      "items": [
        "qubit_729"
      ],
      "pickupFeedback": "窄线宽风格波纹出现在屏幕"
    },
    {
      "id": "mirror_cart",
      "worldHint": "角落木轮光学小车",
      "items": [
        "cooling_mirror",
        "gate_mirror",
        "beam_combiner"
      ],
      "pickupFeedback": "两种不同镜架和合束盒依次出现"
    }
  ],
  "pieces": [
    {
      "id": "trap_chip",
      "name": "线性保罗阱芯片",
      "scene": "trap_cutaway",
      "anchor": {
        "x": 0.49,
        "y": 0.56
      },
      "spriteHint": "金色成对 RF 电极轨、沿轴分段 DC 电极、陶瓷基座",
      "physicalRole": "trap",
      "ports": [
        {
          "id": "rf",
          "type": "rf"
        },
        {
          "id": "dc",
          "type": "dc"
        }
      ],
      "learnText": "射频电场提供径向束缚，直流电极帮助形成轴向束缚。",
      "incorrectHint": "芯片必须装在真空腔中央陶瓷基座，不是光学台。"
    },
    {
      "id": "rf_feedthrough",
      "name": "RF 真空馈通",
      "scene": "trap_cutaway",
      "anchor": {
        "x": 0.18,
        "y": 0.27
      },
      "spriteHint": "红铜色圆形穿墙接头",
      "physicalRole": "vacuum_feedthrough",
      "ports": [
        {
          "id": "outer",
          "type": "rf"
        },
        {
          "id": "inner",
          "type": "rf"
        }
      ],
      "learnText": "让腔外 RF 驱动和腔内电极连接，腔体密封结构已经由专业人员预制。",
      "incorrectHint": "RF 馈通在真空腔左上方红色接线座。"
    },
    {
      "id": "dc_feedthrough",
      "name": "DC 真空馈通",
      "scene": "trap_cutaway",
      "anchor": {
        "x": 0.8,
        "y": 0.27
      },
      "spriteHint": "带橙色多针触点的真空馈通",
      "physicalRole": "vacuum_feedthrough",
      "ports": [
        {
          "id": "outer",
          "type": "dc"
        },
        {
          "id": "inner",
          "type": "dc"
        }
      ],
      "learnText": "为分段 DC 电极引入控制信号。",
      "incorrectHint": "DC 馈通在真空腔右上方橙色座。"
    },
    {
      "id": "collection_objective",
      "name": "荧光收集物镜",
      "scene": "trap_cutaway",
      "anchor": {
        "x": 0.8,
        "y": 0.51
      },
      "spriteHint": "银铜物镜，蓝紫玻璃镜片",
      "physicalRole": "imaging",
      "ports": [
        {
          "id": "opt_in",
          "type": "fluorescence"
        },
        {
          "id": "opt_out",
          "type": "fluorescence"
        }
      ],
      "learnText": "物镜位于真空窗外，负责收集离子散射的光子。",
      "incorrectHint": "收集物镜在观察窗的外侧，不能装进阱电极间。"
    },
    {
      "id": "fluorescence_filter",
      "name": "荧光滤光组件",
      "scene": "trap_cutaway",
      "anchor": {
        "x": 0.8,
        "y": 0.77
      },
      "spriteHint": "滑动式深蓝滤光盒",
      "physicalRole": "imaging",
      "ports": [
        {
          "id": "opt_in",
          "type": "fluorescence"
        },
        {
          "id": "opt_out",
          "type": "fluorescence"
        }
      ],
      "learnText": "滤除不需要的散射背景，便于统计荧光。",
      "incorrectHint": "滤光片在物镜与光子计数器之间。"
    },
    {
      "id": "cooling_397",
      "name": "397 nm 冷却激光盒",
      "scene": "optics_bench",
      "anchor": {
        "x": 0.13,
        "y": 0.22
      },
      "spriteHint": "青蓝条纹光源，雪花铭牌",
      "physicalRole": "laser",
      "ports": [
        {
          "id": "trigger",
          "type": "data"
        },
        {
          "id": "beam_out",
          "type": "optical"
        }
      ],
      "learnText": "驱动钙离子的冷却/荧光相关跃迁；合适红失谐可实现多普勒冷却。",
      "incorrectHint": "397 nm 光源是冷却光学台的上方装配座。"
    },
    {
      "id": "repump_866",
      "name": "866 nm 回泵激光盒",
      "scene": "optics_bench",
      "anchor": {
        "x": 0.13,
        "y": 0.43
      },
      "spriteHint": "红橙光口与循环箭头",
      "physicalRole": "laser",
      "ports": [
        {
          "id": "beam_out",
          "type": "optical"
        }
      ],
      "learnText": "将人口从 D3/2 返回冷却循环，避免离子停在不参与冷却的态。",
      "incorrectHint": "866 nm 是回泵，不是 729 nm 的量子比特控制光。"
    },
    {
      "id": "quench_854",
      "name": "854 nm 辅助复位激光盒",
      "scene": "optics_bench",
      "anchor": {
        "x": 0.13,
        "y": 0.67
      },
      "spriteHint": "暗红色光口和双向回转齿轮",
      "physicalRole": "laser",
      "ports": [
        {
          "id": "beam_out",
          "type": "optical"
        }
      ],
      "learnText": "用于将 D5/2 的人口转出，辅助边带冷却及重复实验中的复位。",
      "incorrectHint": "854 nm 辅助光源在光学台左下，不是收集物镜。"
    },
    {
      "id": "qubit_729",
      "name": "729 nm 相干控制光源",
      "scene": "optics_bench",
      "anchor": {
        "x": 0.38,
        "y": 0.77
      },
      "spriteHint": "琥珀红窄光口、相位拨盘",
      "physicalRole": "laser",
      "ports": [
        {
          "id": "trigger",
          "type": "data"
        },
        {
          "id": "beam_out",
          "type": "optical"
        }
      ],
      "learnText": "驱动 S1/2 与 D5/2 光学量子比特跃迁，可做单比特门及运动边带操作。",
      "incorrectHint": "729 nm 的相干控制光应放在门操作通道。"
    },
    {
      "id": "cooling_mirror",
      "name": "冷却通道转向镜",
      "scene": "optics_bench",
      "anchor": {
        "x": 0.39,
        "y": 0.25
      },
      "spriteHint": "蓝铜可旋转镜架",
      "physicalRole": "optical_mount",
      "ports": [
        {
          "id": "opt_in",
          "type": "optical"
        },
        {
          "id": "opt_out",
          "type": "optical"
        }
      ],
      "learnText": "改变冷却光传播方向，把光导向离子区。",
      "incorrectHint": "选冷却镜架；不是门光束的另一块镜。"
    },
    {
      "id": "gate_mirror",
      "name": "量子门通道转向镜",
      "scene": "optics_bench",
      "anchor": {
        "x": 0.68,
        "y": 0.76
      },
      "spriteHint": "金红色镜架、有独立微调钮",
      "physicalRole": "optical_mount",
      "ports": [
        {
          "id": "opt_in",
          "type": "optical"
        },
        {
          "id": "opt_out",
          "type": "optical"
        }
      ],
      "learnText": "让相干门光到达指定离子区域，微调与寻址在虚拟控制器中。",
      "incorrectHint": "门光镜位于光学台右下方。"
    },
    {
      "id": "beam_combiner",
      "name": "冷却/回泵合束模块",
      "scene": "optics_bench",
      "anchor": {
        "x": 0.68,
        "y": 0.42
      },
      "spriteHint": "三入口彩色合束器",
      "physicalRole": "optical_mount",
      "ports": [
        {
          "id": "cool_in",
          "type": "optical"
        },
        {
          "id": "repump_in",
          "type": "optical"
        },
        {
          "id": "quench_in",
          "type": "optical"
        },
        {
          "id": "beam_out",
          "type": "optical"
        }
      ],
      "learnText": "将几条教学光路汇到冷却窗口；实机中可由多个分色元件实现。",
      "incorrectHint": "合束器有三个不同颜色的输入端口，不能用一个通用插孔。"
    },
    {
      "id": "rf_driver",
      "name": "射频驱动器 RF",
      "scene": "control_rack",
      "anchor": {
        "x": 0.27,
        "y": 0.21
      },
      "spriteHint": "深铜机盒、振荡波形与 RF 红色接口",
      "physicalRole": "electronics",
      "ports": [
        {
          "id": "rf_out",
          "type": "rf"
        }
      ],
      "learnText": "驱动 RF 阱电极，主要形成径向有效束缚。",
      "incorrectHint": "RF 驱动器在控制机柜左上层。"
    },
    {
      "id": "dc_dac",
      "name": "多通道 DC 电极控制器",
      "scene": "control_rack",
      "anchor": {
        "x": 0.27,
        "y": 0.48
      },
      "spriteHint": "橙色多路细刻度滑杆与接口",
      "physicalRole": "electronics",
      "ports": [
        {
          "id": "dc_out",
          "type": "dc"
        }
      ],
      "learnText": "控制轴向势阱与补偿电场，不能替代 RF 交流束缚。",
      "incorrectHint": "DC 多路控制器位于机柜左中层。"
    },
    {
      "id": "vacuum_monitor",
      "name": "真空监测器",
      "scene": "control_rack",
      "anchor": {
        "x": 0.27,
        "y": 0.76
      },
      "spriteHint": "青灰数字真空状态表",
      "physicalRole": "electronics",
      "ports": [
        {
          "id": "sense",
          "type": "data"
        }
      ],
      "learnText": "监测已由专业人员准备的超高真空腔状态；玩家只读取模拟状态。",
      "incorrectHint": "真空监测仪在机柜左下层。"
    },
    {
      "id": "pulse_sequencer",
      "name": "激光脉冲时序器",
      "scene": "control_rack",
      "anchor": {
        "x": 0.72,
        "y": 0.22
      },
      "spriteHint": "多色 TTL 波形屏、绿色指示",
      "physicalRole": "electronics",
      "ports": [
        {
          "id": "cool_ttl",
          "type": "data"
        },
        {
          "id": "coherent_ttl",
          "type": "data"
        },
        {
          "id": "count_in",
          "type": "data"
        }
      ],
      "learnText": "控制冷却与门操作顺序，并接收测量结果；回泵及辅助光路由装置内置控制。",
      "incorrectHint": "时序器在控制柜右上方，连接两条触发线。"
    },
    {
      "id": "ion_loader_console",
      "name": "离子装载遥控台",
      "scene": "control_rack",
      "anchor": {
        "x": 0.72,
        "y": 0.48
      },
      "spriteHint": "带“2”标记的虚拟离子来源屏",
      "physicalRole": "electronics",
      "ports": [
        {
          "id": "load_cmd",
          "type": "data"
        }
      ],
      "learnText": "遥控由专业人员预装的离子源；不模拟真实高温蒸发或高能电源操作。",
      "incorrectHint": "装载控制台在机柜右中层。"
    },
    {
      "id": "photon_counter",
      "name": "荧光光子计数器",
      "scene": "control_rack",
      "anchor": {
        "x": 0.72,
        "y": 0.76
      },
      "spriteHint": "紫色小格计数屏，亮/暗双色",
      "physicalRole": "electronics",
      "ports": [
        {
          "id": "opt_in",
          "type": "fluorescence"
        },
        {
          "id": "data_out",
          "type": "data"
        }
      ],
      "learnText": "把荧光强弱转化成亮态/暗态测量结果。",
      "incorrectHint": "计数器在控制柜右下层，不能当成激光源。"
    }
  ],
  "routes": [
    {
      "id": "L01",
      "source": "rf_driver.rf_out",
      "target": "rf_feedthrough.outer",
      "type": "rf",
      "manual": true,
      "label": "射频输出到腔体馈通",
      "visual": "红铜同轴线"
    },
    {
      "id": "L02",
      "source": "rf_feedthrough.inner",
      "target": "trap_chip.rf",
      "type": "rf",
      "manual": false,
      "label": "RF 馈通内侧到芯片电极",
      "visual": "密封后形成的内部短接（自动）"
    },
    {
      "id": "L03",
      "source": "dc_dac.dc_out",
      "target": "dc_feedthrough.outer",
      "type": "dc",
      "manual": true,
      "label": "直流控制器到腔体馈通",
      "visual": "橙色多芯控制线"
    },
    {
      "id": "L04",
      "source": "dc_feedthrough.inner",
      "target": "trap_chip.dc",
      "type": "dc",
      "manual": false,
      "label": "DC 馈通内侧到芯片电极",
      "visual": "密封后形成的内部短接（自动）"
    },
    {
      "id": "L05",
      "source": "chamber.vacuum_sensor",
      "target": "vacuum_monitor.sense",
      "type": "data",
      "manual": true,
      "label": "真空传感器到状态屏",
      "visual": "绿色数据线"
    },
    {
      "id": "L06",
      "source": "pulse_sequencer.cool_ttl",
      "target": "cooling_397.trigger",
      "type": "data",
      "manual": true,
      "label": "冷却时序到397 nm光源",
      "visual": "绿色触发线"
    },
    {
      "id": "L07",
      "source": "pulse_sequencer.coherent_ttl",
      "target": "qubit_729.trigger",
      "type": "data",
      "manual": true,
      "label": "量子门时序到729 nm光源",
      "visual": "绿色触发线"
    },
    {
      "id": "L08",
      "source": "cooling_397.beam_out",
      "target": "cooling_mirror.opt_in",
      "type": "optical",
      "manual": true,
      "label": "397 nm光到冷却镜",
      "visual": "青蓝光学路径"
    },
    {
      "id": "L09",
      "source": "cooling_mirror.opt_out",
      "target": "beam_combiner.cool_in",
      "type": "optical",
      "manual": true,
      "label": "冷却镜到合束器",
      "visual": "青蓝光学路径"
    },
    {
      "id": "L10",
      "source": "repump_866.beam_out",
      "target": "beam_combiner.repump_in",
      "type": "optical",
      "manual": true,
      "label": "866 nm回泵到合束器",
      "visual": "橙红光学路径"
    },
    {
      "id": "L11",
      "source": "quench_854.beam_out",
      "target": "beam_combiner.quench_in",
      "type": "optical",
      "manual": true,
      "label": "854 nm辅助光到合束器",
      "visual": "深红光学路径"
    },
    {
      "id": "L12",
      "source": "beam_combiner.beam_out",
      "target": "chamber.cooling_window",
      "type": "optical",
      "manual": true,
      "label": "合束器到真空腔冷却窗",
      "visual": "多色合束后光学路径"
    },
    {
      "id": "L13",
      "source": "qubit_729.beam_out",
      "target": "gate_mirror.opt_in",
      "type": "optical",
      "manual": true,
      "label": "729 nm到门光镜",
      "visual": "赤红光学路径"
    },
    {
      "id": "L14",
      "source": "gate_mirror.opt_out",
      "target": "chamber.gate_window",
      "type": "optical",
      "manual": true,
      "label": "门光镜到真空腔操作窗",
      "visual": "赤红光学路径"
    },
    {
      "id": "L15",
      "source": "chamber.fluorescence_window",
      "target": "collection_objective.opt_in",
      "type": "fluorescence",
      "manual": true,
      "label": "荧光窗口到物镜",
      "visual": "紫蓝光收集路径"
    },
    {
      "id": "L16",
      "source": "collection_objective.opt_out",
      "target": "fluorescence_filter.opt_in",
      "type": "fluorescence",
      "manual": true,
      "label": "物镜到滤光器",
      "visual": "紫蓝光收集路径"
    },
    {
      "id": "L17",
      "source": "fluorescence_filter.opt_out",
      "target": "photon_counter.opt_in",
      "type": "fluorescence",
      "manual": true,
      "label": "滤光器到光子计数器",
      "visual": "紫蓝光收集路径"
    },
    {
      "id": "L18",
      "source": "photon_counter.data_out",
      "target": "pulse_sequencer.count_in",
      "type": "data",
      "manual": true,
      "label": "计数器到时序器反馈",
      "visual": "绿色读出数据线"
    },
    {
      "id": "L19",
      "source": "ion_loader_console.load_cmd",
      "target": "chamber.ion_source_ctrl",
      "type": "data",
      "manual": false,
      "label": "预装离子源与装载台的固定互锁接口",
      "visual": "内置连线（自动）"
    }
  ],
  "stageDefinitions": [
    {
      "id": "intro",
      "title": "读取手绘蓝图",
      "prerequisites": [],
      "successFlags": [
        "blueprint_read"
      ]
    },
    {
      "id": "explore",
      "title": "发现零件",
      "prerequisites": [
        "blueprint_read"
      ],
      "successFlags": [
        "any_item_collected"
      ]
    },
    {
      "id": "assemble",
      "title": "安装各部件",
      "prerequisites": [
        "blueprint_read"
      ],
      "successFlags": [
        "all_18_installed"
      ]
    },
    {
      "id": "route",
      "title": "接通线路",
      "prerequisites": [
        "blueprint_read"
      ],
      "successFlags": [
        "all_16_manual_routes"
      ]
    },
    {
      "id": "stabilize",
      "title": "稳定电阱",
      "prerequisites": [
        "trap_chip_installed",
        "core_rf_dc_routed",
        "vacuum_ready",
        "chamber_sealed"
      ],
      "successFlags": [
        "rf_stable",
        "dc_stable"
      ]
    },
    {
      "id": "load",
      "title": "装载两粒离子",
      "prerequisites": [
        "rf_stable",
        "dc_stable",
        "chamber_sealed",
        "loader_installed"
      ],
      "successFlags": [
        "two_ions_loaded"
      ]
    },
    {
      "id": "doppler",
      "title": "多普勒冷却",
      "prerequisites": [
        "two_ions_loaded",
        "cooling_path_ready"
      ],
      "successFlags": [
        "doppler_cooled"
      ]
    },
    {
      "id": "compensate",
      "title": "补偿微运动",
      "prerequisites": [
        "doppler_cooled"
      ],
      "successFlags": [
        "micromotion_compensated"
      ]
    },
    {
      "id": "sideband",
      "title": "运动边带冷却",
      "prerequisites": [
        "micromotion_compensated",
        "gate_path_ready",
        "quench_path_ready"
      ],
      "successFlags": [
        "motion_ready"
      ]
    },
    {
      "id": "single_qubit",
      "title": "校准一次单比特翻转",
      "prerequisites": [
        "motion_ready",
        "readout_path_ready",
        "sequencer_routed"
      ],
      "successFlags": [
        "pi_pulse_validated"
      ]
    },
    {
      "id": "ms_gate",
      "title": "施加两离子纠缠门",
      "prerequisites": [
        "pi_pulse_validated",
        "motion_ready"
      ],
      "successFlags": [
        "ms_gate_prepared"
      ]
    },
    {
      "id": "witness",
      "title": "双基验证纠缠",
      "prerequisites": [
        "ms_gate_prepared"
      ],
      "successFlags": [
        "zz_checked",
        "xx_checked",
        "witness_passed"
      ]
    },
    {
      "id": "finish",
      "title": "领取成就",
      "prerequisites": [
        "witness_passed"
      ],
      "successFlags": [
        "badge_unlocked"
      ]
    }
  ],
  "minigames": {
    "fieldStability": {
      "rfKnobSteps": [
        0,
        10
      ],
      "dcKnobSteps": [
        0,
        10
      ],
      "targetRF": 6,
      "targetDC": 5,
      "tolerance": 1,
      "readout": "two separate RF radial and DC axial stable gauges"
    },
    "micromotion": {
      "xRange": [
        -4,
        4
      ],
      "yRange": [
        -4,
        4
      ],
      "successAbsMax": 1,
      "animation": "ion motion halo shrinks as DC compensation approaches RF null; lesson, not hardware voltage"
    },
    "opticalAlignment": {
      "coolingMirrorAngles": [
        0,
        45,
        90,
        135,
        180,
        225,
        270,
        315
      ],
      "gateMirrorAngles": [
        0,
        45,
        90,
        135,
        180,
        225,
        270,
        315
      ],
      "task": "match displayed beam path, single snap at each mirror"
    },
    "doppler": {
      "choices": [
        "blue",
        "on_resonance",
        "red"
      ],
      "successChoice": "red",
      "show": "jitter shrinks; requires both 397 nm and 866 nm"
    },
    "sideband": {
      "choices": [
        "blue_sideband",
        "carrier",
        "red_sideband"
      ],
      "successChoice": "red_sideband",
      "motionEnergyIndexStart": 5,
      "motionEnergyIndexGoal": 1,
      "minRepeats": 3,
      "requiredLamps": [
        "729",
        "854",
        "866"
      ]
    },
    "singleQubit": {
      "target": "ionA",
      "pulseAxis": "X",
      "unit": "teaching_ticks",
      "piPulseTicks": 100,
      "validToleranceTicks": 8,
      "shots": 16,
      "darkIs": "1",
      "idealDarkProbability": 1
    },
    "entanglement": {
      "gate": "MS_XX",
      "gateTicks": 120,
      "validToleranceTicks": 10,
      "chiOptimal": "pi/4",
      "phaseFix": "virtual_Rz(pi/2)_on_ionB",
      "shotsPerBasis": 40,
      "bases": [
        "ZZ",
        "XX"
      ],
      "witnessThreshold": 1.4,
      "retryUnlimited": true
    }
  },
  "difficultyModes": {
    "story": {
      "age": "小学高年级",
      "showFormula": false,
      "guidance": "port highlighting, no numerical physics quiz"
    },
    "explore": {
      "age": "初中",
      "showFormula": false,
      "guidance": "explain red detuning, motional modes, bright-dark"
    },
    "research": {
      "age": "高中",
      "showFormula": true,
      "guidance": "state vector, UXX(χ), phase frame, E_ZZ + E_XX witness"
    }
  },
  "accessibility": {
    "mouse": true,
    "touchSelectThenAnchor": true,
    "keyboardPortSelection": true,
    "undoBeforeSeal": true,
    "autosave": true,
    "skipAnimation": true,
    "colorNotSoleCue": true,
    "dynamicScale": true
  },
  "completion": {
    "requiredInstalledPieces": 18,
    "requiredManualRoutes": 16,
    "requiredLoadedIons": 2,
    "requiredValidation": "field stable, Doppler cooled, micromotion compensated, sideband cooled, pi calibrated, MS gate, both bases, witness",
    "badge": "离子守护者：让两颗离子一起跳舞"
  },
  "sourceNotes": [
    "https://www.nature.com/articles/s41598-022-27193-9",
    "https://doi.org/10.1103/PRXQuantum.2.020343",
    "https://www.nationalacademies.org/read/25196/chapter/12",
    "https://www.nature.com/articles/npjqi201634"
  ]
};
export const KEY='spaceqat.ion.trap.v1';
export const pieces=config.pieces,hotspots=config.hotspots,routes=config.routes,manual=routes.filter(r=>r.manual);
export const views={room_overview:'实验室探索',trap_cutaway:'真空腔剖面',optics_bench:'光学工作台',control_rack:'控制机柜',ion_monitor:'离子观察与实验'};
export const names=Object.fromEntries(pieces.map(p=>[p.id,p.name]));names.chamber='预制真空腔';
export const colors={rf:'#eb795f',dc:'#efb54c',data:'#88df9b',optical:'#70d6ef',fluorescence:'#c4a1ed'};
export const routeColor=r=>r.id==='L10'?'#ed9968':r.id==='L11'?'#cb6171':['L13','L14'].includes(r.id)?'#ff8b82':colors[r.type];
export const ports=pieces.flatMap(p=>p.ports.filter(t=>manual.some(r=>[r.source,r.target].includes(p.id+'.'+t.id))).map((t,i)=>({id:p.id+'.'+t.id,piece:p.id,view:p.scene,type:t.type,out:manual.some(r=>r.source===p.id+'.'+t.id),x:p.anchor.x+(i%2===0?-.082:.082),y:p.anchor.y-.025+Math.floor(i/2)*.085}))).concat([
 {id:'chamber.vacuum_sensor',x:.30,y:.14,out:true,type:'data'},
 {id:'chamber.cooling_window',x:.30,y:.76,out:false,type:'optical'},
 {id:'chamber.gate_window',x:.51,y:.83,out:false,type:'optical'},
 {id:'chamber.fluorescence_window',x:.65,y:.51,out:true,type:'fluorescence'}
].map(p=>({...p,piece:'chamber',view:'trap_cutaway'})));
export const getPort=id=>ports.find(p=>p.id===id);
export const positions=[[49,65],[36,51],[89,44],[12,28],[17,64],[30,18],[51,14],[82,25],[11,47],[82,68],[70,18],[70,84]];
