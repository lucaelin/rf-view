import data from './data.js';
import {setDraw, setFont, canvas, ctx, events as canvasEvents} from './canvas.js';
import * as convert from './convert.js';

const drawWidth = 6000;
const drawHeight = 1000;

setDraw(draw);
setFont('ubuntu', 12, 8, 20);

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
    return p*500;
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

  function draw({f, layer, label = '', color = '#fff'}) {
    const y = 0;
    const x1 = getPosX(f[0]);
    const x2 = getPosX(f[1]);
    const range = x2 - x1;
    const textWidth = ctx.measureText(label).width;
    const textHeight = ctx.measureText(label).actualBoundingBoxAscent;
    const lineHeight = parseFloat(ctx.font);

    const textX = range > textWidth+10 ? x1 + 5 : x2 - textWidth - 5;
    const row = findRow(layer, [textX, x2]);
    const startY = y - 5;
    const midY = y + 5 + layer * lineHeight * 10 + row * lineHeight;
    const endY = midY + textHeight;

    drawLine(x1, startY, x1, endY, color);
    if (range > 0) {
      drawBox(x1, midY, x2, endY, color);
      drawLine(x2, midY, x2, endY, color);
    }
    ctx.fillStyle = color;

    ctx.fillText(label, textX, endY);
  }

  function drawAxis() {

    drawLine(0, 0, drawWidth, 0, '#aaddff');

    for (let i = 0; i<=highest; i++) {
      const f = 10**i
      drawLine(-100000, 0, 1000000, 0, '#aaddff');
      draw({f: [f, f], layer: 0, label: convert.SI(10**i, 0) + 'Hz'});

      const v = [2, 3, 4, 5, 6, 7, 8, 9];
      v.forEach(v=>draw({f: [v*f, v*f], layer: 0}));
    }
  }

  drawAxis();
  data.forEach((p, i)=>draw(p));
};
