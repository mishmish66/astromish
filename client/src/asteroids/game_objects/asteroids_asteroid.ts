import { PolyGameObject } from "../../game/poly_game_object.js";

export class AsteroidsAsteroid extends PolyGameObject
{
    constructor(x: number, y: number, theta: number, radius: number = 100)
    {
        const max_verts = 12;
        const min_verts = 6;
        const max_bump = radius * 0.5;
        const max_dip = radius * 0.8;

        const verts = AsteroidsAsteroid.make_randomish_asteroid_points(radius, max_verts, min_verts, max_bump, max_dip);

        super(x, y, theta, verts);
    }

    private static make_randomish_asteroid_points(radius: number, max_verts: number, min_verts: number, max_bump: number, max_dip: number): DOMPoint[]
    {
        let verts: DOMPoint[] = [];

        let max_angle = 2 * Math.PI / min_verts;
        let min_angle = 2 * Math.PI / max_verts;

        let bump_range = max_bump + max_dip;

        let angle = 0;

        while (angle < (2 * Math.PI)) {
            let height = radius + Math.random() * bump_range - max_dip;

            verts.push(new DOMPoint(height * Math.cos(angle), height * Math.sin(angle)));

            angle += min_angle + Math.random() * (max_angle - min_angle);
        }

        return verts;
    }
}