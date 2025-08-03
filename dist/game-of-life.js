var y = Object.defineProperty;
var T = (e, t, i) => t in e ? y(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var r = (e, t, i) => T(e, typeof t != "symbol" ? t + "" : t, i);
function G(e, t) {
  return Math.max(0, Math.round(Math.random() - 0.3));
}
function v(e, t = e, i = G) {
  const s = [];
  for (let h = 0; h < e; h++) {
    s[h] = [];
    for (let n = 0; n < t; n++)
      s[h][n] = i(h, n);
  }
  return s;
}
const M = (e, t) => e === 1 && t > 3, k = (e, t) => e === 1 && t < 2, A = (e, t) => e === 0 && t === 3, L = (e, t) => [A, M, k].map((i) => i(e, t)).includes(!0);
function I(e, t, i, s) {
  return e.slice(Math.max(0, t[0]), t[0] + i).map((h) => h.slice(Math.max(0, t[1]), t[1] + s));
}
function S(e, t) {
  return typeof t == "number" ? e + t : t.reduce(S, e);
}
function E(e, t, i) {
  const s = e[t][i];
  return I(e, [t - 1, i - 1], 3, 3).reduce(S, 0 - s);
}
function p(e) {
  return (t, i) => {
    const s = e[t][i], h = E(e, t, i);
    return L(s, h) ? +!s : s;
  };
}
function U(e) {
  var t;
  return v(e.length, ((t = e[0]) == null ? void 0 : t.length) || 0, p(e));
}
function* w(e = {}) {
  const { width: t = 10, height: i = 10 } = e;
  let s = v(i, t);
  for (yield s; ; )
    s = v(i, t, p(s)), yield s;
}
const D = 1e3 / 12, O = 3, x = "rgba(0, 20, 0, 1)", C = "rgba(0, 20, 0, 0.3)", R = "rgba(0, 200, 0, 1)";
let o;
class P {
  constructor({ data: t }) {
    r(this, "canvas");
    r(this, "minInterval");
    r(this, "cellSize");
    r(this, "color1");
    r(this, "color1Tick");
    r(this, "color2");
    r(this, "ctx");
    r(this, "lastDraw");
    r(this, "gen");
    r(this, "isPaused");
    r(this, "hueRotate");
    r(this, "interactive");
    r(this, "currentGrid");
    this.canvas = t.canvas, this.ctx = this.canvas.getContext("2d"), this.minInterval = t.minInterval ?? D, this.cellSize = t.cellSize ?? O, this.color1 = t.color1 ?? x, this.color1Tick = t.color1Tick ?? C, this.color2 = t.color2 ?? R, this.lastDraw = 0, this.isPaused = !0, this.hueRotate = !!t.hueRotate, this.interactive = !!t.interactive, this.fillCanvas(this.color1), this.gen = w({ width: this.width, height: this.height }), this.currentGrid = this.gen.next().value, this.draw(), this.isPaused = !!t.paused, this.draw();
  }
  get width() {
    return Math.floor(this.canvas.width / this.cellSize);
  }
  set width(t) {
    this.canvas.width !== t && (this.canvas.width = t, this.gen = w({ width: this.width, height: this.height }), this.draw());
  }
  get height() {
    return Math.floor(this.canvas.height / this.cellSize);
  }
  set height(t) {
    this.canvas.height !== t && (this.canvas.height = t, this.gen = w({ width: this.width, height: this.height }), this.draw());
  }
  set paused(t) {
    this.isPaused = t, t || this.draw();
  }
  fillCanvas(t) {
    this.ctx && (this.ctx.fillStyle = t, this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height));
  }
  fillCell(t, i, s, h, n) {
    this.ctx && (this.ctx.fillStyle = n, this.ctx.fillRect(t, i, s, h));
  }
  draw(t = 0) {
    if (t === 0 || t - this.lastDraw > this.minInterval) {
      this.hueRotate && (this.color2 = `hsla(${180 + Math.sin(this.lastDraw / 5e4) * 360}, 100%, 50%, 0.8)`), this.lastDraw = t, this.fillCanvas(this.color1Tick), t !== 0 && (this.interactive ? this.currentGrid = U(this.currentGrid) : this.currentGrid = this.gen.next().value);
      for (let i = 0; i < this.currentGrid.length; i++) {
        const s = this.currentGrid[i];
        for (let h = 0; h < s.length; h++)
          s[h] && this.fillCell(h * this.cellSize, i * this.cellSize, this.cellSize, this.cellSize, this.color2);
      }
    }
    this.isPaused || requestAnimationFrame((i) => {
      this.draw(i);
    });
  }
  toggleCell(t, i) {
    t >= 0 && t < this.width && i >= 0 && i < this.height && (this.currentGrid[i][t] = this.currentGrid[i][t] === 1 ? 0 : 1, this.redraw());
  }
  redraw() {
    this.fillCanvas(this.color1Tick);
    for (let t = 0; t < this.currentGrid.length; t++) {
      const i = this.currentGrid[t];
      for (let s = 0; s < i.length; s++)
        i[s] && this.fillCell(s * this.cellSize, t * this.cellSize, this.cellSize, this.cellSize, this.color2);
    }
  }
}
self.onmessage = (e) => {
  e.data.canvas ? o = new P(e) : (o && e.data.action === "toggleCell" && typeof e.data.x == "number" && typeof e.data.y == "number" && o.toggleCell(e.data.x, e.data.y), o && e.data.paused !== void 0 && (o.paused = e.data.paused), o && typeof e.data.width == "number" && (o.width = e.data.width), o && typeof e.data.height == "number" && (o.height = e.data.height));
};
const z = 'var _=Object.defineProperty;var R=(c,r,o)=>r in c?_(c,r,{enumerable:!0,configurable:!0,writable:!0,value:o}):c[r]=o;var l=(c,r,o)=>R(c,typeof r!="symbol"?r+"":r,o);(function(){"use strict";function c(i,t){return Math.max(0,Math.round(Math.random()-.3))}function r(i,t=i,e=c){const s=[];for(let h=0;h<i;h++){s[h]=[];for(let a=0;a<t;a++)s[h][a]=e(h,a)}return s}const o=(i,t)=>i===1&&t>3,g=(i,t)=>i===1&&t<2,w=(i,t)=>i===0&&t===3,m=(i,t)=>[w,o,g].map(e=>e(i,t)).includes(!0);function C(i,t,e,s){return i.slice(Math.max(0,t[0]),t[0]+e).map(h=>h.slice(Math.max(0,t[1]),t[1]+s))}function d(i,t){return typeof t=="number"?i+t:t.reduce(d,i)}function v(i,t,e){const s=i[t][e];return C(i,[t-1,e-1],3,3).reduce(d,0-s)}function f(i){return(t,e)=>{const s=i[t][e],h=v(i,t,e);return m(s,h)?+!s:s}}function G(i){var t;return r(i.length,((t=i[0])==null?void 0:t.length)||0,f(i))}function*u(i={}){const{width:t=10,height:e=10}=i;let s=r(e,t);for(yield s;;)s=r(e,t,f(s)),yield s}const S=1e3/12,p=3,x="rgba(0, 20, 0, 1)",b="rgba(0, 20, 0, 0.3)",z="rgba(0, 200, 0, 1)";let n;class T{constructor({data:t}){l(this,"canvas");l(this,"minInterval");l(this,"cellSize");l(this,"color1");l(this,"color1Tick");l(this,"color2");l(this,"ctx");l(this,"lastDraw");l(this,"gen");l(this,"isPaused");l(this,"hueRotate");l(this,"interactive");l(this,"currentGrid");this.canvas=t.canvas,this.ctx=this.canvas.getContext("2d"),this.minInterval=t.minInterval??S,this.cellSize=t.cellSize??p,this.color1=t.color1??x,this.color1Tick=t.color1Tick??b,this.color2=t.color2??z,this.lastDraw=0,this.isPaused=!0,this.hueRotate=!!t.hueRotate,this.interactive=!!t.interactive,this.fillCanvas(this.color1),this.gen=u({width:this.width,height:this.height}),this.currentGrid=this.gen.next().value,this.draw(),this.isPaused=!!t.paused,this.draw()}get width(){return Math.floor(this.canvas.width/this.cellSize)}set width(t){this.canvas.width!==t&&(this.canvas.width=t,this.gen=u({width:this.width,height:this.height}),this.draw())}get height(){return Math.floor(this.canvas.height/this.cellSize)}set height(t){this.canvas.height!==t&&(this.canvas.height=t,this.gen=u({width:this.width,height:this.height}),this.draw())}set paused(t){this.isPaused=t,t||this.draw()}fillCanvas(t){this.ctx&&(this.ctx.fillStyle=t,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height))}fillCell(t,e,s,h,a){this.ctx&&(this.ctx.fillStyle=a,this.ctx.fillRect(t,e,s,h))}draw(t=0){if(t===0||t-this.lastDraw>this.minInterval){this.hueRotate&&(this.color2=`hsla(${180+Math.sin(this.lastDraw/5e4)*360}, 100%, 50%, 0.8)`),this.lastDraw=t,this.fillCanvas(this.color1Tick),t!==0&&(this.interactive?this.currentGrid=G(this.currentGrid):this.currentGrid=this.gen.next().value);for(let e=0;e<this.currentGrid.length;e++){const s=this.currentGrid[e];for(let h=0;h<s.length;h++)s[h]&&this.fillCell(h*this.cellSize,e*this.cellSize,this.cellSize,this.cellSize,this.color2)}}this.isPaused||requestAnimationFrame(e=>{this.draw(e)})}toggleCell(t,e){t>=0&&t<this.width&&e>=0&&e<this.height&&(this.currentGrid[e][t]=this.currentGrid[e][t]===1?0:1,this.redraw())}redraw(){this.fillCanvas(this.color1Tick);for(let t=0;t<this.currentGrid.length;t++){const e=this.currentGrid[t];for(let s=0;s<e.length;s++)e[s]&&this.fillCell(s*this.cellSize,t*this.cellSize,this.cellSize,this.cellSize,this.color2)}}}self.onmessage=i=>{i.data.canvas?n=new T(i):(n&&i.data.action==="toggleCell"&&typeof i.data.x=="number"&&typeof i.data.y=="number"&&n.toggleCell(i.data.x,i.data.y),n&&i.data.paused!==void 0&&(n.paused=i.data.paused),n&&typeof i.data.width=="number"&&(n.width=i.data.width),n&&typeof i.data.height=="number"&&(n.height=i.data.height))}})();\n', b = typeof self < "u" && self.Blob && new Blob([z], { type: "text/javascript;charset=utf-8" });
function B(e) {
  let t;
  try {
    if (t = b && (self.URL || self.webkitURL).createObjectURL(b), !t) throw "";
    const i = new Worker(t, {
      name: e == null ? void 0 : e.name
    });
    return i.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), i;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(z),
      {
        name: e == null ? void 0 : e.name
      }
    );
  } finally {
    t && (self.URL || self.webkitURL).revokeObjectURL(t);
  }
}
const l = class l extends HTMLElement {
  useAnimation() {
    return "matchMedia" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  get cellSize() {
    return Number.parseInt(this.getAttribute(l.attr.cellSize) ?? "1", 10);
  }
  get width() {
    return this.getAttribute(l.attr.width) || void 0;
  }
  get height() {
    return this.getAttribute(l.attr.height) || void 0;
  }
  get color1() {
    return this.getAttribute(l.attr.color1) || x;
  }
  get color1Tick() {
    return this.getAttribute(l.attr.color1Tick) || C;
  }
  get color2() {
    return this.getAttribute(l.attr.color2) || R;
  }
  get hueRotate() {
    return !!this.getAttribute(l.attr.hueRotate);
  }
  get fps() {
    return this.useAnimation() ? 1e3 / Math.max(1, Number.parseInt(this.getAttribute(l.attr.fps) ?? "12", 10)) : 2e3;
  }
  get shouldShowControls() {
    return !!this.getAttribute(l.attr.controls);
  }
  get interactive() {
    return !!this.getAttribute(l.attr.interactive);
  }
  connectedCallback() {
    var d, u, g, f;
    const t = this.attachShadow({ mode: "open" }), i = new CSSStyleSheet();
    i.replaceSync(l.css), t.adoptedStyleSheets = [i];
    const s = document.createElement("canvas"), h = ((d = t.host) == null ? void 0 : d.clientWidth) === 0 ? 300 : (u = t.host) == null ? void 0 : u.clientWidth, n = ((g = t.host) == null ? void 0 : g.clientHeight) === 0 ? 150 : (f = t.host) == null ? void 0 : f.clientHeight;
    s.setAttribute("width", this.width ? String(this.width) : String(h)), s.setAttribute("height", this.height ? String(this.height) : String(n)), t.appendChild(s);
    const a = s.transferControlToOffscreen(), c = new B();
    c.postMessage({
      canvas: a,
      cellSize: this.cellSize,
      color1: this.color1,
      color1Tick: this.color1Tick,
      color2: this.color2,
      hueRotate: this.hueRotate,
      minInterval: this.fps,
      interactive: this.interactive
    }, [a]), this.interactive && this.setupInteractiveEvents(s, c);
  }
  setupInteractiveEvents(t, i) {
    let s = !1;
    const h = (a) => {
      const c = t.getBoundingClientRect(), d = t.width / c.width, u = t.height / c.height, g = Math.floor((a.clientX - c.left) * d / this.cellSize), f = Math.floor((a.clientY - c.top) * u / this.cellSize);
      return { x: g, y: f };
    }, n = (a) => {
      const { x: c, y: d } = h(a);
      i.postMessage({ action: "toggleCell", x: c, y: d });
    };
    t.addEventListener("mousedown", (a) => {
      a.preventDefault(), s = !0, n(a);
    }), t.addEventListener("mousemove", (a) => {
      s && n(a);
    }), t.addEventListener("mouseup", () => {
      s = !1;
    }), t.addEventListener("mouseleave", () => {
      s = !1;
    });
  }
};
r(l, "tagName", "game-of-life"), r(l, "attr", {
  width: "width",
  height: "height",
  color1: "color1",
  color1Tick: "color1Tick",
  color2: "color2",
  cellSize: "cellSize",
  fps: "fps",
  style: "style",
  controls: "controls",
  hueRotate: "hueRotate",
  interactive: "interactive"
}), r(l, "css", `
        :host {
            display: block;
        }
        canvas {
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
        }
    `);
let m = l;
customElements.define("game-of-life", m);
export {
  m as GameOfLife
};
