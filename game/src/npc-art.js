// Original 32×48 pixel crew portraits, shared by world sprites and dialogue.
export const appearances={
 entry:{kind:'antenna',skin:'#79c9b2',hair:'#225d65',outfit:'#427f9b',detail:'青绿色触角、迎航围巾'},
 plaza:{hair:'#333344',skin:'#dba477',style:'short',accessory:'captain',outfit:'#355c81',detail:'舰长帽、金色肩章、深蓝制服'},
 chapter:{hair:'#634763',skin:'#efbf9b',style:'bun',accessory:'orb',outfit:'#9273b8',detail:'高发髻、紫色披肩、状态球'},
 playroom:{kind:'fin',skin:'#eaa6be',hair:'#a6588c',outfit:'#82a761',detail:'粉色鳍耳、绿背带、星星口袋'},
 storage:{kind:'rock',skin:'#aa8b6b',hair:'#66584b',outfit:'#bf8c49',detail:'岩石方脑袋、厚手套、工具腰带'},
 observatory:{hair:'#d8dbe7',skin:'#c98e70',style:'long',accessory:'scope',outfit:'#4d6698',detail:'银白长发、星空斗篷、单筒镜'},
 bridge:{hair:'#543f30',skin:'#bd845e',style:'curl',accessory:'scarf',outfit:'#467e7e',detail:'卷发、橙围巾、成对星徽章'},
 deck:{hair:'#a64e37',skin:'#e9b28c',style:'ponytail',accessory:'goggles',outfit:'#b47747',detail:'红马尾、护目镜、扳手'},
 'ops-sc':{hair:'#d6d4c8',skin:'#ce9e7d',style:'short',accessory:'glasses',outfit:'#5a80a0',detail:'银灰短发、方眼镜、蓝领白大褂'},
 'ops-neutral':{hair:'#283e36',skin:'#ecc09b',style:'ponytail',accessory:'leaf',outfit:'#508a71',detail:'黑色马尾、绿发夹、薄荷绿领口'},
 'ops-ion':{hair:'#51475c',skin:'#ad795f',style:'bob',accessory:'visor',outfit:'#9779ac',detail:'齐耳短发、紫色护目镜、离子徽章'},
 'ops-photon':{hair:'#473328',skin:'#dfaa7c',style:'swept',accessory:'prism',outfit:'#b28847',detail:'侧分棕发、短胡须、光棱镜'},
 measurement:{hair:'#28394b',skin:'#e3b28e',style:'bob',accessory:'clipboard',outfit:'#668eae',detail:'蓝黑短发、红发卡、记录板'},
 compiler:{hair:'#b27c43',skin:'#ebbc91',style:'curl',accessory:'headset',outfit:'#918161',detail:'棕色卷发、通讯耳机、线路平板'},
 hardware:{hair:'#3f3032',skin:'#ae785b',style:'bun',accessory:'cap',outfit:'#698657',detail:'橙色工作帽、短外套、阵列徽章'},
 pulse:{hair:'#3c3546',skin:'#d3a47e',style:'swept',accessory:'headphones',outfit:'#7e6b9d',detail:'蓬松斜发、青色耳机、波形仪'},
 voyage:{kind:'jelly',skin:'#99b9e4',hair:'#565d9e',outfit:'#8c79ad',detail:'半透明水母外星人、四条触足、航海卷轴'}
};
export function paintResident(canvas,room,portrait=false){
 const a=appearances[room]||appearances.plaza,c=canvas.getContext('2d');c.clearRect(0,0,32,48);c.imageSmoothingEnabled=false;
 const r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h)},ink='#292635',gold='#f1ce77';
 if(portrait){r(0,0,32,48,'#d9bd89');r(2,2,28,44,'#796a5c');r(4,4,24,40,'#a79b7c')}
 const eye=(x,y)=>{r(x,y,3,3,ink);r(x,y,1,1,'#fff1c4')};
 if(a.kind){
  if(a.kind==='jelly'){
   r(8,5,16,3,a.hair);r(5,8,22,5,a.hair);r(3,13,26,13,a.hair);r(5,12,22,12,a.skin);r(9,8,13,4,a.skin);r(8,12,4,3,'#e0edf4');eye(10,18);eye(21,18);r(15,23,4,1,ink);
   r(7,27,18,8,a.outfit);for(let i=0;i<4;i++){r(6+i*6,33,3,7,a.skin);r(4+i*6,39+(i%2)*2,5,3,a.hair)}r(11,28,11,9,'#f1d495');r(9,27,15,2,gold);r(14,31,6,1,'#8a6542');r(13,34,7,1,'#8a6542');return;
  }
  r(8,36,6,8,a.hair);r(19,36,6,8,a.hair);r(6,43,9,3,ink);r(19,43,9,3,ink);r(6,23,21,15,a.outfit);r(3,27,5,11,a.skin);r(26,27,5,11,a.skin);
  if(a.kind==='rock'){r(6,6,21,17,a.hair);r(4,10,25,9,a.skin);r(8,7,16,15,a.skin);r(7,9,6,3,'#c9ad85');r(22,17,5,4,'#7c6855');r(15,5,8,4,'#c2a078');eye(10,14);eye(21,14);r(13,20,9,2,a.hair);r(6,32,21,4,ink);for(let i=0;i<3;i++)r(9+i*6,31,3,7,gold);r(1,33,7,6,a.hair);r(26,33,6,6,a.hair)}
  else{r(8,7,18,16,a.hair);r(9,9,16,13,a.skin);if(a.kind==='antenna'){r(8,2,2,7,a.hair);r(23,1,2,8,a.hair);r(6,1,4,3,gold);r(23,0,4,3,gold);r(5,12,4,6,a.skin);r(25,12,4,6,a.skin);r(9,23,16,4,gold);r(22,26,4,10,gold)}else{for(let y=8;y<19;y+=5){r(2,y,7,3,a.hair);r(25,y,7,3,a.hair)}r(7,9,3,13,a.skin);r(24,9,3,13,a.skin);r(10,23,3,12,gold);r(22,23,3,12,gold);r(14,29,8,7,'#e5c977');r(17,28,2,9,'#fff0b4')}eye(12,14);eye(21,14);r(16,20,4,1,a.hair)}return;
 }
 // Human silhouettes vary by hairstyle, clothing, skin and role-specific equipment.
 r(10,35,5,9,'#344153');r(19,35,5,9,'#344153');r(8,43,8,3,ink);r(18,43,9,3,ink);
 const coat=['captain','goggles','scope','cap'].includes(a.accessory)?a.outfit:'#ede3cb';
 if(a.accessory==='scope'){r(5,21,23,21,a.outfit);r(3,35,27,5,a.outfit);r(8,29,2,2,gold);r(24,35,2,2,gold)}
 r(7,23,20,15,coat);r(13,23,9,14,a.outfit);r(4,25,5,10,coat);r(26,25,4,10,coat);r(4,34,4,4,a.skin);r(27,33,4,4,a.skin);r(15,25,3,3,gold);
 r(9,5,17,17,a.hair);r(11,9,13,13,a.skin);r(10,5,15,5,a.hair);
 if(a.style==='short'){r(9,10,3,6,a.hair);r(12,5,4,2,'#f0e5ce')}
 if(a.style==='bob'){r(8,8,4,15,a.hair);r(24,8,4,15,a.hair);r(10,8,14,3,a.hair)}
 if(a.style==='long'){r(7,8,4,22,a.hair);r(24,8,4,22,a.hair)}
 if(a.style==='bun'){r(13,1,9,5,a.hair);r(11,4,13,4,a.hair);r(10,8,3,8,a.hair)}
 if(a.style==='ponytail'){r(25,8,4,16,a.hair);r(27,20,4,5,a.hair);r(24,10,5,3,a.outfit);r(9,8,8,4,a.hair)}
 if(a.style==='swept'){r(8,4,17,5,a.hair);r(10,9,8,3,a.hair);r(10,12,4,3,a.hair)}
 if(a.style==='curl'){for(let i=0;i<4;i++)r(8+i*5,4+(i%2)*2,5,5,a.hair);r(7,9,4,7,a.hair)}
 eye(14,14);eye(21,14);r(17,20,4,1,'#925e51');
 const acc=a.accessory;
 if(acc==='captain'){r(8,2,20,6,a.outfit);r(7,7,22,2,gold);r(16,3,4,3,gold);r(6,24,6,2,gold);r(24,24,6,2,gold);r(17,29,1,7,gold)}
 if(acc==='glasses'){r(12,12,7,5,'#497483');r(20,12,6,5,'#497483');r(14,13,3,3,'#b8d7da');r(21,13,3,3,'#b8d7da');r(19,14,1,1,ink)}
 if(acc==='goggles'||acc==='visor'){r(8,10,20,4,ink);r(10,10,7,3,'#71c5c7');r(19,10,7,3,'#71c5c7');if(acc==='goggles'){r(28,28,2,14,'#a8b8ba');r(26,26,6,4,'#a8b8ba');r(28,25,2,3,ink)}}
 if(acc==='leaf'){r(24,9,4,3,'#86bd69');r(23,8,2,2,gold)}
 if(acc==='prism'){r(14,20,9,3,a.hair);r(24,29,5,8,'#76ccd0');r(26,31,4,5,'#bf8fc5');r(28,33,3,3,gold)}
 if(acc==='clipboard'||acc==='headset'){r(22,27,9,13,'#674d39');r(23,29,7,9,acc==='headset'?'#6babb0':'#f3d8a3');for(let y=31;y<37;y+=3)r(24,y,4,1,'#495b66');if(acc==='clipboard')r(9,11,4,2,'#cd6157')}
 if(acc==='headset'||acc==='headphones'){r(7,8,3,11,ink);r(26,8,3,11,ink);r(8,4,20,2,ink);r(6,12,4,7,'#7fc3c3');r(26,12,4,7,'#7fc3c3')}
 if(acc==='cap'){r(8,3,18,6,'#d3984e');r(6,8,23,2,gold);r(24,28,5,5,ink);r(25,29,3,3,'#a9d26e')}
 if(acc==='orb'){r(25,29,6,7,'#729cbd');r(26,28,4,9,'#94d7db');r(25,37,6,2,gold)}
 if(acc==='scope'){r(24,29,6,5,gold);r(28,28,4,7,'#775839');r(29,30,2,3,'#a1d9dc')}
 if(acc==='scarf'){r(10,22,16,3,'#d79b61');r(11,25,4,9,'#d79b61');r(25,28,2,2,gold);r(28,28,2,2,gold)}
 if(acc==='headphones'){r(23,29,8,9,ink);r(24,30,6,6,'#437278');r(25,33,4,1,gold)}
}
