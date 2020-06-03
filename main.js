import data from './data.js';
//import {setDraw, setFont, canvas, ctx, events as canvasEvents} from './canvas.js';
import * as convert from './convert.js';

const drawWidth = 6000;
const drawHeight = 1000;

const lcv = document.querySelector('lsys-canvas');
lcv.addEventListener('cursor', ()=>{});
const ctx = lcv.gfx;
lcv.allowedTransform.zoom = false;
lcv.draw = ()=>draw();


function calcUpperBound(f) {
  return Math.ceil(Math.log10(f));
}

function intersection(a,b) {
  return a[0] < b[1] && a[1] > b[0];
}

function drawBox(x1, y1, x2, y2, color = '#fff') {
  const a = ctx.globalAlpha;
  ctx.beginPath();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = color;
  ctx.rect(x1, y1, x2 - x1, y2 - y1);
  ctx.fill();
  ctx.globalAlpha = a;
  ctx.closePath();
}
function drawLine(x1, y1, x2, y2, color = '#fff') {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}

function draw() {
  const lowest = 0;
  const highestData = data[data.length-1];
  const highest = calcUpperBound(highestData.f[1] ? highestData.f[1]: highestData.f);

  function getPosX(f) {
    const p = Math.log10(f);
    return p*200*lcv.currentTransform.zoom;
  }

  const usedLayers = [];
  function findRow(layer, range) {
    if (!usedLayers[layer]) usedLayers[layer] = [];
    const occupiedRows = usedLayers[layer];

    const isOccupiedRows = occupiedRows.map(l=>l.reduce((p,c)=>p || intersection(c, range), false));
    let row = isOccupiedRows.indexOf(false);
    if (!occupiedRows[row]) row = occupiedRows.push([range]) - 1;
    else occupiedRows[row].push(range);

    return row;
  }

  function calculatePosition(entry) {
    const {f, layer, label = ''} = entry;

    const startX = getPosX(f[0]);
    const endX = getPosX(f[1]);
    const range = endX - startX;
    const measure = ctx.measureText(label);
    const textWidth = measure.width;

    const textX = range > textWidth+10 ? startX + 5 : endX - textWidth - 5;
    const row = findRow(layer, [Math.min(textX, startX), Math.max(textX, endX)]);

    return {
      data: entry,
      layer,
      row,
      textX,
      startX,
      endX,
    }
  }

  function draw({data: {label = '', color = '#fff'}, layer, row, textX, startX, endX}) {
    const rowAdd = usedLayers.slice(0, layer).reduce((p, c)=>p+c.length, 1);
    row += rowAdd;
    //console.log(row, rowAdd);

    const measure = ctx.measureText(label);
    const textHeight = measure.actualBoundingBoxAscent;
    const lineHeight = parseFloat(ctx.font);

    const layerStartY = 0;
    const layerMidY = layerStartY + row * lineHeight;
    const layerTextY = layerMidY + textHeight - 0;
    const layerEndY = layerMidY + textHeight + 0;

    drawLine(startX, layerStartY, startX, layerEndY, color);
    if (endX > startX) {
      drawBox(startX, layerMidY, endX, layerEndY, color);
      drawLine(endX, layerMidY, endX, layerEndY, color);
    }

    ctx.fillStyle = color;
    ctx.fillText(label, textX, layerTextY);
  }

  function drawAxis() {

    drawLine(0, 0, drawWidth, 0, '#aaddff');

    for (let i = 0; i<=highest; i++) {
      const f = 10**i
      drawLine(-100000, 0, 1000000, 0, '#aaddff');

          const startX = getPosX(f);
      drawLine(getPosX(f), -5, getPosX(f), 5);
      // convert.SI(10**i, 0) + 'Hz'

      const v = [2, 3, 4, 5, 6, 7, 8, 9];
      v.forEach(v=>drawLine(getPosX(v*f), -5, getPosX(v*f), 5));
    }
  }

  drawAxis();
  data
    .map((p, i)=>calculatePosition(p))
    .forEach((p, i)=>draw(p));
};
