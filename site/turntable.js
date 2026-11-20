const deck = {
  audio:null, buffer:null, pending:null, source:null, position:0, started:0, grain:null
};

function openAudio() {
  if (!deck.audio) deck.audio=new AudioContext();
  const unlocked=deck.audio.state==='running'?Promise.resolve():deck.audio.resume();
  if (deck.buffer) return unlocked.then(()=>deck.buffer);
  if (!deck.pending) {
    deck.pending=new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src='assets/dreams-audio.js';
      script.addEventListener('load',resolve,{once:true});
      script.addEventListener('error',reject,{once:true});
      document.head.append(script);
    }).then(()=>{
      const bytes=Uint8Array.from(atob(window.dreamsAudioBase64),char=>char.charCodeAt(0));
      delete window.dreamsAudioBase64;
      return deck.audio.decodeAudioData(bytes.buffer);
    }).then(buffer=>{
      deck.buffer=buffer;
      return buffer;
    }).catch(error=>{
      deck.pending=null;
      throw error;
    });
  }
  return Promise.all([unlocked,deck.pending]).then(([,buffer])=>buffer);
}

function recordPosition() {
  const now=deck.audio?.currentTime ?? 0;
  const offset=deck.position+(deck.source?now-deck.started:0);
  return Math.max(0,Math.min(deck.buffer?.duration??276,offset));
}
function stopRecord() {
  if (!deck.source) return;
  deck.position=recordPosition();
  const source=deck.source;
  deck.source=null;
  source.stop();
}
function startRecord(onEnd) {
  stopRecord();
  if(deck.position>=deck.buffer.duration-.03)deck.position=0;
  const source=deck.audio.createBufferSource();
  source.buffer=deck.buffer;
  source.connect(deck.audio.destination);
  deck.source=source;deck.started=deck.audio.currentTime;
  source.onended=()=>{
    if (deck.source!==source) return;
    deck.source=null;deck.position=deck.buffer.duration;
    onEnd();
  };
  source.start(0,deck.position);
}

function scrubGrain(position,direction,speed) {
  const material=deck.buffer;
  const audio=deck.audio;
  if(!material||!audio)return;
  if(deck.grain)try{deck.grain.stop();}catch{}
  const size=Math.floor(material.sampleRate*.081);
  const grain=audio.createBuffer(material.numberOfChannels,size,material.sampleRate);
  const anchor=Math.floor(position*material.sampleRate);
  for(let channel=0;channel<material.numberOfChannels;channel++){
    const from=material.getChannelData(channel);
    const to=grain.getChannelData(channel);
    for(let i=0;i<size;i++){
      const index=anchor+i*direction;
      const volume=Math.min(1,i/(size*.08),(size-i)/(size*.22));
      to[i]=(index>=0&&index<from.length?from[index]:0)*volume;
    }
  }
  const source=audio.createBufferSource();
  source.buffer=grain;
  source.playbackRate.value=Math.min(2.6,Math.max(.48,speed));
  source.connect(audio.destination);
  deck.grain=source;
  source.onended=()=>{if(deck.grain===source)deck.grain=null;};
  source.start();
}

function mountTurntable(layer,note,{action}={}) {
  const platter=el('div','','projected-control live-platter');
  platter.tabIndex=0;
  platter.setAttribute('role','slider');
  platter.setAttribute('aria-label','Scratch Dreams');
  platter.setAttribute('aria-valuemin','0');
  platter.setAttribute('aria-valuemax','276');
  platter.setAttribute('aria-valuenow','0');
  const button=el('button','','projected-control deck-switch');
  button.type='button';
  const arm=el('button','','projected-control needle-grip');
  arm.type='button';
  layer.append(platter,button,arm);

  const footer=el('div','','scene-transport');
  const bar=el('input');
  bar.type='range';bar.min='0';bar.max='276';bar.value='0';bar.step='.1';
  bar.setAttribute('aria-label','Seek through Dreams');
  const clock=el('time','0:00');
  const track=trackedLink(a('',urls.dreams,'track-name'),'studio_music_link','Velvet Circuits');
  track.append(el('strong','Dreams'),el('span','Velvet Circuits'));
  const collection=el('button','Record shelf','collection-link');
  collection.type='button';
  collection.dataset.open='collection';
  footer.append(track,bar,clock,collection);
  const scratchHelp='Tap the record or drop the needle to play. Tap the playing needle to stop. Drag the vinyl to scratch.';
  const status=el('p',scratchHelp,'station-help');
  status.setAttribute('role','status');
  note.append(footer,status);

  let awake=true;
  let frameId=null;
  let dragging=null;
  let armDrag=null;
  let playIntent=0;
  let lastGrain=0;
  let discPlane=null;
  function layout(){
    discPlane=planeFrame(disc.x,disc.y,disc.z);
    const {center,dx,dz}=discPlane;
    const w=2*disc.radius*Math.hypot(dx[0],dz[0]);
    const h=2*disc.radius*Math.hypot(dx[1],dz[1]);
    placeControl(platter,center[0],center[1],w,h);
    const [x,y]=screen(...deckSwitch);
    placeControl(button,x,y,Math.max(44,.178*dimensions.scale),Math.max(44,.158*dimensions.scale));
    const [armX,armY]=screen(...stylusPoint(disc.x,needle,needleCue));
    placeControl(arm,armX,armY,Math.max(36,.12*dimensions.scale));
  }
  gearPainter=layout;
  function show(){
    const pos=recordPosition();
    const text=Math.floor(pos/60)+':'+String(Math.floor(pos)%60).padStart(2,'0');
    const playing=Boolean(deck.source);
    button.setAttribute('aria-label',playing?'Pause Dreams':'Play Dreams');
    button.title=playing?'Pause Dreams':'Play Dreams';
    arm.setAttribute('aria-label',playing?'Lift the needle to stop Dreams':'Drop the needle onto Dreams');
    clock.textContent=text;
    bar.value=pos;
    layer.dataset.playing=String(playing);
    platter.setAttribute('aria-valuenow',String(Math.round(pos)));
    platter.setAttribute('aria-valuetext',text);
    showDeck(pos,playing,Boolean(dragging?.moving));
  }
  function tick(){
    if(!awake)return;
    show();
    frameId=deck.source?requestAnimationFrame(tick):null;
  }
  async function readyToPlay(){
    if(!deck.buffer)status.textContent='Loading Dreams…';
    try {
      await openAudio();
      if(awake)status.textContent=scratchHelp;
      return awake;
    } catch {
      if(awake)status.textContent='The recording could not load. Try the Velvet Circuits link.';
      return false;
    }
  }
  function resume(){
    if(deck.source)return;
    startRecord(show);
    if(frameId===null)frameId=requestAnimationFrame(tick);
    show();
  }
  async function play(trackStart=true){
    if(deck.source)return;
    const intent=++playIntent;
    if(await readyToPlay()&&intent===playIntent&&!dragging?.moving&&!armDrag){
      resume();
      if(trackStart&&deck.source)trackStudioEvent('studio_dreams_play');
    }
  }
  function pause(){
    playIntent++;
    stopRecord();
    show();
  }
  function tapArm(){
    if(deck.source)pause();
    else play();
  }
  button.addEventListener('click',()=>{
    if(deck.source){pause();return;}
    button.disabled=true;
    play().finally(()=>{button.disabled=false;});
  });
  bar.addEventListener('input',()=>{
    const wasPlaying=Boolean(deck.source);
    stopRecord();
    deck.position=Number(bar.value);
    if(wasPlaying)resume();else show();
  });
  function discPoint(event){
    const bounds=stage.getBoundingClientRect();
    const {center,dx,dz}=discPlane;
    const x=event.clientX-bounds.left-center[0],y=event.clientY-bounds.top-center[1];
    const det=dx[0]*dz[1]-dx[1]*dz[0];
    if(Math.abs(det)<.5)return null;
    return {x:(x*dz[1]-y*dz[0])/det,z:(y*dx[0]-x*dx[1])/det};
  }
  function onRecord(point){
    return point&&Math.hypot(point.x,point.z)<=disc.radius;
  }
  platter.addEventListener('pointerdown',event=>{
    if((event.pointerType==='mouse'&&event.button!==0)||!discPlane||dragging||armDrag)return;
    const point=discPoint(event);
    if(!onRecord(point))return;
    dragging={id:event.pointerId,x:event.clientX,y:event.clientY,angle:Math.atan2(point.z,point.x),time:performance.now(),moving:false,resume:false};
    platter.setPointerCapture(event.pointerId);
    readyToPlay();
  });
  platter.addEventListener('pointermove',event=>{
    if(!dragging||event.pointerId!==dragging.id)return;
    const point=discPoint(event);
    if(!point)return;
    if(!dragging.moving){
      if(Math.hypot(event.clientX-dragging.x,event.clientY-dragging.y)<5)return;
      dragging.moving=true;
      trackStudioEvent('studio_dreams_scratch');
      dragging.resume=Boolean(deck.source);
      playIntent++;
      stopRecord();
    }
    const now=performance.now(),next=Math.atan2(point.z,point.x);
    let change=next-dragging.angle;
    if(change>Math.PI)change-=Math.PI*2;
    if(change< -Math.PI)change+=Math.PI*2;
    if(Math.abs(change)<.014){show();return;}
    const seconds=change*.31;
    deck.position=Math.max(0,Math.min(deck.buffer?.duration??276,deck.position+seconds));
    if(deck.buffer&&now-lastGrain>33){
      scrubGrain(deck.position,Math.sign(change),Math.abs(seconds)*1000/Math.max(now-dragging.time,11));
      lastGrain=now;
    }
    dragging.angle=next;dragging.time=now;
    show();
  });
  function releasePlatter(event){
    if(!dragging||dragging.id!==event.pointerId)return;
    const restart=dragging.resume||(!dragging.moving&&event.type==='pointerup');
    const trackStart=!dragging.moving;
    dragging=null;
    show();
    if(restart)play(trackStart);
  }
  for(const type of ['pointerup','pointercancel','lostpointercapture']){
    platter.addEventListener(type,releasePlatter);
  }
  arm.addEventListener('pointerdown',event=>{
    if((event.pointerType==='mouse'&&event.button!==0)||!discPlane||dragging||armDrag)return;
    armDrag={id:event.pointerId,x:event.clientX,y:event.clientY,moving:false,resume:Boolean(deck.source)};
    arm.setPointerCapture(event.pointerId);
    readyToPlay();
  });
  arm.addEventListener('pointermove',event=>{
    if(!armDrag||event.pointerId!==armDrag.id)return;
    const point=discPoint(event);
    if(!point)return;
    if(!armDrag.moving){
      if(Math.hypot(event.clientX-armDrag.x,event.clientY-armDrag.y)<5)return;
      armDrag.moving=true;
      playIntent++;
      stopRecord();
    }
    moveNeedle({x:disc.x+point.x,z:disc.z+point.z});
    show();
  });
  function releaseArm(event){
    if(!armDrag||event.pointerId!==armDrag.id)return;
    const {moving,resume}=armDrag;
    armDrag=null;
    moveNeedle(null);
    if(event.type==='pointerup'&&!moving){tapArm();return;}
    const shouldPlay=event.type==='pointerup'?onRecord(discPoint(event)):resume;
    if(shouldPlay)play();else show();
  }
  for(const type of ['pointerup','pointercancel','lostpointercapture']){
    arm.addEventListener(type,releaseArm);
  }
  arm.addEventListener('click',event=>{
    if(event.detail===0&&!event.pointerType)tapArm();
  });
  platter.addEventListener('keydown',async event=>{
    if(event.key==='Enter'||event.key===' '){
      event.preventDefault();
      play();
      return;
    }
    if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();
    const wasPlaying=Boolean(deck.source);
    stopRecord();
    const direction=event.key==='ArrowLeft'?-1:1;
    deck.position=Math.max(0,Math.min(deck.buffer?.duration??276,deck.position+direction*.22));
    if(await readyToPlay()){
      scrubGrain(deck.position,direction,1);
      if(!event.repeat)trackStudioEvent('studio_dreams_scratch');
    }
    if(wasPlaying&&awake)resume();else show();
  });
  show();
  if(action==='play-record')play();
  return ()=>{
    awake=false;
    dragging=null;
    armDrag=null;
    moveNeedle(null);
    if(frameId!==null)cancelAnimationFrame(frameId);
    stopRecord();
    if(deck.grain)try{deck.grain.stop();}catch{}
    showDeck(recordPosition(),false);
    delete layer.dataset.playing;
  };
}
