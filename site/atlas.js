// Natural Earth geometries from World Atlas, in unprojected decimal degrees.
const decodedArcs = worldAtlas.arcs.map(arc => {
  let x = 0;
  let y = 0;
  const {scale,translate} = worldAtlas.transform;
  return arc.map(([dx,dy]) => {
    x += dx;
    y += dy;
    return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
  });
});

function worldRing(ids) {
  return ids.flatMap((id,index) => {
    const arc = id >= 0 ? decodedArcs[id] : decodedArcs[~id].slice().reverse();
    return index === 0 ? arc : arc.slice(1);
  });
}

function unwrapRing(ring, origin) {
  let previous = origin;
  return ring.map(([lon,lat]) => {
    const adjacent = lon + Math.round((previous - lon) / 360) * 360;
    previous = adjacent;
    return [adjacent,lat];
  });
}

const outlines = worldAtlas.objects.countries.geometries.map(geometry => {
  const id = Number(geometry.id);
  const polygons = (geometry.type === 'Polygon' ? [geometry.arcs] : geometry.arcs).map(polygon => {
    const rings = polygon.map(worldRing);
    // Antarctica closes along the pole, so its world-spanning edge is intentional.
    const placed = id === 10 ? rings : rings.map(ring => unwrapRing(ring,rings[0][0][0]));
    const longitudes = placed[0].map(([lon])=>lon);
    return {rings:placed,west:Math.min(...longitudes),east:Math.max(...longitudes)};
  });
  return {id,polygons};
});

function drawTrip(canvas, selectedName, focus = false) {
  const box = canvas.parentElement;
  const w = box.clientWidth;
  const h = box.clientHeight;
  if (!w || !h) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const destination = countries.find(([name]) => name === selectedName);
  const projectedScale = Math.min(w / 360, h / 144);
  const zoom = destination && focus ? 4.1 : 1;
  const origin = destination && focus ? destination.slice(1,3) : [0, 9];
  const halfSpan = w / (2 * projectedScale * zoom);
  const xy = ([lon,lat]) => [
    w / 2 + (lon - origin[0]) * projectedScale * zoom,
    h / 2 - (lat - origin[1]) * projectedScale * zoom
  ];

  ctx.fillStyle='#20393e';
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#839b9060';
  ctx.lineWidth=.55;
  for(let lon=-180;lon<=180;lon+=30){
    const [x]=xy([lon,0]);
    ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();
  }
  for(let lat=-45;lat<=75;lat+=15){
    const [,y]=xy([0,lat]);
    ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();
  }
  const shownId = destination?.[3];
  for(const land of outlines){
    ctx.fillStyle = land.id && land.id === shownId ? '#a7bc9f' : '#607f72';
    ctx.strokeStyle='#9db7a778';
    ctx.lineWidth=.45;
    for(const {rings,west,east} of land.polygons){
      const first=Math.ceil((origin[0]-halfSpan-east)/360);
      const last=Math.floor((origin[0]+halfSpan-west)/360);
      for(let turn=first;turn<=last;turn++){
        ctx.beginPath();
        for(const ring of rings){
          ring.forEach(([lon,lat],i)=>{
            const [x,y]=xy([lon+turn*360,lat]);
            if(i)ctx.lineTo(x,y);
            else ctx.moveTo(x,y);
          });
          ctx.closePath();
        }
        ctx.fill('evenodd');
        ctx.stroke();
      }
    }
  }
  for(const place of countries.filter(entry=>entry!==destination)) {
    const [x,y] = xy(place.slice(1,3));
    ctx.beginPath();ctx.arc(x,y,2.45,0,Math.PI*2);
    ctx.fillStyle = place[0] === 'Black Rock City' ? '#a8c9ea' : '#dcefd4';
    ctx.fill();
  }
  if(destination){
    const [x,y]=xy(destination.slice(1,3));
    ctx.beginPath();ctx.arc(x,y,5.3,0,Math.PI*2);ctx.fillStyle='#d8f7da';ctx.fill();
    ctx.lineWidth=1.1;ctx.strokeStyle='#14352f';ctx.stroke();
    ctx.beginPath();ctx.arc(x,y,8.2,0,Math.PI*2);ctx.strokeStyle='#e6f8e5';ctx.stroke();
  }
}
