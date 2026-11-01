import {normalizeAdventure} from './adventure-state.js';
import {normalizeCampaign} from './campaign-state.js';
import {normalizeExpedition} from './expedition-state.js';
export const storyScenes=[
 ['lens','找回星光透镜','Qat：旧箱子里的小透镜，能把信标的光重新聚起来。收好它，我们还需要观测室的稳态电池。','signal'],
 ['cell','信标的第二块拼图','观测实验通过，稳态电池已经取得。Qat：现在把透镜和电池带回中央广场，让信标重新亮起来！','signal'],
 ['beacon','重启计划 · 正式开始','中央广场的信标重新点亮。Dr. Liang：通信恢复了！接下来逐个检查实验系统，把验证记录送回主控。我们要让整艘飞船重新启航。','arrival'],
 ['chapter1','第一声回应','基础校准记录已接收，主控的第一条检查通道恢复。Dr. Lin：你学会了准备状态、预测与比较。现在去纠缠桥，看看两个比特怎样共同变化。','signal'],
 ['chapter2','重新连接','关联实验的四份记录送达主控。通往四间操作室的检修路线亮起。Ada：找到配件、完成装配，再按设备要求验证；亮灯并不等于通过全部检查。','engines'],
 ['chapter3','听懂飞船','测量与反馈记录已接收。原本杂乱的自检日志变成清晰的记录。Qat：这次我们不只看到结果，也知道怎样把结果交给下一步操作。','journey'],
 ['chapter4','找到可行的路','编译与路由检查完成。主控把计算步骤安排到能执行它们的位置，任务冲突逐项解除。Dr. Patel：候选方案已经排好，还要确认硬件资源真的可用。','journey'],
 ['chapter5','每个位置都重要','阵列与硬件检查完成。空位被正确标记，任务按可用资源重新安排。Qat：没有原子的座位不能假装是零态。诚实记录缺失，也是安全重启的一部分。','engines'],
 ['chapter6','穿过噪声','最后一份控制验证记录送达主控。Dr. Liang：现在去航行总日志，核对四台教学机、逻辑保护和航行升级。全部准备通过后，由你下达启航指令。','guardians'],
 ['protection','信息的守护者','三种单次 X 翻转训练已完成。多个物理比特共同编码，校验线索帮助定位错误。Qat：这只是保护信息的起点，不代表我们已经解决所有噪声。','guardians'],
 ...[['sc','超导'],['neutral','中性原子'],['ion','离子阱'],['photon','光量子']].map(([id,name])=>['run-'+id,name+'主线记录已接入','主控收到'+name+'教学机的主线启动记录。设备专属实验仍按各自验证流程记录；这不是实际硬件联网。请在航行总日志检查剩余准备。','engines'])
].map(([id,title,text,scene])=>({id,title,text,scene}));
export function storyMilestones(context={}){
 const a=normalizeAdventure(context.adventure||{}),e=normalizeExpedition(context.expedition),c=normalizeCampaign(context.campaign);
 const found=[];for(const id of ['lens','cell'])if(a.items.includes(id))found.push(id);if(a.beacon)found.push('beacon');
 if([0,1,2,3].every(i=>Number.isInteger(context.first?.stars?.[i])&&context.first.stars[i]>0))found.push('chapter1');
 if(e.done.every(Boolean))found.push('chapter2');
 ['measurement','compiler','hardware','pulse'].forEach((key,i)=>{if(c[key].every(Boolean))found.push('chapter'+(i+3))});
 if(e.corrected.length===3)found.push('protection');for(const id of e.runs)found.push('run-'+id);
 return found;
}
