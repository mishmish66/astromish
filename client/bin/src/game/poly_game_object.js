import { GameObject } from './game_object.js';
export class PolyGameObject extends GameObject {
    constructor(x, y, theta, verts, dxdt = 0, dydt = 0, stroke_width = 5) {
        super(x, y, theta);
        this.verts = verts;
        this.dxdt = dxdt;
        this.dydt = dydt;
        this.stroke_width = stroke_width;
    }
    draw(context) {
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
//# sourceMappingURL=poly_game_object.js.map