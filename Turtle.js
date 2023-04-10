var TURTLE_VARIANT = ["green_turtle", "blue_turtle"];

var GREEN_TURTLE = 0,
	BLUE_TURTLE = 1;

Game.entity.define("Turtle", {	
	variant: 0,
	
	sheet: "Frogger",
	sprite: "",
		
	rideable: true,
	hazardous: false,
		
	pool: true,
		
	init: function(variant, x, lane)
	{
		this.variant = variant;
		
		// Turtles always move left
		this.moveSpeed = WIDTH * -0.2;
		
		this.setPos(x, RIVER_START_Y + (TILESIZE * lane) + TILESIZE * 0.05);
		this.setSize(TILESIZE * 0.9, TILESIZE * 0.9);
		
		// Set collidable flag to true by default in the event that the entity pool caches a non-collidable turtle
		// Ditto for ridable flag
		this.collidable = true;
		this.rideable = true;
		
		this.updateSprite();
	},
	
	move: function(dt)
	{
		this.x += this.moveSpeed * dt;
	},
	
	removeIfOutOfBounds: function()
	{
		if(this.x + this.w <= 0)
			this.remove();
	},
	
	updateSprite: function()
	{
		let sprite = TURTLE_VARIANT[this.variant];
		
		if(this.variant == BLUE_TURTLE)
		{
			sprite = sprite + (typeof TURTLE_SPRITE != "undefined" ? "_" + TURTLE_SPRITE : "");			
		}
		
		this.sprite = sprite;
	},
	
	update: function(dt)
	{		
		if(this.variant == BLUE_TURTLE)
			this.collidable = this.rideable = (TURTLE_STATE != SUBMERGED);
		
		this.move(dt);
		this.removeIfOutOfBounds();
		
		this.updateSprite();
	}
});

function createTurtleGroup(variant, riverLane, length, startX)
{
	length = length || 3;
	
	let x = startX || WIDTH;
	
	let spacing = TILESIZE + 5;
	
	for(var i = 0; i < length; i++)
	{
		Game.entity.addNew("Turtle", variant, x + spacing * i, riverLane);
	}
}

function createTurtleGroup2(variant, riverLane, startX)
{
	createTurtleGroup(variant, riverLane, 2, startX);
}

function createTurtleGroup3(variant, riverLane, startX)
{
	createTurtleGroup(variant, riverLane, 3, startX);
}