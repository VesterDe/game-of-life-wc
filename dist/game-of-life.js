var b = Object.defineProperty;
var S = (e, t, i) => t in e ? b(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var a = (e, t, i) => S(e, typeof t != "symbol" ? t + "" : t, i);
function p(e, t) {
  return Math.max(0, Math.round(Math.random() - 0.3));
}
function u(e, t = e, i = p) {
  const s = [];
  for (let h = 0; h < e; h++) {
    s[h] = [];
    for (let l = 0; l < t; l++)
      s[h][l] = i(h, l);
  }
  return s;
}
const R = (e, t) => e === 1 && t > 3, x = (e, t) => e === 1 && t < 2, C = (e, t) => e === 0 && t === 3, y = (e, t) => [C, R, x].map((i) => i(e, t)).includes(!0);
function T(e, t, i, s) {
  return e.slice(Math.max(0, t[0]), t[0] + i).map((h) => h.slice(Math.max(0, t[1]), t[1] + s));
}
function g(e, t) {
  return typeof t == "number" ? e + t : t.reduce(g, e);
}
function k(e, t, i) {
  const s = e[t][i];
  return T(e, [t - 1, i - 1], 3, 3).reduce(g, 0 - s);
}
function z(e) {
  return (t, i) => {
    const s = e[t][i], h = k(e, t, i);
    return y(s, h) ? +!s : s;
  };
}
function* o(e = {}) {
  const { width: t = 10, height: i = 10 } = e;
  let s = u(i, t);
  for (yield s; ; )
    s = u(i, t, z(s)), yield s;
}
const M = 1e3 / 12, A = 3, f = "rgba(0, 20, 0, 1)", w = "rgba(0, 20, 0, 0.3)", m = "rgba(0, 200, 0, 1)";
let n;
class L {
  constructor({ data: t }) {
    a(this, "canvas");
    a(this, "minInterval");
    a(this, "cellSize");
    a(this, "color1");
    a(this, "color1Tick");
    a(this, "color2");
    a(this, "ctx");
    a(this, "lastDraw");
    a(this, "gen");
    a(this, "isPaused");
    a(this, "hueRotate");
    this.canvas = t.canvas, this.ctx = this.canvas.getContext("2d"), this.minInterval = t.minInterval ?? M, this.cellSize = t.cellSize ?? A, this.color1 = t.color1 ?? f, this.color1Tick = t.color1Tick ?? w, this.color2 = t.color2 ?? m, this.lastDraw = 0, this.isPaused = !0, this.hueRotate = !!t.hueRotate, this.fillCanvas(this.color1), this.gen = o({ width: this.width, height: this.height }), this.draw(), this.isPaused = !!t.paused, this.draw();
  }
  get width() {
    return Math.floor(this.canvas.width / this.cellSize);
  }
  set width(t) {
    this.canvas.width !== t && (this.canvas.width = t, this.gen = o({ width: this.width, height: this.height }), this.draw());
  }
  get height() {
    return Math.floor(this.canvas.height / this.cellSize);
  }
  set height(t) {
    this.canvas.height !== t && (this.canvas.height = t, this.gen = o({ width: this.width, height: this.height }), this.draw());
  }
  set paused(t) {
    this.isPaused = t, t || this.draw();
  }
  fillCanvas(t) {
    this.ctx && (this.ctx.fillStyle = t, this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height));
  }
  fillCell(t, i, s, h, l) {
    this.ctx && (this.ctx.fillStyle = l, this.ctx.fillRect(t, i, s, h));
  }
  draw(t = 0) {
    if (t === 0 || t - this.lastDraw > this.minInterval) {
      this.hueRotate && (this.color2 = `hsla(${180 + Math.sin(this.lastDraw / 5e4) * 360}, 100%, 50%, 0.8)`), this.lastDraw = t, this.fillCanvas(this.color1Tick);
      const i = this.gen.next().value;
      for (let s = 0; s < i.length; s++) {
        const h = i[s];
        for (let l = 0; l < h.length; l++)
          h[l] && this.fillCell(l * this.cellSize, s * this.cellSize, this.cellSize, this.cellSize, this.color2);
      }
    }
    this.isPaused || requestAnimationFrame((i) => {
      this.draw(i);
    });
  }
}
self.onmessage = (e) => {
  e.data.canvas ? n = new L(e) : (n && e.data.paused !== void 0 && (n.paused = e.data.paused), n && typeof e.data.width == "number" && (n.width = e.data.width), n && typeof e.data.height == "number" && (n.height = e.data.height));
};
const v = 'var R=Object.defineProperty;var D=(o,a,c)=>a in o?R(o,a,{enumerable:!0,configurable:!0,writable:!0,value:c}):o[a]=c;var n=(o,a,c)=>D(o,typeof a!="symbol"?a+"":a,c);(function(){"use strict";function o(i,t){return Math.max(0,Math.round(Math.random()-.3))}function a(i,t=i,s=o){const e=[];for(let h=0;h<i;h++){e[h]=[];for(let l=0;l<t;l++)e[h][l]=s(h,l)}return e}const c=(i,t)=>i===1&&t>3,f=(i,t)=>i===1&&t<2,g=(i,t)=>i===0&&t===3,w=(i,t)=>[g,c,f].map(s=>s(i,t)).includes(!0);function m(i,t,s,e){return i.slice(Math.max(0,t[0]),t[0]+s).map(h=>h.slice(Math.max(0,t[1]),t[1]+e))}function d(i,t){return typeof t=="number"?i+t:t.reduce(d,i)}function v(i,t,s){const e=i[t][s];return m(i,[t-1,s-1],3,3).reduce(d,0-e)}function x(i){return(t,s)=>{const e=i[t][s],h=v(i,t,s);return w(e,h)?+!e:e}}function*u(i={}){const{width:t=10,height:s=10}=i;let e=a(s,t);for(yield e;;)e=a(s,t,x(e)),yield e}const C=1e3/12,p=3,S="rgba(0, 20, 0, 1)",_="rgba(0, 20, 0, 0.3)",b="rgba(0, 200, 0, 1)";let r;class T{constructor({data:t}){n(this,"canvas");n(this,"minInterval");n(this,"cellSize");n(this,"color1");n(this,"color1Tick");n(this,"color2");n(this,"ctx");n(this,"lastDraw");n(this,"gen");n(this,"isPaused");n(this,"hueRotate");this.canvas=t.canvas,this.ctx=this.canvas.getContext("2d"),this.minInterval=t.minInterval??C,this.cellSize=t.cellSize??p,this.color1=t.color1??S,this.color1Tick=t.color1Tick??_,this.color2=t.color2??b,this.lastDraw=0,this.isPaused=!0,this.hueRotate=!!t.hueRotate,this.fillCanvas(this.color1),this.gen=u({width:this.width,height:this.height}),this.draw(),this.isPaused=!!t.paused,this.draw()}get width(){return Math.floor(this.canvas.width/this.cellSize)}set width(t){this.canvas.width!==t&&(this.canvas.width=t,this.gen=u({width:this.width,height:this.height}),this.draw())}get height(){return Math.floor(this.canvas.height/this.cellSize)}set height(t){this.canvas.height!==t&&(this.canvas.height=t,this.gen=u({width:this.width,height:this.height}),this.draw())}set paused(t){this.isPaused=t,t||this.draw()}fillCanvas(t){this.ctx&&(this.ctx.fillStyle=t,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height))}fillCell(t,s,e,h,l){this.ctx&&(this.ctx.fillStyle=l,this.ctx.fillRect(t,s,e,h))}draw(t=0){if(t===0||t-this.lastDraw>this.minInterval){this.hueRotate&&(this.color2=`hsla(${180+Math.sin(this.lastDraw/5e4)*360}, 100%, 50%, 0.8)`),this.lastDraw=t,this.fillCanvas(this.color1Tick);const s=this.gen.next().value;for(let e=0;e<s.length;e++){const h=s[e];for(let l=0;l<h.length;l++)h[l]&&this.fillCell(l*this.cellSize,e*this.cellSize,this.cellSize,this.cellSize,this.color2)}}this.isPaused||requestAnimationFrame(s=>{this.draw(s)})}}self.onmessage=i=>{i.data.canvas?r=new T(i):(r&&i.data.paused!==void 0&&(r.paused=i.data.paused),r&&typeof i.data.width=="number"&&(r.width=i.data.width),r&&typeof i.data.height=="number"&&(r.height=i.data.height))}})();\n', d = typeof self < "u" && self.Blob && new Blob([v], { type: "text/javascript;charset=utf-8" });
function U(e) {
  let t;
  try {
    if (t = d && (self.URL || self.webkitURL).createObjectURL(d), !t) throw "";
    const i = new Worker(t, {
      name: e == null ? void 0 : e.name
    });
    return i.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), i;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(v),
      {
        name: e == null ? void 0 : e.name
      }
    );
  } finally {
    t && (self.URL || self.webkitURL).revokeObjectURL(t);
  }
}
const r = class r extends HTMLElement {
  useAnimation() {
    return "matchMedia" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  get cellSize() {
    return Number.parseInt(this.getAttribute(r.attr.cellSize) ?? "1", 10);
  }
  get width() {
    return this.getAttribute(r.attr.width) || void 0;
  }
  get height() {
    return this.getAttribute(r.attr.height) || void 0;
  }
  get color1() {
    return this.getAttribute(r.attr.color1) || f;
  }
  get color1Tick() {
    return this.getAttribute(r.attr.color1Tick) || w;
  }
  get color2() {
    return this.getAttribute(r.attr.color2) || m;
  }
  get hueRotate() {
    return !!this.getAttribute(r.attr.hueRotate);
  }
  get fps() {
    return 1e3 / Math.max(1, Number.parseInt(this.getAttribute(r.attr.fps) ?? "12", 10));
  }
  get shouldShowControls() {
    return !!this.getAttribute(r.attr.controls);
  }
  connectedCallback() {
    const t = this.attachShadow({ mode: "open" }), i = new CSSStyleSheet();
    i.replaceSync(r.css), t.adoptedStyleSheets = [i];
    const s = document.createElement("canvas");
    s.setAttribute("width", String(this.width)), s.setAttribute("height", String(this.height)), s.setAttribute("style", String(this.style)), t.appendChild(s);
    const h = s.transferControlToOffscreen();
    new U().postMessage({
      canvas: h,
      cellSize: this.cellSize,
      color1: this.color1,
      color1Tick: this.color1Tick,
      color2: this.color2,
      hueRotate: this.hueRotate,
      minInterval: this.fps
    }, [h]);
  }
};
a(r, "tagName", "game-of-life"), a(r, "attr", {
  width: "width",
  height: "height",
  color1: "color1",
  color1Tick: "color1Tick",
  color2: "color2",
  cellSize: "cellSize",
  fps: "fps",
  style: "style",
  controls: "controls",
  hueRotate: "hueRotate"
}), a(r, "css", `
        canvas {
            margin: 0;
            padding: 0;
        }
    `);
let c = r;
customElements.define("game-of-life", c);
export {
  c as GameOfLife
};
