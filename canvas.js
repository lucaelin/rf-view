export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');
export const events = new EventTarget();

const currentTransform = {
  zoom: 0.5,
  translate: [0, 0],
}
const currentFont = {
  min: 0,
  max: Infinity,
  std: 12,
  face: 'ubuntu',
}

let drawCall = ()=>{};

export function setDraw(fn) {
  drawCall = fn;
  draw();
}
export function setFont(face, std = 12, min = 12, max = 12) {
  currentFont.face = face;
  currentFont.std = std;
  currentFont.min = min;
  currentFont.max = max;
  draw();
}

function draw() {
  ctx.save();
  ctx.resetTransform();
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ctx.translate(canvas.width/2, canvas.height/2);
  ctx.scale(currentTransform.zoom, currentTransform.zoom);
  ctx.translate(...currentTransform.translate);
  const fontSize = Math.max(currentFont.min, Math.min(currentFont.max, currentFont.std / currentTransform.zoom));
  ctx.font = fontSize + 'px ' + currentFont.face;
  drawCall();
  ctx.restore();
}

(function init() {
  window.addEventListener('resize', reset, {passive: true});
  canvas.addEventListener('touchmove', (e)=>transform([...e.touches].map(t=>[t.clientX, t.clientY])), {passive: true});
  canvas.addEventListener('touchend', (e)=>transform([]), {passive: true});
  canvas.addEventListener('wheel', (e)=>transform([], e.deltaY), {passive: true});

  let mousePressed = false;
  canvas.addEventListener('mousedown', ()=>{
    mousePressed = true;
    transform();
  }, {passive: true});
  canvas.addEventListener('mouseup', ()=>{
    mousePressed = false;
    transform();
  }, {passive: true});
  canvas.addEventListener('mousemove', (e)=>{
    mousePressed?transform([[e.clientX, e.clientY]]):'';
    const localCoord = canvasRelative([e.clientX, e.clientY]);
    events.dispatchEvent(new CustomEvent('cursor', {detail: {x: localCoord[0], y: localCoord[1]}}))
  }, {passive: true});
  canvas.addEventListener('mouseout', (e)=>{
    mousePressed = false;
    transform();
  }, {passive: true});

  reset();
})();

let lastPoints = [];
function transform(e = [], zoom = 0) {
  //console.log(e, zoom);
  currentTransform.zoom *= 1+Math.sign(zoom)/30;

  if (lastPoints[0] && e[0]) {
    const t = vSub(lastPoints[0], e[0]);
    currentTransform.translate[0] += t[0] / currentTransform.zoom;
    currentTransform.translate[1] += t[1] / currentTransform.zoom;
  }
  if (lastPoints[0] && e[0] && lastPoints[1] && e[1]) {
    const oldD = dist(...lastPoints);
    const newD = dist(...e);
    const zoom = newD / oldD;

    currentTransform.zoom *= zoom;
  }

  lastPoints = e;
  draw();
}

function vSub([x1, y1], [x2, y2]) {
  return [x2 - x1, y2 - y1];
}

function dist(a, b) {
  const [dx, dy] = vSub(a, b);
  return Math.sqrt(dx*dx + dy*dy);
}

function reset() {
  const [{height, width}] = canvas.getClientRects();
  canvas.width = width;
  canvas.height = height;

  draw();
}
function clearCanvas() {
  ctx.save();
  ctx.resetTransform();
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ctx.restore();
}

function canvasRelative(e) {
  const rect = canvas.getBoundingClientRect();
  const transform = ctx.getTransform();
  return [
    (e[0] - rect.left - transform.e) / transform.a,
    (e[1] - rect.top - transform.f) / transform.d,
  ];
}
