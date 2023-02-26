export abstract class GameObject
{
    constructor(public x: number = 0, public y: number = 0, public theta: number = 0, public dxdt: number = 0, public dydt: number = 0) { }

    private _needs_to_be_destroyed: boolean = false;

    public abstract draw(context: CanvasRenderingContext2D): void;

    protected update_callback(dt: number): void { }

    protected destroy(): void { this._needs_to_be_destroyed = true; }

    public get needs_to_be_destroyed(): boolean { return this._needs_to_be_destroyed; }

    public update(width: number, height: number, dt: number): boolean
    {
        this.x += this.dxdt * dt;
        this.y += this.dydt * dt;

        if (this.x < 0)
            this.x += width;
        if (this.x > width)
            this.x -= width;

        if (this.y < 0)
            this.y += height;
        if (this.y > height)
            this.y -= height;

        this.update_callback(dt);

        return this.needs_to_be_destroyed;
    }
}