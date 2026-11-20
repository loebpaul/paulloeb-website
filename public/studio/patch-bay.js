const leads=[
  {name:'green',route:'launch'},
  {name:'blue',route:null}
];
const rackNames={launch:'LaunchDarkly',github:'GitHub',ego:'No Ego Records'};
let lastLead=0;

function placeControl(control,x,y,w=44,h=w) {
  control.style.width=w+'px';
  control.style.height=h+'px';
  control.style.left=x+'px';
  control.style.top=y+'px';
}

function mountPatchBay(layer,note) {
  let held=null;
  let drag=null;
  let ignoreClickUntil=0;
  const help=el('p','','station-help');
  const readout=el('div','','station-story');
  readout.setAttribute('role','status');
  note.append(help,readout);

  const sockets=new Map(Object.entries(rackJacks).map(([key,anchor])=>{
    const control=el('button','','projected-control rack-socket');
    control.type='button';
    control.dataset.port=key;
    layer.append(control);
    return [key,{control,anchor}];
  }));
  const plugs=leads.map((lead,i)=>{
    const control=el('button','','projected-control rack-plug');
    control.type='button';
    control.dataset.cord=String(i);
    layer.append(control);
    return control;
  });

  function layOut(){
    for(const {control,anchor} of sockets.values())placeControl(control,...screen(...anchor).slice(0,2));
    for(const [i,control] of plugs.entries()){
      const at=drag?.index===i&&drag.moved ? drag.point : screen(...rackEnd(i));
      placeControl(control,at[0],at[1],38);
    }
  }
  gearPainter=layOut;

  function update(){
    for(const [key,{control}] of sockets){
      const on=leads.find(row=>row.route===key);
      control.setAttribute('aria-label',rackNames[key]+' socket'+(on?', '+on.name+' cable connected':''));
      control.title=rackNames[key];
    }
    for(const [i,control] of plugs.entries()){
      const lead=leads[i];
      const label=(i===0?'Green':'Blue')+' cable, '+(lead.route?'connected to '+rackNames[lead.route]:'unplugged');
      control.setAttribute('aria-label',label);
      control.setAttribute('aria-pressed',String(held===i));
      control.title=label;
    }
    setRackWires(leads.map(row=>row.route),lastLead);
    const entry=patch[leads[lastLead].route];
    if(entry){
      readout.replaceChildren(el('strong',entry.title),el('p',entry.note),a(entry.label+' ↗',entry.link));
    }else{
      readout.replaceChildren(el('strong','Cable unplugged'));
    }
    help.textContent=held===null?'Drag a plug into a socket. You can also tap a plug, then a socket.':'Choose a socket to connect the cable.';
  }

  function route(index,key){
    if(key){
      const occupant=leads.findIndex(row=>row.route===key);
      if(occupant>=0&&occupant!==index)leads[occupant].route=null;
    }
    leads[index].route=key;
    lastLead=index;
    held=null;
    moveCable(null);
    update();
  }
  function pickUp(index){
    leads[index].route=null;
    lastLead=index;
    held=index;
    moveCable(null);
    update();
  }

  for(const [key,{control}] of sockets){
    control.addEventListener('click',()=>{
      const connected=leads.findIndex(row=>row.route===key);
      if(held!==null){route(held,key);return;}
      if(connected!==-1){lastLead=connected;update();return;}
      const free=leads.findIndex(row=>!row.route);
      route(free>=0?free:lastLead,key);
    });
  }
  for(const [index,control] of plugs.entries()){
    control.addEventListener('pointerdown',event=>{
      if(event.button!==0)return;
      drag={index,id:event.pointerId,x:event.clientX,y:event.clientY,moved:false};
      control.setPointerCapture(event.pointerId);
    });
    control.addEventListener('click',()=>{
      if(performance.now()>ignoreClickUntil)pickUp(index);
    });
  }
  const events=new AbortController();
  const listen={signal:events.signal};
  layer.addEventListener('pointermove',event=>{
    if(!drag || drag.id!==event.pointerId)return;
    if(!drag.moved && Math.hypot(event.clientX-drag.x,event.clientY-drag.y)<6)return;
    drag.moved=true;
    const bounds=stage.getBoundingClientRect();
    drag.point=[event.clientX-bounds.left,event.clientY-bounds.top];
    moveCable(drag);
  },listen);
  layer.addEventListener('pointerup',event=>{
    if(!drag || drag.id!==event.pointerId)return;
    const previous=drag;
    drag=null;
    if(!previous.moved)return;
    ignoreClickUntil=performance.now()+240;
    const nearest=[...sockets].find(([,item])=>{
      const r=item.control.getBoundingClientRect();
      return Math.hypot(event.clientX-r.x-r.width/2,event.clientY-r.y-r.height/2)<27;
    });
    route(previous.index,nearest?.[0]||null);
  },listen);
  function cancel(){
    if(!drag)return;
    drag=null;
    moveCable(null);
  }
  layer.addEventListener('pointercancel',cancel,listen);
  layer.addEventListener('lostpointercapture',cancel,listen);
  update();
  return ()=>{
    events.abort();
    drag=null;
    moveCable(null);
  };
}
