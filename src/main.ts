import { DEFAULT_COLOR_1, DEFAULT_COLOR_1_TICK, DEFAULT_COLOR_2 } from "./worker";
import GOLWorker from './worker?worker&inline'

export class GameOfLife extends HTMLElement {
    static tagName = "game-of-life";
    static attr = {
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
    };

    static css = `
        canvas {
            margin: 0;
            padding: 0;
        }
    `

    useAnimation() {
        return "matchMedia" in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    get cellSize() {
        return Number.parseInt(this.getAttribute(GameOfLife.attr.cellSize) ?? "1", 10);
    }

    get width() {
        return this.getAttribute(GameOfLife.attr.width) || undefined;
    }

    get height() {
        return this.getAttribute(GameOfLife.attr.height) || undefined;
    }

    get color1() {
        return this.getAttribute(GameOfLife.attr.color1) || DEFAULT_COLOR_1;
    }

    get color1Tick() {
        return this.getAttribute(GameOfLife.attr.color1Tick) || DEFAULT_COLOR_1_TICK;
    }

    get color2() {
        return this.getAttribute(GameOfLife.attr.color2) || DEFAULT_COLOR_2;
    }

    get hueRotate() {
        return Boolean(this.getAttribute(GameOfLife.attr.hueRotate));
    }

    get fps() {
        if (!this.useAnimation()) {
            // If the viewer has prefer reduced motion set we pin the speed to 0.5 fps.
            return 2000;
        }
        return 1000 / Math.max(1, Number.parseInt(this.getAttribute(GameOfLife.attr.fps) ?? "12", 10));
    }

    get shouldShowControls() {
        return Boolean(this.getAttribute(GameOfLife.attr.controls));
    }

    connectedCallback() {
        const shadowroot = this.attachShadow({ mode: "open" });
        const stylesheet = new CSSStyleSheet();
        stylesheet.replaceSync(GameOfLife.css);
        shadowroot.adoptedStyleSheets = [stylesheet];

        const htmlCanvas = document.createElement("canvas");

        htmlCanvas.setAttribute("width", String(this.width));
        htmlCanvas.setAttribute("height", String(this.height));
        htmlCanvas.setAttribute("style", String(this.style));

        shadowroot.appendChild(htmlCanvas);

        const offscreen = htmlCanvas.transferControlToOffscreen();
        const worker = new GOLWorker();

        worker.postMessage({ 
            canvas: offscreen,
            cellSize: this.cellSize,
            color1: this.color1,
            color1Tick: this.color1Tick,
            color2: this.color2,
            hueRotate: this.hueRotate,
            minInterval: this.fps,
        },[offscreen]);
    }
}

customElements.define("game-of-life", GameOfLife);
