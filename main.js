import data from './data.js';
import * as convert from './convert.js';

const baseWidth = 100;

const lcv = document.querySelector('lsys-canvas');
const info = document.querySelector('#info');
const ctx = lcv.gfx;
lcv.allowedTransform.zoom = false;
lcv.allowedTransform.zoomView = [true, false];

lcv.currentTransform.translate = [-lcv.gfxCanvas.width/3,-lcv.gfxCanvas.height/4];
ctx.font = '16px ubuntu'

lcv.draw = ()=>draw();


function calcUpperBound(f) {
  return Math.ceil(Math.log10(f));
}

function intersection(a,b) {
  const match = a[0] < b[1] && a[1] > b[0] ? 1 : 0;
  if (match && (a[2] === b[2])) return -1;
  return match;
}

function drawBox(x1, y1, x2, y2, color = '#fff', alpha = 1) {
  const a = ctx.globalAlpha;
  ctx.beginPath();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.rect(x1, y1, x2 - x1, y2 - y1);
  ctx.fill();
  ctx.globalAlpha = a;
  ctx.closePath();
}
function drawLine(x1, y1, x2, y2, color = '#fff', alpha = 1) {
  const a = ctx.globalAlpha;
  ctx.beginPath();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.globalAlpha = a;
  ctx.closePath();
}

function getPosX(f) {
  const p = Math.log10(f);
  return p*baseWidth*lcv.currentTransform.zoom;
}

function getFX(x) {
  const p = x/baseWidth/lcv.currentTransform.zoom
  return 10**p;
}

lcv.addEventListener('cursor', ({detail: {gfxRelative}})=>{
  const f = [getFX(gfxRelative[0]-10), getFX(gfxRelative[0]+10)];
  const matches = data.filter(d=>
    d.f[0] < f[1] && d.f[1] > f[0]
  );
  info.textContent = matches.map(d=>`${d.f.map(f=>convert.SI(f, 0, 3) + 'Hz').join(' - ')}: ${d.label} ${d.description||''}`).join('\n')
});

function draw() {
  const highestData = data[data.length-1];
  const highest = calcUpperBound(highestData.f[1] ? highestData.f[1]: highestData.f);

  const usedLayers = [];
  function findRow(layer, range) {
    if (!usedLayers[layer]) usedLayers[layer] = [];
    const occupiedRows = usedLayers[layer];

    const isOccupiedRows = occupiedRows.map(l=>l.reduce((p,c)=>p || intersection(c, range), false));
    const collapsedRow = isOccupiedRows.indexOf(-1);
    let row = isOccupiedRows.indexOf(0);
    const collapsed = collapsedRow !== -1 && row === -1;
    if (collapsed) row = collapsedRow;
    if (!occupiedRows[row]) row = occupiedRows.push([range]) - 1;
    else occupiedRows[row].push(range);

    //const collapsed = false;

    return [row, collapsed];
  }

  function calculatePosition(entry) {
    const {f, layer, label = ''} = entry;

    const startX = getPosX(f[0]);
    const endX = getPosX(f[1]);
    const range = endX - startX;
    const measure = ctx.measureText(label);
    const textWidth = measure.width;

    const textX = range > textWidth+10 ? startX + 5 : endX - textWidth - 5;
    const [row, collapsed] = findRow(layer, [Math.min(textX, startX), Math.max(textX, endX), label]);

    return {
      data: entry,
      layer,
      row,
      collapsed,
      textX,
      startX,
      endX,
    }
  }

  function draw({data: {label = '', color = '#fff'}, layer, row, collapsed = false, textX, startX, endX}) {
    const rowAdd = usedLayers.slice(0, layer).reduce((p, c)=>p+c.length, 2);
    row += rowAdd;
    //console.log(row, rowAdd);

    const padding = 4;

    const measure = ctx.measureText(label);
    const textHeight = measure.actualBoundingBoxAscent + padding;
    const lineHeight = parseFloat(ctx.font) + padding;

    const layerStartY = 0;
    const layerMidY = layerStartY + row * lineHeight;
    const layerTextY = layerMidY + textHeight - padding / 2;
    const layerEndY = layerMidY + textHeight + padding / 2;

    drawLine(startX, layerStartY, startX, layerEndY, color, collapsed?0.2:1);
    if (endX > startX) {
      drawBox(startX, layerMidY, endX, layerEndY, color, 0.2);
      drawLine(endX, layerMidY, endX, layerEndY, color);
    }

    if(!collapsed) {
      ctx.fillStyle = color;
      ctx.fillText(label, textX, layerTextY);
    }
  }

  function drawAxis() {
    drawLine(-100000, 0, 1000000, 0, '#aaddff');
    for (let i = 0; i<=highest; i++) {
      const f = 10**i;

      const startX = getPosX(f);
      drawLine(startX, -5, startX, 5);
      ctx.fillStyle = '#fff';
      const label = convert.SI(10**i, 0) + 'Hz';
      const measure = ctx.measureText(label)
      ctx.fillText(label, startX - measure.width , 17);

      const v = [2, 3, 4, 5, 6, 7, 8, 9];
      v.forEach(v=>drawLine(getPosX(v*f), -5, getPosX(v*f), 5));
    }
  }

  drawAxis();
  data
    .map((p, i)=>calculatePosition(p))
    .sort((a,b)=>b.layer===a.layer?b.row-a.row:b.layer-a.layer)
    .forEach((p, i)=>draw(p));
};
