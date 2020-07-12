const noop = ()=>{};

function vSub([x1, y1], [x2, y2]) {
  return [x2 - x1, y2 - y1];
}

function dist(a, b) {
  const [dx, dy] = vSub(a, b);
  return Math.sqrt(dx*dx + dy*dy);
}

class LsysCanvas extends HTMLElement {
  get draw() {
    return (this._draw || noop);
  }
  set draw(v) {
    this._draw = v;
    this.emit('update');
  }

  currentTransform = {
    zoom: 1,
    translate: [0, 0],
    lastPoints: [],
  }

  allowedTransform = {
    zoom: true,
    zoomView: false,
    translate: [true, true],
  }

  mousePressed = false;

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }

  emit(n, v) {
    this.dispatchEvent(new CustomEvent(n, {detail: v}));
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style type="text/css">
        :host {
          display: block;
          position: relative;
          overflow: hidden;
        }
        canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      </style>
      <canvas class="gfx"></canvas>
      <canvas class="ui"></canvas>
      <div><slot /><div>
    `;

    const cvs = [...this.shadowRoot.querySelectorAll('canvas')];
    this.gfxCanvas = cvs[0];
    this.uiCanvas = cvs[1];
    const [gfx, ui] = cvs.map(c=>c.getContext('2d'));
    this.gfx = gfx;
    this.ui = ui;

    window.addEventListener('resize', ()=>this.updateSize(), {passive: true});

    this.uiCanvas.addEventListener('touchmove', (e)=>this.updateTransform([...e.touches].map(t=>[t.clientX, t.clientY])), {passive: true});
    this.uiCanvas.addEventListener('touchend', (e)=>this.updateTransform([]), {passive: true});
    this.uiCanvas.addEventListener('wheel', (e)=>this.updateTransform([], -e.deltaY), {passive: true});


    this.uiCanvas.addEventListener('mousedown', ()=>{
      this.mousePressed = true;
      this.updateTransform();
    }, {passive: true});
    this.uiCanvas.addEventListener('mouseup', ()=>{
      this.mousePressed = false;
      this.updateTransform();
    }, {passive: true});
    this.uiCanvas.addEventListener('mousemove', (e)=>{
      this.mousePressed?this.updateTransform([[e.clientX, e.clientY]]):'';

      this.updateCursor(e.clientX, e.clientY);
    }, {passive: true});
    this.uiCanvas.addEventListener('mouseout', (e)=>{
      this.mousePressed = false;
      this.updateTransform();
    }, {passive: true});

    this.addEventListener('update', ()=>{
      this.emit('updateGfx');
      this.emit('updateUi');
    });
    this.addEventListener('updateGfx', ()=>{
      this.renderGfx();
    });
    this.addEventListener('updateUi', ()=>{
      this.renderUi();
    });

    this.updateSize();
    window.requestAnimationFrame(()=>this.updateTransform());
  }

  updateCursor(clientX, clientY) {
    const rect = this.uiCanvas.getBoundingClientRect();

    let transform = this.ui.getTransform();
    const uiRelative = [
      (clientX - rect.left - transform.e) / transform.a,
      (clientY - rect.top - transform.f) / transform.d,
    ];

    transform = this.gfx.getTransform();
    const gfxRelative = [
      (clientX - rect.left - transform.e) / transform.a,
      (clientY - rect.top - transform.f) / transform.d,
    ];

    this.emit('cursor', {gfxRelative, uiRelative});
  }

  updateSize() {
    const [{height, width}] = this.getClientRects();
    this.gfxCanvas.width = width;
    this.gfxCanvas.height = height;
    this.uiCanvas.width = width;
    this.uiCanvas.height = height;

    this.emit('update');
  }

  updateTransform(e = [], zoom = 0) {
    const lastPoints = this.currentTransform.lastPoints;

    //console.log(e, zoom);
    this.currentTransform.zoom *= 1+Math.sign(zoom)/10;

    if(this.allowedTransform.zoomView){
      this.currentTransform.translate[0] *= 1+Math.sign(zoom)/10;
      this.currentTransform.translate[1] *= 1+Math.sign(zoom)/10;
    }

    if (lastPoints[0] && e[0]) {
      const t = vSub(lastPoints[0], e[0]);
      const zoom = this.allowedTransform.zoom ? this.currentTransform.zoom : 1;
      this.currentTransform.translate[0] += t[0] / zoom;
      this.currentTransform.translate[1] += t[1] / zoom;
    }
    if (lastPoints[0] && e[0] && lastPoints[1] && e[1]) {
      const oldD = dist(...lastPoints);
      const newD = dist(...e);
      const zoom = newD / oldD;

      this.currentTransform.zoom *= zoom;
    }

    this.currentTransform.lastPoints = e;

    this.emit('update');
  }


  renderGfx() {
    if (!this.gfx) return;

    const zoom = this.currentTransform.zoom;
    const translate = this.currentTransform.translate;
    const zoomAllowed = this.allowedTransform.zoom;
    const translateAllowed = this.allowedTransform.translate;

    this.gfx.resetTransform();
    this.gfx.clearRect(0, 0, this.gfxCanvas.width, this.gfxCanvas.height);
    this.gfx.translate(this.gfxCanvas.width / 2, this.gfxCanvas.height / 2);
    if (zoomAllowed) this.gfx.scale(zoom, zoom);
    this.gfx.translate(translateAllowed[0]?translate[0]:0, translateAllowed[1]?translate[1]:0);
    this.draw();
  }
  renderUi() {
    if (!this.ui) return;
    this.ui.resetTransform();
    this.ui.clearRect(0, 0, this.gfxCanvas.width, this.gfxCanvas.height);
    this.draw();
  }
}

customElements.define('lsys-canvas', LsysCanvas);
