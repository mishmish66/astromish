import { GameObject } from './game_object.js';

export class PolyGameObject extends GameObject
{
    constructor(x: number, y: number, theta: number, public verts: DOMPoint[], public dxdt: number = 0, public dydt: number = 0, public stroke_width: number = 5)
    {
        super(x, y, theta);
    }

    public draw(context: CanvasRenderingContext2D)
    {

        // context.imageSmoothingEnabled = false;

        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.theta);

        context.beginPath();
        context.moveTo(this.verts[0].x, this.verts[0].y);
        this.verts.forEach((vert) => { context.lineTo(vert.x, vert.y); });
        context.closePath();

        context.fillStyle = 'black';
        context.fill();

        context.clip();
        context.strokeStyle = 'white';
        context.lineWidth = this.stroke_width;
        context.stroke();

        context.restore();
    }
}