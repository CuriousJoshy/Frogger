let TILESIZE_RATIO = 1/15; // The tilesize to height ratio
	
var LANES = 5;
	
var LANE_1 = 0,
	LANE_2 = 1,
	LANE_3 = 2,
	LANE_4 = 3,
	LANE_5 = 4;

var SAFE_ZONES = 5;

var FROGGER_COLOR = {
	PLAYER1: "lightgreen",
	PLAYER2: "lightblue"
};

function calculateGameSizes()
{
	HEIGHT = innerHeight;
	
	LANE_WIDTH = TILESIZE = HEIGHT * TILESIZE_RATIO;
	SAFE_ZONE_SIZE = TILESIZE * 1.25
	
	WIDTH = TILESIZE * 15;
	
	RIVER_START_Y = TILESIZE * 2;
	ROAD_START_Y = TILESIZE * 8;
}

function drawBackground(ctx)
{
	ctx.fillStyle = "black";
	
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawRoad(ctx)
{
	let startY = ROAD_START_Y, ROAD_SIZE = LANE_WIDTH * LANES;
	
	ctx.fillStyle = "purple";
	ctx.fillRect(0, startY - LANE_WIDTH, WIDTH, LANE_WIDTH);
	
	ctx.strokeStyle = "white";
	ctx.lineWidth = 2;
		
	ctx.beginPath();
		ctx.moveTo(0, startY);
		ctx.lineTo(WIDTH, startY);
	
	ctx.stroke();

	ctx.setLineDash([25, 25]);
	
	ctx.beginPath();
	
	let dashedLinePos;
	
	// Only draw the dashed lines inbetween the two solid lines
	for(var i = 1; i < LANES; i++)
	{
		dashedLinePos = (LANE_WIDTH * i);
		
		ctx.moveTo(0, startY + dashedLinePos);
		ctx.lineTo(WIDTH, startY + dashedLinePos);
	}
	
	ctx.stroke();
	
	ctx.setLineDash([]);
	
	ctx.beginPath();
		ctx.moveTo(0, startY + ROAD_SIZE);
		ctx.lineTo(WIDTH, startY + ROAD_SIZE);
	
	ctx.stroke();
	
	ctx.fillStyle = "purple";
	ctx.fillRect(0, ROAD_START_Y + ROAD_SIZE, WIDTH, LANE_WIDTH, HEIGHT - (ROAD_START_Y + ROAD_SIZE));
}

function drawRiver(ctx)
{	
	ctx.fillStyle = "darkblue";
	
	ctx.fillRect(0, RIVER_START_Y, WIDTH, LANE_WIDTH * LANES);
}

function drawRiverBank(ctx)
{
	ctx.fillStyle = "darkblue";
	ctx.fillRect(0, 0, WIDTH, RIVER_START_Y + 1);
	
	ctx.fillStyle = "green";
	ctx.strokeStyle = "white";
	ctx.lineJoin = "round";
	
	let startY = RIVER_START_Y, size = SAFE_ZONE_SIZE, halfSize = size / 2, 
	padding = TILESIZE * 0.75;
	
	let spacing = (WIDTH - padding * 2 - halfSize) / (SAFE_ZONES - 1) - (size / 8);
	
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(0, startY)
	ctx.lineTo(padding, startY);
	
	let x = padding + halfSize;
	
	let x1, y1, x2, y2;
	
	for(var i = 0; i < SAFE_ZONES; i++)
	{
		// The reference line for the position of each safe zone
		//ctx.moveTo(x, startY);
		//ctx.lineTo(x, startY - size);
		
		ctx.lineTo(x - halfSize, startY - size);
		ctx.lineTo(x + halfSize, startY - size);
		ctx.lineTo(x + halfSize, startY);
		
		if(i < SAFE_ZONES - 1)
		{
			ctx.lineTo(x + spacing - halfSize, startY);
			
			x += spacing;
		}
	}
	
	ctx.lineTo(WIDTH, startY);
	ctx.lineTo(WIDTH, 0);
	ctx.closePath();
	
	ctx.fill();
	ctx.stroke();
}

Game.scene.define("titleScreen", {});

Game.scene.define("modeSelect", {});

Game.scene.define("pauseScreen", {});

Game.scene.define("gameoverScreen", {});

Game.assets.add("Frogger Sprite Sheet", "Assets/Frogger Spritesheet.png");

Game.assets.load(function()
{	
	calculateGameSizes();
	
	createSprites();
	
	Game.init({
		stage: "stage",
		
		width: WIDTH,
		height: HEIGHT,
		
		hashSize: TILESIZE
	});
	
	Game.start("gameplay");
});

function createSprites()
{
	let image = Game.assets.get("Frogger Sprite Sheet");
	
	let sheet = Game.sheets.create("Frogger", {
		image: image,
		
		spriteW: 65,
		spriteH: 65,
		
		sprites: {
			player1: 0,
			player1_jump: 1,
			
			player2: 2,
			player2_jump: 3,
			
			enemy: 4,
			enemy_jump: 5,
			
			player1_death1: 6,
			player1_death2: 7,
			player1_death3: 8,
			player1_death4: 9,
			player1_death5: 10,
			player1_death6: 11,
			player1_death7: 12,
			player1_death8: 13,
			player1_death9: 14,
			player1_death10: 15,
			player1_death11: 16,
			player1_death12: 17,
			
			player2_death1: 18,
			player2_death2: 19,
			player2_death3: 20,
			player2_death4: 21,
			player2_death5: 22,
			player2_death6: 23,
			player2_death7: 24,
			player2_death8: 25,
			player2_death9: 26,
			player2_death10: 27,
			player2_death11: 28,
			player2_death12: 29,
			
			dead_frog: 30,
			
			fly: 31,
			
			green_turtle: 32,
			
			blue_turtle: 33,
			blue_turtle_submerge1: 34,
			blue_turtle_submerge2: 35,
			blue_turtle_submerge3: 36,
			blue_turtle_submerge4: 37,
			blue_turtle_submerge5: 38,
			
			lily_pad: 39
		},
		
		animations:
		{
			player1_jump: {
				loop: true,
				
				duration: 1,
				
				frames: ["player1_jump"]
			},
			
			player2_jump: {
				loop: true,
				
				duration: 1,
				
				frames: ["player2_jump"]
			},
			
			player1_death: {
				resetOnCompletion: false,
				
				duration: 200,
				
				frames: ["player1_death1","player1_death2","player1_death3","player1_death4","player1_death5","player1_death6","player1_death7","player1_death8","player1_death9","player1_death10","player1_death11","player1_death12", "dead_frog"]
			},
			
			player2_death: {
				resetOnCompletion: false,
				
				duration: 200,
				
				frames: ["player2_death1","player2_death2","player2_death3","player2_death4","player2_death5","player2_death6","player2_death7","player2_death8","player2_death9","player2_death10","player2_death11","player2_death12", "dead_frog"]
			}
		}
	});
}

function resizeGame()
{
	if(Game.context)
	{
		let height = innerHeight, ratio = innerHeight / HEIGHT;
		
		/*
		Game.context.resetTransform();
		Game.context.scale(ratio, ratio);
		
		Game.stage.width = WIDTH * ratio;
		Game.stage.height = height * ratio;
		*/
		
		calculateGameSizes();
	}
}

addEventListener("resize", resizeGame);