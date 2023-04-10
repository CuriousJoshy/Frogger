var VEHICLE_DIRECTIONS = ["left", "right"];
var VEHICLE_SPEED = [0.2, 0.15, 0.2, 0.15, 0.125];

Game.entity.define("Vehicle", {
	lane: 0,
	direction: "",
	
	moveSpeed: 0,
	
	rideable: false,
	hazardous: true,
	
	pool: true,
	
	color: "lightgrey",
	
	init: function(lane)
	{
		this.lane = lane;
		
		this.direction = VEHICLE_DIRECTIONS[this.lane % 2];
		
		this.y = ROAD_START_Y + (this.lane * TILESIZE) + (TILESIZE * 0.05);
		this.x = (this.direction == "left" ? WIDTH : -TILESIZE);
		
		this.w = TILESIZE * 1.25;
		this.h = TILESIZE * 0.9;
		
		this.moveSpeed = WIDTH * VEHICLE_SPEED[this.lane] * (this.direction == "left" ? -1 : 1);
	},
	
	move: function(dt)
	{		
		this.x += this.moveSpeed * dt;
	},
	
	removeIfOutOfBounds: function()
	{
		if((this.direction == "left" && (this.x + this.w) <= 0) || (this.direction == "right" && this.x >= WIDTH))
			this.remove();
	},
	
	update: function(dt)
	{
		this.move(dt);
		this.removeIfOutOfBounds();
	}
});