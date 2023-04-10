var LOG_SIZE = [3, 4, 6],
	LOG_SPEED = [0.125, 0.15, 0.2];

var SHORT = 0, MEDIUM = 1, LARGE = 2;

Game.entity.define("Log", {
	variation: SHORT,
	
	rideable: true,
	hazardous: false,
	
	pool: true,
	
	color: "brown",
	
	init: function(variation, x)
	{
		this.variation = variation;
		
		let lane;
		
		if(variation == SHORT)
			lane = 4;
		else if(variation == MEDIUM)
			lane = 1;
		else if(variation == LARGE)
			lane = 3;
		
		this.y = RIVER_START_Y + (TILESIZE * (lane - 1)) + (TILESIZE * 0.05);
		this.setSize(TILESIZE * LOG_SIZE[variation], TILESIZE * 0.9);
		
		this.x = x || -this.w;
		
		this.moveSpeed = WIDTH * LOG_SPEED[variation];
	},
	
	move: function(dt)
	{
		this.x += this.moveSpeed * dt;
		
		if(this.x >= WIDTH)
			this.remove();
	},
	
	update: function(dt)
	{
		this.move(dt);
	}
});

function createLogGroup(variant, length, spacingFactor)
{
	length = length || 3;
	
	let w = TILESIZE * LOG_SIZE[variant];
	
	let spacing = w + (TILESIZE * spacingFactor);
	
	for(var i = 0; i < length; i++)
	{
		Game.entity.addNew("Log", variant, -w + spacing * -i);
	}
}

function createLogGroup3(variant, spacingFactor)
{
	createLogGroup(variant, 3, spacingFactor);
}

function createLogGroup4(variant, spacingFactor)
{
	createLogGroup(variant, 4, spacingFactor);
}