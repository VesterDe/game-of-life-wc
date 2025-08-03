var R = Object.defineProperty;
var G = (e, t, i) => t in e ? R(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var r = (e, t, i) => G(e, typeof t != "symbol" ? t + "" : t, i);
function M(e, t) {
  return Math.max(0, Math.round(Math.random() - 0.3));
}
function v(e, t = e, i = M) {
  const s = [];
  for (let h = 0; h < e; h++) {
    s[h] = [];
    for (let n = 0; n < t; n++)
      s[h][n] = i(h, n);
  }
  return s;
}
const T = (e, t) => e === 1 && t > 3, D = (e, t) => e === 1 && t < 2, k = (e, t) => e === 0 && t === 3, A = (e, t) => [k, T, D].map((i) => i(e, t)).includes(!0);
function L(e, t, i, s) {
  return e.slice(Math.max(0, t[0]), t[0] + i).map((h) => h.slice(Math.max(0, t[1]), t[1] + s));
}
function b(e, t) {
  return typeof t == "number" ? e + t : t.reduce(b, e);
}
function I(e, t, i) {
  const s = e[t][i];
  return L(e, [t - 1, i - 1], 3, 3).reduce(b, 0 - s);
}
function S(e) {
  return (t, i) => {
    const s = e[t][i], h = I(e, t, i);
    return A(s, h) ? +!s : s;
  };
}
function E(e) {
  var t;
  return v(e.length, ((t = e[0]) == null ? void 0 : t.length) || 0, S(e));
}
function* w(e = {}) {
  const { width: t = 10, height: i = 10 } = e;
  let s = v(i, t);
  for (yield s; ; )
    s = v(i, t, S(s)), yield s;
}
const U = 1e3 / 12, O = 3, C = "rgba(0, 20, 0, 1)", x = "rgba(0, 20, 0, 0.3)", y = "rgba(0, 200, 0, 1)";
let l;
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
    this.canvas = t.canvas, this.ctx = this.canvas.getContext("2d"), this.minInterval = t.minInterval ?? U, this.cellSize = t.cellSize ?? O, this.color1 = t.color1 ?? C, this.color1Tick = t.color1Tick ?? x, this.color2 = t.color2 ?? y, this.lastDraw = 0, this.isPaused = !0, this.hueRotate = !!t.hueRotate, this.interactive = !!t.interactive, this.fillCanvas(this.color1), this.gen = w({ width: this.width, height: this.height }), this.currentGrid = this.gen.next().value, this.draw(), this.isPaused = !!t.paused, this.draw();
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
      this.hueRotate && (this.color2 = `hsla(${180 + Math.sin(this.lastDraw / 5e4) * 360}, 100%, 50%, 0.8)`), this.lastDraw = t, this.fillCanvas(this.color1Tick), t !== 0 && (this.interactive ? this.currentGrid = E(this.currentGrid) : this.currentGrid = this.gen.next().value);
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
  activateCell(t, i) {
    t >= 0 && t < this.width && i >= 0 && i < this.height && (this.currentGrid[i][t] = 1, this.redraw());
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
  e.data.canvas ? l = new P(e) : (l && e.data.action === "toggleCell" && typeof e.data.x == "number" && typeof e.data.y == "number" && l.toggleCell(e.data.x, e.data.y), l && e.data.action === "activateCell" && typeof e.data.x == "number" && typeof e.data.y == "number" && l.activateCell(e.data.x, e.data.y), l && e.data.action === "pauseDrag" && (l.paused = !0), l && e.data.action === "resumeDrag" && (l.paused = !1), l && e.data.paused !== void 0 && (l.paused = e.data.paused), l && typeof e.data.width == "number" && (l.width = e.data.width), l && typeof e.data.height == "number" && (l.height = e.data.height));
};
const z = 'var _=Object.defineProperty;var D=(c,r,o)=>r in c?_(c,r,{enumerable:!0,configurable:!0,writable:!0,value:o}):c[r]=o;var a=(c,r,o)=>D(c,typeof r!="symbol"?r+"":r,o);(function(){"use strict";function c(i,t){return Math.max(0,Math.round(Math.random()-.3))}function r(i,t=i,e=c){const s=[];for(let h=0;h<i;h++){s[h]=[];for(let n=0;n<t;n++)s[h][n]=e(h,n)}return s}const o=(i,t)=>i===1&&t>3,g=(i,t)=>i===1&&t<2,w=(i,t)=>i===0&&t===3,m=(i,t)=>[w,o,g].map(e=>e(i,t)).includes(!0);function C(i,t,e,s){return i.slice(Math.max(0,t[0]),t[0]+e).map(h=>h.slice(Math.max(0,t[1]),t[1]+s))}function d(i,t){return typeof t=="number"?i+t:t.reduce(d,i)}function p(i,t,e){const s=i[t][e];return C(i,[t-1,e-1],3,3).reduce(d,0-s)}function f(i){return(t,e)=>{const s=i[t][e],h=p(i,t,e);return m(s,h)?+!s:s}}function G(i){var t;return r(i.length,((t=i[0])==null?void 0:t.length)||0,f(i))}function*u(i={}){const{width:t=10,height:e=10}=i;let s=r(e,t);for(yield s;;)s=r(e,t,f(s)),yield s}const S=1e3/12,b=3,x="rgba(0, 20, 0, 1)",v="rgba(0, 20, 0, 0.3)",z="rgba(0, 200, 0, 1)";let l;class T{constructor({data:t}){a(this,"canvas");a(this,"minInterval");a(this,"cellSize");a(this,"color1");a(this,"color1Tick");a(this,"color2");a(this,"ctx");a(this,"lastDraw");a(this,"gen");a(this,"isPaused");a(this,"hueRotate");a(this,"interactive");a(this,"currentGrid");this.canvas=t.canvas,this.ctx=this.canvas.getContext("2d"),this.minInterval=t.minInterval??S,this.cellSize=t.cellSize??b,this.color1=t.color1??x,this.color1Tick=t.color1Tick??v,this.color2=t.color2??z,this.lastDraw=0,this.isPaused=!0,this.hueRotate=!!t.hueRotate,this.interactive=!!t.interactive,this.fillCanvas(this.color1),this.gen=u({width:this.width,height:this.height}),this.currentGrid=this.gen.next().value,this.draw(),this.isPaused=!!t.paused,this.draw()}get width(){return Math.floor(this.canvas.width/this.cellSize)}set width(t){this.canvas.width!==t&&(this.canvas.width=t,this.gen=u({width:this.width,height:this.height}),this.draw())}get height(){return Math.floor(this.canvas.height/this.cellSize)}set height(t){this.canvas.height!==t&&(this.canvas.height=t,this.gen=u({width:this.width,height:this.height}),this.draw())}set paused(t){this.isPaused=t,t||this.draw()}fillCanvas(t){this.ctx&&(this.ctx.fillStyle=t,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height))}fillCell(t,e,s,h,n){this.ctx&&(this.ctx.fillStyle=n,this.ctx.fillRect(t,e,s,h))}draw(t=0){if(t===0||t-this.lastDraw>this.minInterval){this.hueRotate&&(this.color2=`hsla(${180+Math.sin(this.lastDraw/5e4)*360}, 100%, 50%, 0.8)`),this.lastDraw=t,this.fillCanvas(this.color1Tick),t!==0&&(this.interactive?this.currentGrid=G(this.currentGrid):this.currentGrid=this.gen.next().value);for(let e=0;e<this.currentGrid.length;e++){const s=this.currentGrid[e];for(let h=0;h<s.length;h++)s[h]&&this.fillCell(h*this.cellSize,e*this.cellSize,this.cellSize,this.cellSize,this.color2)}}this.isPaused||requestAnimationFrame(e=>{this.draw(e)})}toggleCell(t,e){t>=0&&t<this.width&&e>=0&&e<this.height&&(this.currentGrid[e][t]=this.currentGrid[e][t]===1?0:1,this.redraw())}activateCell(t,e){t>=0&&t<this.width&&e>=0&&e<this.height&&(this.currentGrid[e][t]=1,this.redraw())}redraw(){this.fillCanvas(this.color1Tick);for(let t=0;t<this.currentGrid.length;t++){const e=this.currentGrid[t];for(let s=0;s<e.length;s++)e[s]&&this.fillCell(s*this.cellSize,t*this.cellSize,this.cellSize,this.cellSize,this.color2)}}}self.onmessage=i=>{i.data.canvas?l=new T(i):(l&&i.data.action==="toggleCell"&&typeof i.data.x=="number"&&typeof i.data.y=="number"&&l.toggleCell(i.data.x,i.data.y),l&&i.data.action==="activateCell"&&typeof i.data.x=="number"&&typeof i.data.y=="number"&&l.activateCell(i.data.x,i.data.y),l&&i.data.action==="pauseDrag"&&(l.paused=!0),l&&i.data.action==="resumeDrag"&&(l.paused=!1),l&&i.data.paused!==void 0&&(l.paused=i.data.paused),l&&typeof i.data.width=="number"&&(l.width=i.data.width),l&&typeof i.data.height=="number"&&(l.height=i.data.height))}})();\n', p = typeof self < "u" && self.Blob && new Blob([z], { type: "text/javascript;charset=utf-8" });
function B(e) {
  let t;
  try {
    if (t = p && (self.URL || self.webkitURL).createObjectURL(p), !t) throw "";
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
const a = class a extends HTMLElement {
  useAnimation() {
    return "matchMedia" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  get cellSize() {
    return Number.parseInt(this.getAttribute(a.attr.cellSize) ?? "1", 10);
  }
  get width() {
    return this.getAttribute(a.attr.width) || void 0;
  }
  get height() {
    return this.getAttribute(a.attr.height) || void 0;
  }
  get color1() {
    return this.getAttribute(a.attr.color1) || C;
  }
  get color1Tick() {
    return this.getAttribute(a.attr.color1Tick) || x;
  }
  get color2() {
    return this.getAttribute(a.attr.color2) || y;
  }
  get hueRotate() {
    return !!this.getAttribute(a.attr.hueRotate);
  }
  get fps() {
    return this.useAnimation() ? 1e3 / Math.max(1, Number.parseInt(this.getAttribute(a.attr.fps) ?? "12", 10)) : 2e3;
  }
  get shouldShowControls() {
    return !!this.getAttribute(a.attr.controls);
  }
  get interactive() {
    return !!this.getAttribute(a.attr.interactive);
  }
  connectedCallback() {
    var d, u, g, f;
    const t = this.attachShadow({ mode: "open" }), i = new CSSStyleSheet();
    i.replaceSync(a.css), t.adoptedStyleSheets = [i];
    const s = document.createElement("canvas"), h = ((d = t.host) == null ? void 0 : d.clientWidth) === 0 ? 300 : (u = t.host) == null ? void 0 : u.clientWidth, n = ((g = t.host) == null ? void 0 : g.clientHeight) === 0 ? 150 : (f = t.host) == null ? void 0 : f.clientHeight;
    s.setAttribute("width", this.width ? String(this.width) : String(h)), s.setAttribute("height", this.height ? String(this.height) : String(n)), t.appendChild(s);
    const c = s.transferControlToOffscreen(), o = new B();
    o.postMessage({
      canvas: c,
      cellSize: this.cellSize,
      color1: this.color1,
      color1Tick: this.color1Tick,
      color2: this.color2,
      hueRotate: this.hueRotate,
      minInterval: this.fps,
      interactive: this.interactive
    }, [c]), this.interactive && this.setupInteractiveEvents(s, o);
  }
  setupInteractiveEvents(t, i) {
    let s = !1;
    const h = (c) => {
      const o = t.getBoundingClientRect(), d = t.width / o.width, u = t.height / o.height, g = Math.floor((c.clientX - o.left) * d / this.cellSize), f = Math.floor((c.clientY - o.top) * u / this.cellSize);
      return { x: g, y: f };
    }, n = (c) => {
      const { x: o, y: d } = h(c);
      i.postMessage({ action: "activateCell", x: o, y: d });
    };
    t.addEventListener("mousedown", (c) => {
      c.preventDefault(), s = !0, i.postMessage({ action: "pauseDrag" }), n(c);
    }), t.addEventListener("mousemove", (c) => {
      s && n(c);
    }), t.addEventListener("mouseup", () => {
      s = !1, i.postMessage({ action: "resumeDrag" });
    }), t.addEventListener("mouseleave", () => {
      s = !1, i.postMessage({ action: "resumeDrag" });
    });
  }
};
r(a, "tagName", "game-of-life"), r(a, "attr", {
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
}), r(a, "css", `
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
let m = a;
customElements.define("game-of-life", m);
export {
  m as GameOfLife
};
