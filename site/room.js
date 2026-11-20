const stage = document.querySelector('.stage');
const canvas = stage.querySelector('canvas');
const ctx = canvas.getContext('2d');
const gearLabel = document.querySelector('.gear-label');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const narrow = matchMedia('(max-width: 680px)');

const djTable = {x:-5.13,z:.39,width:2.72,depth:1.73};
const tableCenter = {x:djTable.x+djTable.width/2,z:djTable.z+djTable.depth/2};
const deckSize = {width:.91,depth:1.14};
const mixerSize = {width:.47,depth:.90};
const deckOffset = deckSize.width/2+mixerSize.width/2+.115;
const deckCenters = [tableCenter.x-deckOffset,tableCenter.x+deckOffset];

const locations = {
  desk:{label:'Mixing desk',yaw:.31,elev:.65,bounds:[[-2.58,.93,-2.34],[2.53,2.49,.22]],maxZoom:2.55},
  rack:{label:'Patch bay',yaw:.075,elev:.235,bounds:[[2.38,.10,-.70],[4.19,2.39,-.70]],inRoom:true},
  music:{label:'Turntables',yaw:0,elev:1.26,bounds:[[djTable.x,1.17,djTable.z],[djTable.x+djTable.width,1.42,djTable.z+djTable.depth]],inRoom:true},
  collection:{label:'Record shelf',yaw:.19,elev:.41,bounds:[[-5.05,.18,2.05],[-2.45,.98,2.10]],maxZoom:3.4},
  keys:{label:'Keyboard',yaw:0,elev:1.16,bounds:[[-5.03,1.08,-1.64],[-2.75,1.263,-.99]],inRoom:true},
  interviews:{label:'Microphone',yaw:.32,elev:.44,bounds:[[1.47,.66,1.69],[3.43,1.59,2.91]],maxZoom:4.1},
  travel:{label:'Travel wall',yaw:.19,elev:.38,bounds:[[-4.95,1.88,-3.96],[-2.23,3.34,-3.79]],maxZoom:3.65},
  boris:{label:'Boris',yaw:.29,elev:.55,bounds:[[3.85,.46,1.69],[5.14,1.49,2.65]],maxZoom:4.3}
};

const shell = [];
const floor = [];
const rug = [];
const props = [];
const finishes = [];
const consoleControls = [];
const keyboard = [];
const pianoKeys = [];
const pianoLighting = {hovered:null,focused:null,sounding:new Set()};
const tabletop = [];
const rackFace = [];
const shelfFace = [];
const boothStructure = [];
const deckBodies = [];
const interviewMic = [];
const chairAndCat = [];
const catFinishes = [];
const hitRegions = [];
let owner = null;
let roomCords = ['launch', null];
const patchColors = ['#93d1ba','#94b7e0'];
const rackJacks = {launch:[2.78,1.46,-.692],github:[3.29,1.46,-.692],ego:[3.80,1.46,-.692]};
const rackFeeds = [[3.58,2.08,-.692],[3.85,2.08,-.692]];
const rackParked = [[2.58,1.72,-.54],[3.91,1.76,-.53]];
const disc = {x:deckCenters[0],y:1.334,z:tableCenter.z-.04,radius:.39};
const deckSwitch=[disc.x-.35,1.31,disc.z+.49];
let gearPainter=null;
let cableDrag=null;
let recordView={position:0,playing:false,scratching:false};
let needle=0;
let needleCue=null;
const getColor = (color, factor) => {
  const n = parseInt(color.slice(1),16);
  const clamp = c => Math.max(0,Math.min(255,c));
  return 'rgb(' + [n>>16,(n>>8)&255,n&255].map(c=>Math.round(clamp(c*factor))).join(',') + ')';
};

function face(list, vertices, color, line, texture) {
  list.push({vertices,color,line,texture,owner});
}

function box(list,x,y,z,w,h,d,color) {
  const X=x+w,Y=y+h,Z=z+d;
  face(list,[[x,y,Z],[X,y,Z],[X,Y,Z],[x,Y,Z]],getColor(color,.89),'#18252866');
  face(list,[[X,y,z],[x,y,z],[x,Y,z],[X,Y,z]],getColor(color,.74),'#18252866');
  face(list,[[x,Y,Z],[X,Y,Z],[X,Y,z],[x,Y,z]],getColor(color,1.14),'#18252866');
  face(list,[[x,y,z],[x,y,Z],[x,Y,Z],[x,Y,z]],getColor(color,.88),'#18252866');
  face(list,[[X,y,Z],[X,y,z],[X,Y,z],[X,Y,Z]],getColor(color,.71),'#18252866');
}

function plate(list,x,y,z,w,h,color,texture) {
  face(list,[[x,y+h,z],[x+w,y+h,z],[x+w,y,z],[x,y,z]],color,null,texture);
}

function circle(list,x,y,z,r,color,axis='front',steps=18,ratio=1) {
  const v=Array.from({length:steps},(_,i)=>{
    const a=i/steps*Math.PI*2;
    return axis==='top' ? [x+Math.cos(a)*r,y,z+Math.sin(a)*r*ratio] : [x+Math.cos(a)*r,y+Math.sin(a)*r*ratio,z];
  });
  face(list,v,color);
}

function roundBody(list,x,z,rings,color,depth=1) {
  const steps=24;
  const point=([y,r],a)=>[x+Math.cos(a)*r,y,z+Math.sin(a)*r*depth];
  for(let row=1;row<rings.length;row++){
    for(let side=0;side<steps;side++){
      const a=side/steps*Math.PI*2,b=(side+1)/steps*Math.PI*2;
      const light=.88+.21*Math.sin(a)-.10*Math.cos(a);
      face(list,[point(rings[row-1],a),point(rings[row-1],b),point(rings[row],b),point(rings[row],a)],getColor(color,light));
    }
  }
  const [top,radius]=rings.at(-1);
  circle(list,x,top,z,radius,color,'top',steps,depth);
}

const textures={};
const textureFiles={dreams:'dreams.webp','los-angeles':'los-angeles.png',drop:'droptrack-2026-mark.png',launch:'launch.jpg',github:'github.jpg',ego:'ego.jpg'};
for (const [name,file] of Object.entries(textureFiles)) {
  const im=new Image();
  textures[name]=im;
  im.addEventListener('load',()=>paint(performance.now()));
  im.src='assets/'+file;
}

// Room shell, floorboards, and treatment.
box(shell,-5.55,-.29,-4.15,11.1,.29,8.43,'#596b60');
box(shell,-5.55,0,-4.24,11.1,3.64,.26,'#84968a');
box(shell,-5.58,0,-4.15,.24,3.43,8.43,'#657d77');
box(shell,-5.34,0,-4.00,10.86,.15,.10,'#333f3d');
box(shell,-5.34,0,-4.00,.09,.15,8.18,'#333f3d');
for(let i=0;i<22;i++){
  const x=-5.32+i*.492;
  const pattern=['#707f6d','#657363','#6c7969','#66796f','#748171'];
  box(floor,x,.002,-3.99,.48,.006,8.18,pattern[i%5]);
}
for(let b=0;b<3;b++){
  const x=-1.53+b*1.38;
  box(props,x,1.89,-3.98,1.16,1.44,.16,'#394a47');
  for(let n=0;n<9;n++)box(props,x+.08+n*.12,1.99,-3.815,.043,1.24,.025,'#63776b');
}
box(props,4.15,.02,-3.985,1.08,2.53,.09,'#50615b');
box(props,4.22,.04,-3.885,.94,2.40,.035,'#344742');
circle(props,4.98,1.22,-3.835,.05,'#abc5ab');
for(let j=0;j<3;j++)box(props,-5.33,1.89,-2.75+j*1.7,.11,1.44,1.15,'#354948');

// Rug under the mixing desk.
box(rug,-2.45,.014,.14,4.55,.012,2.83,'#3e5653');
for(let i=0;i<6;i++){
  box(rug,-2.4,.027,.23+i*.43,4.44,.005,.035,'#647f74');
}

owner = 'travel';
// Travel pin board and eclipse prints on the rear wall.
box(props,-4.92,1.89,-3.976,2.68,1.44,.14,'#293c34');
plate(props,-4.82,1.99,-3.82,2.46,1.24,'#a6b4a0');
plate(finishes,-4.69,2.21,-3.81,1.40,.83,'#354b51','los-angeles');
for (const [i,c] of ['#95b4b4','#bdcfb5','#e5e5c7','#7ca6b4'].entries()){
  const x=-3.15+(i%2)*.34, y=2.66-Math.floor(i/2)*.38;
  plate(finishes,x,y,-3.804,.29,.31,c);
  circle(finishes,x+.145,y+.153,-3.80,.106,'#dce5d7');
  circle(finishes,x+.16,y+.158,-3.795,.083,'#222f37');
}

owner = 'desk';
// Mixing desk, channel strips, nearfield speakers, and screen.
box(props,-2.50,.13,-1.72,4.92,.85,1.88,'#354740');
box(props,-2.58,.96,-1.82,5.10,.14,2.02,'#798778');
box(props,-2.37,1.10,-1.46,4.66,.12,1.56,'#343e3f');
box(props,-2.42,1.15,-1.69,4.77,.26,.33,'#4c5956');
for(let i=0;i<22;i++){
  const x=-2.24+i*.195;
  face(consoleControls,[[x,1.229,-1.19],[x+.166,1.229,-1.19],[x+.166,1.229,.02],[x,1.229,.02]],i%5===0?'#54665d':'#424f50');
  for(let j=0;j<3;j++)circle(consoleControls,x+.082,1.235,-1.03+j*.18,.038,j===1?'#8b9c94':'#263333','top',10);
  face(consoleControls,[[x+.068,1.238,-.44],[x+.090,1.238,-.44],[x+.090,1.238,-.10],[x+.068,1.238,-.10]],'#171f21');
  box(consoleControls,x+.035,1.244,-.44+((i*3)%9)*.034,.087,.027,.079,i%4===0?'#aac7b6':'#cbd4cc');
  face(consoleControls,[[x+.05,1.42,-1.51],[x+.11,1.42,-1.51],[x+.11,1.42,-1.41],[x+.05,1.42,-1.41]],i%5===1?'#8cd7ab':'#536d62');
}
box(props,-.66,1.40,-2.01,1.32,.09,.42,'#344541');
box(props,-.86,1.49,-2.21,1.73,.89,.18,'#273536');
plate(props,-.78,1.58,-2.018,1.57,.70,'#5d94a1');
for(let line=0;line<5;line++){
  plate(props,-.73,1.65+line*.104,-2.012,1.47,.019,'#b2cec7');
  plate(props,-.73+((line*3)%5)*.12,1.666+line*.104,-2.006,.54+(line%3)*.14,.044,'#3b6774');
}
for(const x of [-2.15,1.31]){
  box(props,x,1.38,-2.34,.72,1.07,.62,'#263332');
  circle(finishes,x+.36,1.80,-1.712,.266,'#60736a');
  circle(finishes,x+.36,1.80,-1.707,.214,'#1c282a');
  circle(finishes,x+.36,1.80,-1.702,.11,'#526561');
  circle(finishes,x+.36,2.23,-1.707,.083,'#7a928c');
  circle(finishes,x+.36,2.23,-1.702,.041,'#293637');
}
box(props,-.51,.40,.74,.92,.13,.67,'#37433f');
box(props,-.47,.48,1.28,.84,.66,.10,'#536658');
box(props,-.12,.04,1.01,.19,.38,.19,'#293433');
box(props,-.56,.03,1.07,1.07,.065,.15,'#364744');

owner = 'rack';
// The rack rises beside the console. The top unit has one source and three destinations.
box(props,2.40,.04,-2.04,1.78,2.33,1.30,'#4b5e57');
box(props,2.50,.12,-.76,1.58,2.15,.044,'#263638');
plate(rackFace,2.53,1.09,-.709,1.52,1.135,'#213538');
plate(rackFace,2.56,1.97,-.703,1.46,.23,'#354c4d');
plate(rackFace,2.62,2.015,-.697,.13,.13,'#f8fbf8','drop');
for(const [key,[x]] of Object.entries(rackJacks)){
  plate(rackFace,x-.24,1.10,-.704,.48,.45,'#344b4b');
  plate(rackFace,x-.054,1.266,-.698,.108,.108,'#ecf3ea',key);
}
for(let j=0;j<4;j++){
  const y=.20+j*.205;
  plate(rackFace,2.55,y,-.706,1.48,.169,j%2?'#304144':'#34474a');
  if(j!==2)circle(rackFace,3.91,y+.084,-.700,.026,j===3?'#77938a':'#4e6a62');
}
for(const [x,y,z] of [...rackFeeds,...Object.values(rackJacks)]){
  circle(rackFace,x,y,z,.064,'#a7bdb2');
  circle(rackFace,x,y,z+.005,.041,'#142729');
}

owner = 'keys';
// Keyboard on a short stand behind the DJ booth.
for(const x of [-4.91,-2.95])for(const z of [-1.57,-1.12]){
  box(keyboard,x,.035,z,.085,1.018,.085,'#394943');
}
box(keyboard,-4.91,.40,-1.58,2.04,.058,.062,'#394943');
box(keyboard,-5.01,1.05,-1.64,2.25,.145,.64,'#374542');
box(keyboard,-4.86,1.195,-1.62,1.96,.011,.14,'#53605a');
for(let control=0;control<5;control++){
  circle(keyboard,-4.73+control*.095,1.217,-1.548,.024,'#232f2c','top',12);
}
face(keyboard,[[-3.29,1.21,-1.592],[-3.12,1.21,-1.592],[-3.12,1.21,-1.518],[-3.29,1.21,-1.518]],'#83a99c');
const whiteNotes=[0,2,4,5,7,9,11];
function tintKey(color,accent,strength){
  const source=color.slice(4,-1).split(',').map(Number);
  const mixed=source.map((part,i)=>Math.round(part+(accent[i]-part)*strength));
  return 'rgb('+mixed.join(',')+')';
}
function pianoKey(note,x,y,z,width,rise,depth,sharp=false){
  const start=keyboard.length;
  box(keyboard,x,y,z,width,rise,depth,sharp?'#293331':'#d0d8ce');
  for(const panel of keyboard.slice(start)){
    panel.note=note;
    panel.hintColor=tintKey(panel.color,[90,151,122],.50);
    panel.struckColor=tintKey(panel.color,[113,204,158],.86);
  }
  const top=y+rise;
  const front=z+depth;
  pianoKeys.push({note,sharp,corners:[
    [x,top,z],[x+width,top,z],[x+width,top,front],[x+width,y,front],[x,y,front],[x,top,front]
  ]});
}
for(let i=0;i<18;i++){
  const x=-4.858+i*.107;
  const note=48+12*Math.floor(i/7)+whiteNotes[i%7];
  pianoKey(note,x,1.194,-1.459,.099,.027,.417);
}
for(let i=0;i<17;i++){
  if(i%7===2||i%7===6)continue;
  const x=-4.786+i*.107;
  const note=49+12*Math.floor(i/7)+whiteNotes[i%7];
  pianoKey(note,x,1.224,-1.46,.061,.039,.239,true);
}

owner = 'music';
// A record bench, two turntables, mixer, and sleeves in a lower cubby.
box(boothStructure,-5.05,.06,.45,2.56,1.01,1.59,'#5b6d5d');
box(boothStructure,djTable.x,1.06,djTable.z,djTable.width,.11,djTable.depth,'#91a091');
owner = 'collection';
plate(shelfFace,-5.00,.19,2.052,2.45,.78,'#243635');
for(let bin=0;bin<3;bin++){
  const x=-4.98+bin*.81;
  plate(shelfFace,x+.026,.255,2.055,.76,.64,'#182a2a');
  for(let i=0;i<6;i++){
    const spine=x+.105+i*.098;
    const h=.49+((i+bin*3)%4)*.039;
    plate(shelfFace,spine,.260,2.07,.077,h,['#bccbc1','#587c87','#9daa98','#7e9c9a','#c1c9b7','#728683'][(i+bin)%6]);
    plate(shelfFace,spine+.012,.321,2.075,.046,.019,'#293a39');
  }
  plate(shelfFace,x,.214,2.08,.045,.735,'#6a7c6f');
}
plate(shelfFace,-5.00,.195,2.085,2.45,.054,'#7f9082');
owner = 'music';
for(const x of deckCenters){
  box(deckBodies,x-deckSize.width/2,1.18,tableCenter.z-deckSize.depth/2,deckSize.width,.11,deckSize.depth,'#4f5e59');
  const recordStart=finishes.length;
  circle(finishes,x,1.301,disc.z,disc.radius,'#172629','top',36);
  circle(finishes,x,1.307,disc.z,.32,'#202f31','top',36);
  circle(finishes,x,1.314,disc.z,.25,'#172528','top',36);
  circle(finishes,x,1.322,disc.z,.13,'#91b7a7','top',24);
  circle(finishes,x,1.335,disc.z,.022,'#1e2d2c','top');
  if(x===disc.x)for(const surface of finishes.slice(recordStart))surface.action='play-record';
}
box(deckBodies,tableCenter.x-mixerSize.width/2,1.18,tableCenter.z-mixerSize.depth/2,mixerSize.width,.11,mixerSize.depth,'#283938');
for(let row=-2;row<=2;row++){
  for(let col=-1;col<=1;col++){
    circle(finishes,tableCenter.x+col*.12,1.30,tableCenter.z+row*.132,.032,col===0?'#9bb8a8':'#58726a','top');
  }
}

owner = 'interviews';
// A compact condenser with the broad, tapered headgrille of a TLM 103.
box(tabletop,1.50,.67,1.72,1.91,.11,1.18,'#8b9c90');
for(const x of [1.58,3.20])for(const z of [1.81,2.68])box(props,x,.03,z,.13,.69,.13,'#3d4f48');
roundBody(interviewMic,2.55,2.24,[[.782,.27],[.810,.27],[.829,.244]],'#435551');
roundBody(interviewMic,2.55,2.24,[[.825,.043],[.971,.043]],'#6f8179');
roundBody(interviewMic,2.55,2.24,[[.952,.070],[1.040,.070]],'#84948a');
roundBody(interviewMic,2.55,2.24,[[1.015,.073],[1.054,.119],[1.076,.153],[1.188,.155]],'#a5b3aa');
roundBody(interviewMic,2.55,2.24,[[1.179,.162],[1.214,.168],[1.233,.161]],'#b7c3b8');
const grillDepth=.76;
roundBody(interviewMic,2.55,2.24,[[1.228,.145],[1.462,.161],[1.495,.155],[1.521,.131],[1.531,.105]],'#87988f',grillDepth);
for(let j=0;j<13;j++){
  const y=1.240+j*.020;
  const r=.146+(y-1.23)*.063;
  for(let n=0;n<24;n++){
    const angle=(n+j*.5)/24*Math.PI*2;
    const at=a=>[2.55+Math.cos(a)*(r+.003),y,2.24+Math.sin(a)*(r+.003)*grillDepth];
    const a=at(angle-.042),b=at(angle+.042);
    face(interviewMic,[a,b,[b[0],y+.010,b[2]],[a[0],y+.010,a[2]]],(n+j)%4===0?'#c9d3c8':'#596b65');
  }
}
face(interviewMic,[[2.55,1.159,2.397],[2.575,1.135,2.397],[2.55,1.111,2.397],[2.525,1.135,2.397]],'#526e63','#c4d0c7');

// Boris is curled up on the listening chair.
owner = null;
box(chairAndCat,4.02,.15,1.71,1.10,.37,.90,'#354942');
box(chairAndCat,4.06,.49,1.73,1.01,.23,.76,'#758d7d');
box(chairAndCat,4.00,.54,1.68,1.14,.60,.19,'#648374');
box(chairAndCat,4.00,.51,1.87,.16,.30,.61,'#5a776c');
box(chairAndCat,4.97,.51,1.87,.16,.30,.61,'#5a776c');
function oval(list,x,y,z,rx,ry,rz,color,steps=12,rows=7) {
  const point=(lat,lon)=>[
    x+Math.cos(lat)*Math.cos(lon)*rx,
    y+Math.sin(lat)*ry,
    z+Math.cos(lat)*Math.sin(lon)*rz
  ];
  for(let i=0;i<rows;i++){
    const low=i/rows*Math.PI-Math.PI/2,hi=(i+1)/rows*Math.PI-Math.PI/2;
    for(let n=0;n<steps;n++){
      const a=n/steps*Math.PI*2,b=(n+1)/steps*Math.PI*2;
      const factor=.83+.18*Math.sin((low+hi)/2)+.10*Math.sin((a+b)/2);
      face(list,[point(low,a),point(low,b),point(hi,b),point(hi,a)],getColor(color,factor));
    }
  }
}
owner = 'boris';
const catOffset=[.32,.62,-1.47];
const seatFaces=chairAndCat.length;
oval(chairAndCat,4.03,.27,3.47,.51,.25,.30,'#819092');
oval(chairAndCat,4.43,.44,3.59,.26,.24,.23,'#8f9c9f');
for(const sign of [-1,1]){
  const ex=4.43+sign*.14;
  face(chairAndCat,[[ex-.102,.55,3.69],[ex+.097,.54,3.68],[ex+sign*.039,.809,3.63]],'#87999d');
  face(catFinishes,[[ex-.060,.59,3.683],[ex+.056,.584,3.683],[ex+sign*.034,.754,3.653]],'#55686e');
  const pawX=4.32+sign*.15;
  oval(chairAndCat,pawX-.04,.234,3.605,.127,.116,.222,'#819092',10,6);
  oval(chairAndCat,pawX,.152,3.744,.129,.088,.142,'#819092',10,6);
  circle(catFinishes,4.43+sign*.100,.472,3.81,.033,'#b1ce87','front',13,.66);
  circle(catFinishes,4.43+sign*.100,.473,3.811,.013,'#172826','front',10);
}
circle(catFinishes,4.428,.399,3.824,.034,'#26373c','front',13,.65);
for(let i=0;i<9;i++){
  const a=i/8*1.57;
  oval(chairAndCat,3.78-.40*Math.sin(a),.146,3.45+.63*(1-Math.cos(a)),.098-i*.004,.082-i*.003,.099-i*.004,'#75878c',8,5);
}
for(const f of [...chairAndCat.slice(seatFaces),...catFinishes]){
  f.vertices=f.vertices.map(v=>v.map((part,i)=>part+catOffset[i]));
}
owner = null;

const camera = {yaw:.41,elev:.57,zoom:1,tx:0,ty:0};
const goal = {...camera};
const idle = {...camera};
let dimensions;
let frame = null;
let dragPoint = null;
let activeObject = null;
let wheelCamera = null;
let focusCord = 0;
let signalStart = -10000;

const roomBounds = [
  [-5.58,-.29,-4.24],[5.55,-.29,-4.24],[5.55,-.29,4.28],[-5.58,-.29,4.28],
  [-5.58,3.64,-4.24],[5.55,3.64,-4.24],[-5.58,3.43,4.28]
];
function fitRoom(w,h,pose) {
  const c=Math.cos(pose.yaw), s=Math.sin(pose.yaw);
  const lift=Math.sin(pose.elev), down=Math.cos(pose.elev);
  const projected=roomBounds.map(([x,y,z])=>[c*x-s*z,lift*(s*x+c*z)-down*y]);
  const xs=projected.map(p=>p[0]), ys=projected.map(p=>p[1]);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const insetX=Math.max(9,w*.024), insetY=Math.max(12,h*.038);
  const scale=Math.min((w-2*insetX)/(maxX-minX),(h-2*insetY)/(maxY-minY))*pose.zoom;
  return {scale,cx:w/2-(minX+maxX)*scale/2,cy:h/2-(minY+maxY)*scale/2};
}

function planePoint([x,y,z],pose){
  const c=Math.cos(pose.yaw),s=Math.sin(pose.yaw);
  return [c*x-s*z,Math.sin(pose.elev)*(s*x+c*z)-Math.cos(pose.elev)*y];
}
function framedPose(key){
  const gear=locations[key];
  const {width:w,height:h,right}=stage.getBoundingClientRect();
  const pose={...idle,yaw:gear.yaw,elev:gear.elev};
  const [min,max]=gear.bounds;
  const points=[];
  for(const x of [min[0],max[0]])
    for(const y of [min[1],max[1]])
      for(const z of [min[2],max[2]])points.push(planePoint([x,y,z],pose));
  const x=points.map(p=>p[0]),y=points.map(p=>p[1]);
  const width=Math.max(...x)-Math.min(...x),height=Math.max(...y)-Math.min(...y);
  const center=[(Math.max(...x)+Math.min(...x))/2,(Math.max(...y)+Math.min(...y))/2];
  let visibleWidth=w;
  if(!gear.inRoom&&!narrow.matches){
    const styles=getComputedStyle(document.querySelector('.drawer'));
    const drawerWidth=parseFloat(styles.width);
    const drawerRight=parseFloat(styles.right);
    const covered=right-(innerWidth-drawerRight-drawerWidth);
    visibleWidth=Math.max(w*.46,w-Math.max(0,covered));
  }
  const base=fitRoom(w,h,pose);
  const xFill=gear.inRoom&&!narrow.matches?.73:.86;
  const yFill=gear.inRoom?.74:.67;
  const scale=Math.min(visibleWidth*xFill/width,h*yFill/height,base.scale*(gear.maxZoom??7));
  pose.zoom=scale/base.scale;
  const fit=fitRoom(w,h,pose);
  pose.tx=visibleWidth*.50-center[0]*scale-fit.cx;
  pose.ty=h*(gear.inRoom?.54:.48)-center[1]*scale-fit.cy;
  return pose;
}

function screen(x,y,z) {
  const c=Math.cos(camera.yaw), s=Math.sin(camera.yaw);
  const lift=Math.sin(camera.elev), down=Math.cos(camera.elev);
  const far=s*x+c*z;
  return [(c*x-s*z)*dimensions.scale+dimensions.cx+camera.tx,(lift*far-down*y)*dimensions.scale+dimensions.cy+camera.ty,far*down+lift*y];
}

function path(coords) {
  ctx.beginPath();
  ctx.moveTo(coords[0][0],coords[0][1]);
  for(const p of coords.slice(1))ctx.lineTo(p[0],p[1]);
  ctx.closePath();
}

function drawFaces(faces,depthSort=true) {
  const planes=faces.map(f=>{
    const coords=f.vertices.map(p=>screen(...p));
    return {face:f,coords,depth:coords.reduce((sum,p)=>sum+p[2],0)/coords.length};
  });
  if(depthSort)planes.sort((a,b)=>a.depth-b.depth);
  for(const {face:f,coords} of planes){
    path(coords);
    if(f.note!==undefined && pianoLighting.sounding.has(f.note))ctx.fillStyle=f.struckColor;
    else if(f.note===pianoLighting.hovered || f.note===pianoLighting.focused)ctx.fillStyle=f.hintColor;
    else ctx.fillStyle=f.color;
    ctx.fill();
    hitRegions.push({owner:f.owner,coords,note:f.note,action:f.action});
    if(f.line){ctx.strokeStyle=f.line;ctx.lineWidth=.65;ctx.stroke();}
    const im=textures[f.texture];
    if (im?.complete && im.naturalWidth) {
      const [a,b,,d]=coords;
      ctx.save();
      ctx.clip();
      ctx.transform(b[0]-a[0],b[1]-a[1],d[0]-a[0],d[1]-a[1],a[0],a[1]);
      ctx.drawImage(im,0,0,1,1);
      ctx.restore();
    }
  }
}

function rackEnd(index) {
  const target=roomCords[index];
  return target ? rackJacks[target] : rackParked[index];
}

function drawRackLabels(){
  if(activeObject!=='rack')return;
  ctx.save();
  ctx.textBaseline='middle';
  ctx.fillStyle='#e1e9df';
  const [headerX,headerY]=screen(2.79,2.08,-.691);
  ctx.font='600 '+Math.max(10,.085*dimensions.scale)+'px Helvetica, Arial, sans-serif';
  ctx.fillText('DropTrack',headerX,headerY,.72*dimensions.scale);
  ctx.textAlign='center';
  ctx.font='550 '+Math.max(7.5,.062*dimensions.scale)+'px Helvetica, Arial, sans-serif';
  const labels=[
    ['LaunchDarkly',rackJacks.launch[0]],
    ['GitHub',rackJacks.github[0]],
    ['No Ego Records',rackJacks.ego[0]]
  ];
  for(const [text,x] of labels){
    const [px,py]=screen(x,1.193,-.693);
    ctx.fillText(text,px,py,.44*dimensions.scale);
  }
  ctx.restore();
}

function drawCables(time) {
  const pulse=Math.max(0,Math.min(1,(time-signalStart)/1150));
  for(const [index,target] of roomCords.entries()){
    const from=rackFeeds[index];
    const to=rackEnd(index);
    const carrying=cableDrag?.index===index;
    const a=screen(...from);
    const d=carrying?cableDrag.point:screen(...to);
    const k=dimensions.scale;
    const b=[a[0]-.055*k,a[1]+.39*k];
    const c=[d[0]+.30*k,d[1]-(target&&!carrying?.025:.03)*k];
    const color=patchColors[index];
    const active=index===focusCord && target && !carrying;
    const width=Math.max(1.8,Math.min(4.4,dimensions.scale*.026));
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(a[0],a[1]);
    ctx.bezierCurveTo(b[0],b[1],c[0],c[1],d[0],d[1]);
    ctx.lineCap='round';
    ctx.lineWidth=width+2;
    ctx.strokeStyle='#0d1718';
    ctx.stroke();
    ctx.lineWidth=width;
    ctx.strokeStyle=color;
    if(active){ctx.shadowBlur=8;ctx.shadowColor=color;}
    ctx.stroke();
    ctx.shadowBlur=0;
    for(const point of [a,d]){
      ctx.beginPath();
      ctx.arc(point[0],point[1],width*.93,0,Math.PI*2);
      ctx.fillStyle=color;ctx.fill();
      ctx.lineWidth=1;ctx.strokeStyle='#cddcd2';ctx.stroke();
    }
    if(carrying||!target){
      ctx.beginPath();ctx.moveTo(d[0],d[1]);ctx.lineTo(d[0]+width*.51,d[1]+width*1.4);
      ctx.lineWidth=Math.max(3,width*1.14);ctx.strokeStyle='#c2cdc6';ctx.stroke();
    }
    if(active&&pulse<1){
      const t=pulse, q=1-t;
      const pos=[0,1].map(i=>q*q*q*a[i]+3*q*q*t*b[i]+3*q*t*t*c[i]+t*t*t*d[i]);
      ctx.beginPath();ctx.arc(pos[0],pos[1],width*.72,0,Math.PI*2);ctx.fillStyle='#f1f9ef';ctx.fill();
    }
    ctx.restore();
  }
}

function planeFrame(x,y,z){
  const center=screen(x,y,z);
  const ax=screen(x+1,y,z),az=screen(x,y,z+1);
  return {center,dx:[ax[0]-center[0],ax[1]-center[1]],dz:[az[0]-center[0],az[1]-center[1]]};
}
function onTop(x,y,z,draw) {
  const {center,dx,dz}=planeFrame(x,y,z);
  ctx.save();
  ctx.transform(...dx,...dz,center[0],center[1]);
  draw();
  ctx.restore();
}
function drawRecord() {
  const rotation=reduced.matches ? 0 : recordView.position*Math.PI*1.1;
  onTop(disc.x,disc.y,disc.z,()=>{
    for(let radius=.382;radius>.113;radius-=.027){
      ctx.beginPath();ctx.arc(0,0,radius,0,2*Math.PI);
      ctx.lineWidth=.003;ctx.strokeStyle='#65867e63';ctx.stroke();
    }
    ctx.rotate(rotation);
    const art=textures.dreams;
    ctx.beginPath();ctx.arc(0,0,.129,0,2*Math.PI);ctx.clip();
    if(art?.complete&&art.naturalWidth)ctx.drawImage(art,-.129,-.129,.258,.258);
    ctx.fillStyle='#172426';ctx.beginPath();ctx.arc(0,0,.012,0,2*Math.PI);ctx.fill();
  });
  onTop(...deckSwitch,()=>{
    ctx.fillStyle=recordView.playing?'#b7d8ba':'#b6c7bd';
    ctx.fillRect(-.082,-.069,.164,.138);
    ctx.fillStyle='#203633';
    if(recordView.playing){
      ctx.fillRect(-.034,-.033,.023,.066);
      ctx.fillRect(.011,-.033,.023,.066);
    }else{
      ctx.beginPath();ctx.moveTo(-.032,-.041);ctx.lineTo(.043,0);ctx.lineTo(-.032,.041);ctx.closePath();ctx.fill();
    }
  });
  drawTonearm(disc.x,needle,needleCue);
  drawTonearm(deckCenters[1],0);
}

function stylusPoint(x,reaching,cue=null){
  if(cue)return [cue.x,1.421,cue.z];
  return [x+.35-.14*reaching,1.401-.034*reaching,disc.z+.32-.16*reaching];
}

function drawTonearm(x,reaching,cue=null){
  const pivot=screen(x+.354,1.42,disc.z-.38);
  const foot=screen(x+.354,1.303,disc.z-.38);
  const [stylusX,stylusY,stylusZ]=stylusPoint(x,reaching,cue);
  const bend=screen(x+.349-.044*reaching+(cue?(stylusX-x-.35)*.30:0),1.405,disc.z-.03);
  const tip=screen(stylusX,stylusY,stylusZ);
  const contact=screen(stylusX,1.321+(disc.y-1.321)*reaching,stylusZ);
  const width=Math.min(6,Math.max(1.6,dimensions.scale*.016));
  ctx.save();
  ctx.lineCap='round';
  ctx.strokeStyle='#314641';ctx.lineWidth=width*2.2;
  ctx.beginPath();ctx.moveTo(...foot.slice(0,2));ctx.lineTo(...pivot.slice(0,2));ctx.stroke();
  ctx.strokeStyle='#8ca295';ctx.lineWidth=width*.9;
  ctx.beginPath();ctx.moveTo(...tip.slice(0,2));ctx.lineTo(...contact.slice(0,2));ctx.stroke();
  ctx.strokeStyle='#243833';ctx.lineWidth=width+1.3;
  ctx.beginPath();ctx.moveTo(...pivot.slice(0,2));ctx.quadraticCurveTo(bend[0],bend[1],tip[0],tip[1]);ctx.stroke();
  ctx.strokeStyle='#cad5c9';ctx.lineWidth=width;ctx.stroke();
  ctx.fillStyle='#9ab5a5';
  ctx.beginPath();ctx.arc(pivot[0],pivot[1],width*1.40,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#435750';ctx.lineWidth=width*1.65;
  ctx.beginPath();ctx.moveTo(tip[0]+(bend[0]-tip[0])*.10,tip[1]+(bend[1]-tip[1])*.10);ctx.lineTo(tip[0],tip[1]);ctx.stroke();
  ctx.restore();
}
function moveNeedle(cue){
  needleCue=cue;
  requestRoomFrame();
}
function showDeck(position,playing,scratching=false){
  recordView={position,playing,scratching};
  requestRoomFrame();
}
function moveCable(moving){
  cableDrag=moving;
  requestRoomFrame();
}

function paint(time=performance.now()) {
  if(!ctx)return;
  const rect=stage.getBoundingClientRect();
  const dpr=Math.min(devicePixelRatio||1,2);
  const w=rect.width,h=rect.height;
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
  }
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,w,h);
  hitRegions.length=0;
  dimensions=fitRoom(w,h,camera);
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(w*.52,h*.74,w*.41,h*.18,0,0,Math.PI*2);
  ctx.fillStyle='#0c16194b';
  ctx.shadowColor='#101919';ctx.shadowBlur=36;
  ctx.fill();
  ctx.restore();
  drawFaces(shell);
  drawFaces(floor);
  drawFaces(rug);
  drawFaces(props);
  drawFaces(keyboard,false);
  drawFaces(boothStructure);
  drawFaces(consoleControls,false);
  drawFaces(deckBodies);
  drawFaces(finishes);
  drawFaces(rackFace,false);
  drawFaces(shelfFace,false);
  drawFaces(tabletop);
  drawFaces(interviewMic);
  drawFaces(chairAndCat);
  drawFaces(catFinishes);
  drawRackLabels();
  drawCables(time);
  drawRecord();
  gearPainter?.();
}

function animate(time){
  let pending=false;
  const tonePosition=recordView.playing||recordView.scratching?1:0;
  if(Math.abs(tonePosition-needle)>.005){
    needle+=(tonePosition-needle)*(reduced.matches?1:.24);
    pending=true;
  }else needle=tonePosition;
  for(const key of Object.keys(camera)){
    const difference=goal[key]-camera[key];
    if (Math.abs(difference)>.001){
      camera[key]+=difference*(reduced.matches?1:.19);
      pending=true;
    } else camera[key]=goal[key];
  }
  paint(time);
  if(pending||(!reduced.matches && time<signalStart+1150))frame=requestAnimationFrame(animate);
  else frame=null;
}
function requestRoomFrame(){
  if(frame===null)frame=requestAnimationFrame(animate);
}
function setFocus(key){
  if(!key||wheelCamera?.key!==key)wheelCamera=null;
  activeObject=key;
  stage.removeAttribute('data-wheel-zoom');
  Object.assign(goal,key?framedPose(key):idle);
  requestRoomFrame();
}
function aimWheelCamera(){
  const {key,overview,progress}=wheelCamera;
  const target=framedPose(key);
  for(const axis of Object.keys(goal))goal[axis]=overview[axis]+(target[axis]-overview[axis])*progress;
  stage.toggleAttribute('data-wheel-zoom',progress>0&&progress<1);
  requestRoomFrame();
}
function setRackWires(routes, selected) {
  roomCords=[...routes];
  focusCord=selected;
  signalStart=reduced.matches?-10000:performance.now();
  requestRoomFrame();
}

function hitAt(clientX,clientY) {
  const bounds=canvas.getBoundingClientRect();
  const point=[clientX-bounds.left,clientY-bounds.top];
  for(let i=hitRegions.length-1;i>=0;i--){
    const hit=hitRegions[i];
    const {coords}=hit;
    let inside=false;
    for(let a=0,b=coords.length-1;a<coords.length;b=a++){
      const [x,y]=coords[a], [px,py]=coords[b];
      if((y>point[1])!==(py>point[1]) && point[0]<(px-x)*(point[1]-y)/(py-y)+x)inside=!inside;
    }
    if(inside)return hit;
  }
  return null;
}
function pick(clientX,clientY) {
  return hitAt(clientX,clientY)?.owner??null;
}
function hideGearLabel(){
  gearLabel.hidden=true;
  canvas.classList.remove('on-gear');
}
canvas.addEventListener('pointerdown',event=>{
  if (event.button!==0) return;
  dragPoint={id:event.pointerId,x:event.clientX,y:event.clientY,angle:goal.yaw,elev:goal.elev,moved:false};
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener('pointermove',event=>{
  if (!dragPoint) {
    if(event.pointerType==='touch')return;
    const key=pick(event.clientX,event.clientY);
    if(!key){hideGearLabel();return;}
    const bounds=stage.getBoundingClientRect();
    gearLabel.textContent=locations[key].label;
    gearLabel.style.left=Math.min(bounds.width-110,event.clientX-bounds.left+13)+'px';
    gearLabel.style.top=Math.max(7,event.clientY-bounds.top-30)+'px';
    gearLabel.hidden=false;
    canvas.classList.add('on-gear');
    return;
  }
  if(event.pointerId!==dragPoint.id)return;
  const dx=event.clientX-dragPoint.x,dy=event.clientY-dragPoint.y;
  if(!dragPoint.moved&&Math.hypot(dx,dy)<6)return;
  dragPoint.moved=true;
  hideGearLabel();
  if(activeObject||wheelCamera)return;
  stage.classList.add('dragging');
  goal.yaw=Math.max(.03,Math.min(.79,dragPoint.angle+dx*.004));
  goal.elev=Math.max(.36,Math.min(.75,dragPoint.elev+dy*.003));
  requestRoomFrame();
});
function stopDrag(){
  dragPoint=null;
  stage.classList.remove('dragging');
}
canvas.addEventListener('pointerup',event=>{
  if(!dragPoint||event.pointerId!==dragPoint.id)return;
  if(!dragPoint.moved){
    const hit=hitAt(event.clientX,event.clientY);
    const key=hit?.owner??null;
    stage.dispatchEvent(new CustomEvent('studio-pick',{bubbles:true,detail:{key,note:hit?.note,action:hit?.action}}));
  }
  stopDrag();
  hideGearLabel();
});
canvas.addEventListener('pointercancel',stopDrag);
canvas.addEventListener('lostpointercapture',stopDrag);
canvas.addEventListener('pointerleave',hideGearLabel);
document.addEventListener('wheel',event=>{
  const delta=event.deltaY;
  if(event.ctrlKey||event.metaKey||!delta||Math.abs(delta)<Math.abs(event.deltaX))return;
  const overStudio=stage.contains(event.target);
  const panel=event.target.closest('.drawer');
  if(panel&&(delta<0||panel.scrollHeight>panel.clientHeight+1))return;
  if(delta<0&&!overStudio)return;
  if(!wheelCamera){
    const key=activeObject||(delta<0?pick(event.clientX,event.clientY):null);
    if(!key)return;
    wheelCamera={key,overview:{...(activeObject?idle:goal)},progress:activeObject?1:0};
  }
  event.preventDefault();
  hideGearLabel();
  const previous=wheelCamera.progress;
  const unit=event.deltaMode===1?16:event.deltaMode===2?stage.clientHeight:1;
  const change=Math.min(.64,Math.abs(delta)*unit/235)*Math.sign(delta);
  const next=Math.max(0,Math.min(1,previous-change));
  if(next===previous)return;
  wheelCamera.progress=next;
  aimWheelCamera();
  if(previous===1){
    activeObject=null;
    stage.dispatchEvent(new CustomEvent('studio-zoom',{detail:{key:null}}));
  }else if(next===1){
    stage.dispatchEvent(new CustomEvent('studio-zoom',{detail:{key:wheelCamera.key}}));
  }
  if(next===0)wheelCamera=null;
},{passive:false});
for(const b of document.querySelectorAll('[data-turn]'))b.addEventListener('click',()=>{
  if(activeObject||wheelCamera)return;
  goal.yaw=Math.max(.03,Math.min(.79,goal.yaw+Number(b.dataset.turn)*.16));
  requestRoomFrame();
});
document.querySelector('[data-reset]').addEventListener('click',()=>{
  if(activeObject)stage.dispatchEvent(new CustomEvent('studio-zoom',{detail:{key:null}}));
  setFocus(null);
});
new ResizeObserver(()=>{
  if(wheelCamera)aimWheelCamera();
  else if(activeObject)setFocus(activeObject);
  else requestRoomFrame();
}).observe(stage);
requestRoomFrame();
