const chromaticNotes=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const pianoEnvelope={attack:.008,settled:.28,floor:.001};
const pianoShortcuts='z s x d c v g b h n j m q 2 w 3 e r 5 t 6 y 7 u i 9 o 0 p ['.split(' ');
let pianoAudio;

function noteName(note) {
  return chromaticNotes[note%12]+(Math.floor(note/12)-1);
}

function rampEnergy(from,to,duration) {
  return duration*(to**2-from**2)/(2*Math.log(to/from));
}

function pianoDecayStart(decay) {
  return .045+decay*.12;
}

function pianoAttackEnergy(decay,sustain) {
  const {attack,settled,floor}=pianoEnvelope;
  const decayStart=pianoDecayStart(decay);
  const tailLength=Math.min(.495,decay)-decayStart;
  const tailEnd=settled*(sustain/settled)**(tailLength/(decay-decayStart));
  return rampEnergy(floor,1,attack)
    +rampEnergy(1,settled,decayStart-attack)
    +rampEnergy(settled,tailEnd,tailLength)
    +Math.max(0,.495-decay)*sustain**2;
}

function pianoOutput() {
  if(pianoAudio)return pianoAudio;
  const audio=new AudioContext();
  const limiter=audio.createDynamicsCompressor();
  limiter.threshold.value=-5;
  limiter.knee.value=4;
  limiter.ratio.value=8;
  limiter.connect(audio.destination);
  pianoAudio={audio,limiter};
  return pianoAudio;
}

function wakePianoAudio() {
  if(navigator.userActivation?.isActive===false)return;
  try {
    const {audio}=pianoOutput();
    if(audio.state!=='running')audio.resume().catch(()=>{});
  } catch {}
}

function startPianoVoice(audio,note,destination,voices) {
  const fundamental=440*2**((note-69)/12);
  const start=audio.currentTime+.005;
  const bass=Math.max(0,Math.min(1,(390-fundamental)/260));
  // Keep low notes audible on small speakers by putting more of their energy in upper harmonics.
  const partials=[
    [1,.68-.40*bass,1.65,.17],
    [2,.23+.14*bass,.98,.12],
    [3,.11+.20*bass,.58,.085],
    [4,.052+.10*bass,.31,.035],
    [5,.018+.043*bass,.20,.018]
  ];
  // Normalize the first half-second against a modest small-speaker roll-off.
  const audibleLevel=Math.hypot(...partials.map(([harmonic,level,decay,sustain])=>{
    const frequency=fundamental*harmonic;
    const speakerWeight=.06+.94/Math.hypot(1,(250/frequency)**2);
    return level*speakerWeight*Math.sqrt(pianoAttackEnergy(decay,sustain));
  }));
  const noteGain=.047*(1-.20*bass)/audibleLevel;
  const {attack,settled,floor}=pianoEnvelope;
  const output=audio.createGain();
  output.connect(destination);
  const oscillators=new Set();
  let releasing=false;
  const voice={release(immediately=false){
    if(releasing&&!immediately)return;
    const now=audio.currentTime;
    const end=immediately?now+.02:Math.max(now,start+.06)+.145;
    if(!releasing){
      output.gain.setValueAtTime(1,immediately?now:Math.max(now,start+.06));
      output.gain.exponentialRampToValueAtTime(floor,end);
    }
    releasing=true;
    for(const oscillator of oscillators)oscillator.stop(end+.005);
  }};
  voices.add(voice);
  for(const [harmonic,level,decay,sustain] of partials){
    const volume=level*noteGain;
    const oscillator=audio.createOscillator();
    const envelope=audio.createGain();
    oscillator.frequency.setValueAtTime(fundamental*harmonic,start);
    envelope.gain.setValueAtTime(volume*floor,start);
    envelope.gain.exponentialRampToValueAtTime(volume,start+attack);
    envelope.gain.exponentialRampToValueAtTime(volume*settled,start+pianoDecayStart(decay));
    envelope.gain.exponentialRampToValueAtTime(volume*sustain,start+decay);
    oscillator.connect(envelope);
    envelope.connect(output);
    oscillators.add(oscillator);
    oscillator.onended=()=>{
      oscillator.disconnect();
      envelope.disconnect();
      oscillators.delete(oscillator);
      if(!oscillators.size){
        output.disconnect();
        voices.delete(voice);
      }
    };
    oscillator.start(start);
  }
  return voice;
}

function mountKeyboard(layer,note,{note:openingNote}={}) {
  let mounted=true;
  let inputEpoch=0;
  const listeners=new AbortController();
  const inputs=new Map();
  const heldNotes=new Map();
  const voices=new Set();
  const shortcutNotes=new Map(pianoShortcuts.map((key,i)=>[key,i+48]));
  const caption=el('div','','piano-help');
  const compactPiano=matchMedia('(max-width: 1024px)');
  const touchInput=navigator.maxTouchPoints>0||matchMedia('(hover:none)').matches;
  let instructions;
  const help=el('p','','station-help');
  const lastNote=el('output','','piano-note');
  lastNote.setAttribute('aria-label','Piano notes');
  lastNote.setAttribute('aria-live','off');
  caption.append(help,lastNote);
  note.append(caption);
  function updateShortcutLabels(){
    layer.classList.toggle('piano-hide-shortcuts',touchInput||compactPiano.matches);
    instructions=touchInput
      ? 'Touch and hold keys to play. Use more fingers for a chord.'
      : compactPiano.matches
        ? 'Click and hold a key on screen to play it.'
        : 'Use the shortcuts on the keys, or click and hold. Hold several shortcuts for a chord.';
    help.textContent=instructions;
  }
  updateShortcutLabels();
  compactPiano.addEventListener('change',updateShortcutLabels,{signal:listeners.signal});
  wakePianoAudio();

  const keys=[...pianoKeys].sort((a,b)=>a.note-b.note).map(key=>{
    const button=el('button','','projected-control piano-key'+(key.sharp?' piano-key--sharp':''));
    button.type='button';
    button.dataset.note=key.note;
    button.setAttribute('aria-label',noteName(key.note).replace('♯',' sharp '));
    const shortcut=pianoShortcuts[key.note-48].toUpperCase();
    button.setAttribute('aria-keyshortcuts',shortcut);
    const legend=el('kbd',shortcut,'piano-shortcut');
    legend.setAttribute('aria-hidden','true');
    button.append(legend);
    button.addEventListener('pointerdown',event=>{
      if(event.pointerType==='mouse'&&event.button!==0)return;
      button.setPointerCapture(event.pointerId);
      holdNote(key.note,'pointer/'+event.pointerId);
    });
    button.addEventListener('pointerup',event=>{
      wakePianoAudio();
      releaseInput('pointer/'+event.pointerId);
    });
    for(const type of ['pointercancel','lostpointercapture']){
      button.addEventListener(type,event=>releaseInput('pointer/'+event.pointerId));
    }
    // Screen-reader activation does not deliver pointer or keyboard events to the button.
    button.addEventListener('click',event=>{
      if(event.detail===0)tapNote(key.note);
    });
    button.addEventListener('pointerenter',event=>{
      if(event.pointerType==='mouse')setHint('hovered',key.note);
    });
    button.addEventListener('pointerleave',()=>clearHint('hovered',key.note));
    button.addEventListener('focus',()=>{
      if(button.matches(':focus-visible'))setHint('focused',key.note);
    });
    button.addEventListener('blur',()=>clearHint('focused',key.note));
    layer.append(button);
    return {...key,button};
  });

  function setHint(kind,midi){
    pianoLighting[kind]=midi;
    requestRoomFrame();
  }

  function clearHint(kind,midi){
    if(pianoLighting[kind]===midi)setHint(kind,null);
  }

  function updateNotes(last) {
    lastNote.textContent=heldNotes.size
      ? [...heldNotes.keys()].sort((a,b)=>a-b).map(noteName).join(' · ')
      : last===undefined?'':noteName(last);
    requestRoomFrame();
  }

  async function prepareVoice(midi,entry,epoch) {
    try{
      const {audio,limiter}=pianoOutput();
      if(audio.state!=='running')await audio.resume();
      if(!mounted||epoch!==inputEpoch)return;
      entry.voice=startPianoVoice(audio,midi,limiter,voices);
      if(!entry.count)entry.voice.release();
      help.textContent=instructions;
    }catch{
      if(mounted)help.textContent='Sound is unavailable. Try pressing a key again.';
    }
  }

  function holdNote(midi,input) {
    if(inputs.has(input))return;
    inputs.set(input,midi);
    const existing=heldNotes.get(midi);
    if(existing){existing.count++;return;}
    const entry={count:1,voice:null};
    heldNotes.set(midi,entry);
    pianoLighting.sounding.add(midi);
    updateNotes();
    prepareVoice(midi,entry,inputEpoch);
  }

  function releaseInput(input) {
    if(!inputs.has(input))return;
    const midi=inputs.get(input);
    inputs.delete(input);
    const entry=heldNotes.get(midi);
    if(--entry.count)return;
    entry.voice?.release();
    heldNotes.delete(midi);
    pianoLighting.sounding.delete(midi);
    updateNotes(midi);
  }

  function tapNote(midi){
    holdNote(midi,'tap');
    releaseInput('tap');
  }

  function clearHeldNotes() {
    inputEpoch++;
    inputs.clear();
    heldNotes.clear();
    pianoLighting.sounding.clear();
    for(const voice of voices)voice.release(true);
    updateNotes();
  }

  const options={signal:listeners.signal};
  document.addEventListener('keydown',event=>{
    if(event.isComposing||event.altKey||event.ctrlKey||event.metaKey
      ||event.target.closest?.('input,textarea,select,[contenteditable=true]'))return;
    const focusedKey=event.target.closest?.('.piano-key');
    const midi=focusedKey&&(event.key===' '||event.key==='Enter')
      ? Number(focusedKey.dataset.note)
      : shortcutNotes.get(event.key.toLowerCase());
    if(midi===undefined)return;
    event.preventDefault();
    if(!event.repeat)holdNote(midi,'keyboard/'+event.code);
  },options);
  document.addEventListener('keyup',event=>releaseInput('keyboard/'+event.code),options);
  window.addEventListener('blur',clearHeldNotes,options);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)clearHeldNotes();
  },options);

  gearPainter=()=>{
    for(const {button,corners} of keys){
      const points=corners.map(point=>screen(...point));
      const left=Math.min(...points.map(([x])=>x));
      const right=Math.max(...points.map(([x])=>x));
      const top=Math.min(...points.map(([,y])=>y));
      const bottom=Math.max(...points.map(([,y])=>y));
      button.style.left=left+'px';
      button.style.top=top+'px';
      button.style.width=(right-left)+'px';
      button.style.height=(bottom-top)+'px';
      button.style.clipPath='polygon('+points.map(([x,y])=>(x-left)+'px '+(y-top)+'px').join(',')+')';
    }
  };

  if(keys.some(({note})=>note===openingNote))tapNote(openingNote);

  return ()=>{
    mounted=false;
    listeners.abort();
    layer.classList.remove('piano-hide-shortcuts');
    clearHeldNotes();
    setHint('hovered',null);
    setHint('focused',null);
  };
}
