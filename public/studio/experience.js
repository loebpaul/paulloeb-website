const tray = document.querySelector('.drawer');
const body = tray.querySelector('.drawer-content');
const closeButton = tray.querySelector('.close');
let previousFocus;
let selectedChannel = 0;
let currentPanel = null;
let disposePanel = null;

function el(tag,text='',className='') {
  const node=document.createElement(tag);
  if(text)node.textContent=text;
  if(className)node.className=className;
  return node;
}
function a(label,link,style='') {
  const node=el('a',label,style);node.href=link;node.target='_blank';node.rel='noopener noreferrer';return node;
}
function photo(file,alt='',style='') {
  const image=el('img','',style);
  image.src='assets/'+file;image.alt=alt;
  return image;
}
function title(label,heading,note='') {
  const head=el('div','','panel-title');
  head.append(el('p',label,'kicker'),el('h2',heading));
  if(note)head.append(el('p',note,'panel-note'));
  return head;
}

function mark(role) {
  return photo(role.logo || role.id+'.jpg','','brand-image brand-image--'+role.id);
}
function beatsProducts() {
  const figures=[
    ['Beats Pill','beats-pill.jpg'],
    ['Beats Studio headphones','beats-studio.jpg']
  ];
  const exhibit=el('section','','beats-exhibit');
  const menu=el('div','','product-picker');
  const view=el('div','','product-view');
  const buttons=figures.map(([name],index)=>{
    const button=el('button',name);
    button.type='button';
    button.addEventListener('click',()=>select(index));
    menu.append(button);
    return button;
  });
  function select(index) {
    for(const [i,button] of buttons.entries())button.setAttribute('aria-pressed',String(i===index));
    const [name,image]=figures[index];
    view.replaceChildren(photo(image,name,index===0?'pill-photo':''));
  }
  exhibit.append(menu,view);
  select(0);
  return exhibit;
}
function selectCareer(index,keys,detail) {
  selectedChannel=index;
  keys.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
  const role=roles[index];
  detail.replaceChildren();
  const name=el('div','','role-header');
  name.append(mark(role),el('div'));
  name.lastChild.append(el('small',role.when),el('h3',role.name));
  detail.append(name,el('p',role.note));
  if(role.products)detail.append(beatsProducts());
  if(role.link)detail.append(a('View '+role.name+' ↗',role.link,'text-link'));
}
function showCareer() {
  body.append(title('Mixing desk','Career','Select an organization to see my role.'));
  const rack=el('div','','career-stops');
  const detail=el('article','','role-detail');
  detail.setAttribute('aria-live','polite');
  const buttons=roles.map((role,index)=>{
    const b=el('button','','career-stop');b.type='button';
    const names=el('span','','career-label');
    names.append(el('strong',role.name),el('small',role.when));
    b.append(mark(role),names);
    b.addEventListener('click',()=>selectCareer(index,buttons,detail));
    rack.append(b);
    return b;
  });
  body.append(detail,rack,a('Full experience on LinkedIn ↗',urls.linkedin,'text-link'));
  selectCareer(selectedChannel,buttons,detail);
}

function musicTile(img,alt,name,note,href,act) {
  const item=el('article','','music-tile');
  const words=el('div');
  words.append(el('h3',name),el('p',note),a(act+' ↗',href,'text-link'));
  item.append(photo(img,alt),words);
  return item;
}
function showCollection() {
  body.append(title('Record shelf','Music'));
  const releases=[
    musicTile('dreams.webp','Dreams cover art','Velvet Circuits','Shelley Marie on vocals, me on production. Our first release is a house cover of Fleetwood Mac’s “Dreams.”',urls.dreams,'Listen to Dreams'),
    musicTile('cats.jpg','Really Cute Cats artist artwork','Really Cute Cats','Cute cats and dope beats.',urls.cats,'Open SoundCloud'),
    musicTile('paul-soundcloud.jpg','Paul Loeb’s SoundCloud profile artwork','Paul Loeb','Older music on SoundCloud.',urls.olderMusic,'Open SoundCloud'),
    musicTile('ego.jpg','No Ego Records logo','No Ego Records',noEgoDescription,urls.ego,'Visit No Ego Records')
  ];
  const duetSection=el('section','','duets');
  duetSection.setAttribute('aria-labelledby','duets-heading');
  const heading=el('div','','duet-heading');
  const duetTitle=el('h3','Duets with my dad');
  duetTitle.id='duets-heading';
  heading.append(duetTitle,a('Full playlist ↗',urls.duets));
  const grid=el('div','','media-grid');
  for(const [song,artist,id,img] of duets){
    const card=a('',`https://www.youtube.com/watch?v=${id}&list=PLVP9gqGdj2ds`,'media-card');
    card.append(photo(img,''),el('strong',song),el('span',artist+' cover ↗'));
    grid.append(card);
  }
  duetSection.append(heading,grid);
  body.append(...releases,duetSection);
}
function showInterviews() {
  body.append(title('Microphone','Interviews'));
  const grid=el('div','','media-grid press');
  for(const item of interviews){
    const card=a('',item.link,'media-card');
    card.append(photo(item.photo,''),el('strong',item.name),el('span',item.title+' ↗'));
    grid.append(card);
  }
  body.append(grid);
}
function showBoris() {
  body.append(
    title('Studio cat','Boris','My cat is big in Japan.'),
    photo('boris.webp','Paul holding Boris','boris-photo'),
    a('@russian_boris on Instagram ↗',urls.boris,'text-link')
  );
}

function eclipseViewer() {
  const section=el('section','','eclipse');
  section.append(el('h3','Chasing eclipses'));
  const scene=el('div','','eclipse-scene');
  scene.setAttribute('aria-hidden','true');
  scene.append(el('div','','sun'),el('div','','moon'));
  section.append(scene);
  const field=el('input');field.type='range';field.min='-55';field.max='55';field.value='-16';
  field.setAttribute('aria-label','Move the moon across the sun');
  field.addEventListener('input',()=>scene.style.setProperty('--offset',field.value+'px'));
  const label=el('label','Move the moon across the sun');
  label.append(field);section.append(label);
  const list=el('ol','','eclipse-trips');
  for(const place of eclipses)list.append(el('li',place));
  section.append(el('p','Four trips to witness a solar eclipse.'),list);
  return section;
}
function showTravel() {
  body.append(title('Travel wall','Places I’ve been'));
  const map=el('div','','travel-map');
  const canvas=el('canvas');
  canvas.setAttribute('aria-hidden','true');
  map.append(canvas);
  const mapBar=el('div','','travel-status-bar');
  const status=el('p','Choose a place to zoom in.','travel-status');
  status.setAttribute('aria-live','polite');
  const reset=el('button','Full map','map-reset');
  reset.type='button';
  mapBar.append(status,reset);
  const list=el('div','','passports');
  const destinations=[...countries].sort(([a],[b])=>a.localeCompare(b,'en'));
  const buttons=destinations.map(([name])=>{
    const b=el('button',name);
    b.type='button';
    b.setAttribute('aria-pressed','false');
    b.addEventListener('click',()=>{
      buttons.forEach(n=>n.setAttribute('aria-pressed',String(n===b)));
      map.dataset.place=name;
      status.textContent=name;
      drawTrip(canvas,name,true);
    });
    list.append(b);
    return b;
  });
  reset.addEventListener('click',()=>{
    map.dataset.place='';
    buttons.forEach(n=>n.setAttribute('aria-pressed','false'));
    status.textContent='Choose a place to zoom in.';
    drawTrip(canvas);
  });
  body.append(map,mapBar,list,eclipseViewer());
  const observer=new ResizeObserver(()=>drawTrip(canvas,map.dataset.place,true));
  observer.observe(map);
  return ()=>observer.disconnect();
}

const panels={desk:showCareer,collection:showCollection,interviews:showInterviews,travel:showTravel,boris:showBoris};
const stations={rack:mountPatchBay,music:mountTurntable,keys:mountKeyboard};
const liveGear=document.querySelector('.live-gear');
const gearNote=document.querySelector('.gear-note');
const returnToStudio=document.querySelector('.studio-return');
let currentStation=null;
let releaseStation=null;
let stationFocus=null;

function openPanel(key,trigger) {
  if(!panels[key])return;
  if(key===currentPanel){closePanel();return;}
  closeStation(false);
  const fallback=document.querySelector('.room-guide [data-open="'+key+'"]');
  previousFocus=trigger && trigger!==canvas && !tray.contains(trigger) ? trigger : fallback;
  disposePanel?.();
  tray.hidden=false;
  stage.dataset.focus=key;
  document.body.classList.add('has-drawer');
  body.replaceChildren();
  currentPanel=key;
  disposePanel=panels[key]() ?? null;
  closeButton.focus({preventScroll:true});
  tray.scrollTop=0;
  setFocus(key);
}
function closePanel(restoreFocus=true,resetCamera=true) {
  if(tray.hidden)return;
  disposePanel?.();
  disposePanel=null;
  currentPanel=null;
  tray.hidden=true;
  delete stage.dataset.focus;
  document.body.classList.remove('has-drawer');
  if(resetCamera)setFocus(null);
  if(restoreFocus)previousFocus?.focus({preventScroll:true});
}
function openStation(key,trigger,detail) {
  if(currentStation===key)return;
  closePanel(false);
  closeStation(false);
  currentStation=key;
  stationFocus=trigger!==canvas ? trigger : document.querySelector('.room-guide [data-open="'+key+'"]');
  stage.dataset.station=key;
  stage.dataset.focus=key;
  liveGear.hidden=false;
  gearNote.hidden=false;
  returnToStudio.hidden=false;
  setFocus(key);
  releaseStation=stations[key](liveGear,gearNote,detail);
  returnToStudio.focus({preventScroll:true});
}
function closeStation(restoreFocus=true,resetCamera=true) {
  if(!currentStation)return;
  releaseStation?.();
  releaseStation=null;
  currentStation=null;
  delete stage.dataset.station;
  delete stage.dataset.focus;
  liveGear.replaceChildren();
  gearNote.replaceChildren();
  liveGear.hidden=true;
  gearNote.hidden=true;
  returnToStudio.hidden=true;
  gearPainter=null;
  if(resetCamera)setFocus(null);
  if(restoreFocus)stationFocus?.focus({preventScroll:true});
}
function openGear(key,trigger,detail) {
  if(stations[key])openStation(key,trigger,detail);
  else openPanel(key,trigger);
}
document.addEventListener('click',event=>{
  const trigger=event.target.closest('button[data-open]');
  if(trigger){openGear(trigger.dataset.open,trigger);return;}
  if(!tray.hidden && event.target.closest('.home') && !event.target.closest('.stage,button,a'))closePanel();
});
stage.addEventListener('studio-pick',event=>{
  const {key}=event.detail;
  if(currentStation){
    if(!key){closeStation();return;}
    if(key===currentStation)return;
  }
  if(key)openGear(key,canvas,event.detail);
  else if(currentPanel)closePanel();
  else setFocus(null);
});
stage.addEventListener('studio-zoom',event=>{
  const key=event.detail.key;
  if(key)openGear(key,canvas);
  else if(currentStation)closeStation(false,false);
  else closePanel(false,false);
});
closeButton.addEventListener('click',()=>closePanel());
returnToStudio.addEventListener('click',()=>closeStation());
document.addEventListener('keydown',event=>{
  if(event.key!=='Escape')return;
  if(currentStation)closeStation();
  else if(currentPanel)closePanel();
  else setFocus(null);
});
