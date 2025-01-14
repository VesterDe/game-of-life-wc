import { gameOfLife } from "./gol";

export const DEFAULT_MIN_INTERVAL = 1000 / 12;
export const DEFAULT_CELL_SIZE = 3;
export const DEFAULT_COLOR_1 = "rgba(0, 20, 0, 1)";
export const DEFAULT_COLOR_1_TICK = "rgba(0, 20, 0, 0.3)";
export const DEFAULT_COLOR_2 = "rgba(0, 200, 0, 1)";

let gol: GOL;

type GOLMessageEvent = MessageEvent<{
    canvas: OffscreenCanvas;
    minInterval?: number;
    cellSize?: number;
    color1?: string;
    color1Tick?: string;
    color2?: string;
    paused?: boolean;
    width?: number;
    height?: number;
    action?: "restart" | "play" | "pause";
    hueRotate?: boolean;
}>

export class GOL {
    canvas: OffscreenCanvas;
    minInterval: number;
    cellSize: number;
    color1: string;
    color1Tick: string;
    color2: string;
    ctx: OffscreenCanvasRenderingContext2D | null;
    lastDraw: number;
    gen: Generator;
    isPaused: boolean;
    hueRotate: boolean;

    constructor({ data }: GOLMessageEvent) {
        this.canvas = data.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.minInterval = data.minInterval ?? DEFAULT_MIN_INTERVAL;
        this.cellSize = data.cellSize ?? DEFAULT_CELL_SIZE;
        this.color1 = data.color1 ?? DEFAULT_COLOR_1;
        this.color1Tick = data.color1Tick ?? DEFAULT_COLOR_1_TICK;
        this.color2 = data.color2 ?? DEFAULT_COLOR_2;
        this.lastDraw = 0;
        this.isPaused = true;
        this.hueRotate = Boolean(data.hueRotate);

        this.fillCanvas(this.color1);
        this.gen = gameOfLife({ width: this.width, height: this.height });
        this.draw();
        this.isPaused = Boolean(data.paused);
        this.draw();
    }

    public get width(): number {
        return Math.floor(this.canvas.width / this.cellSize)
    }

    public set width(width: number) {
        if (this.canvas.width !== width) {
            this.canvas.width = width;
            this.gen = gameOfLife({ width: this.width, height: this.height });
            this.draw();
        }
    }
    public get height(): number {
        return Math.floor(this.canvas.height / this.cellSize)
    }

    public set height(height: number) {
        if (this.canvas.height !== height) {
            this.canvas.height = height;
            this.gen = gameOfLife({ width: this.width, height: this.height });
            this.draw();
        }
    }

    public set paused(isPaused: boolean) {
        this.isPaused = isPaused;
        if (!isPaused) {
            this.draw();
        }
    }

    fillCanvas(color: string) {
        if (this.ctx) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    fillCell(x: number, y: number, width: number, height: number, color: string) {
        if (this.ctx) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, width, height);
        }
    }

    draw(tick = 0) {
        if (tick === 0 || tick - this.lastDraw > this.minInterval) {
            if (this.hueRotate) {
                this.color2 = `hsla(${180 + (Math.sin(this.lastDraw / 50000) * 360)}, 100%, 50%, 0.8)`;
            }
            this.lastDraw = tick;
            this.fillCanvas(this.color1Tick);
            const iteration = this.gen.next().value;

            for (let row = 0; row < iteration.length; row++) {
                const column = iteration[row];
                for (let cellIndex = 0; cellIndex < column.length; cellIndex++) {
                    const cell = column[cellIndex];
                    if (cell) {
                        this.fillCell(cellIndex * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize, this.color2);
                    }
                }
            }
        }

        if (!this.isPaused) {
            requestAnimationFrame((tick) => { this.draw(tick); });
        }
    }

}

self.onmessage = (evt: GOLMessageEvent) => {
    if (evt.data.canvas) {
        gol = new GOL(evt);
    } else {
        if (gol && evt.data.paused !== undefined) {
            gol.paused = evt.data.paused;
        }
        if (gol && typeof evt.data.width === 'number') {
            gol.width = evt.data.width;
        }
        if (gol && typeof evt.data.height === 'number') {
            gol.height = evt.data.height;
        }
    }
};
