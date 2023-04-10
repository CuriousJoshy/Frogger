var PLAYER1, PLAYER2;

var TIME_LIMIT = 30000,
	FLY_LIFESPAN = 5000;

var RIVER2_INTERVAL = 75,
	RIVER5_INTERVAL = 115;
	
const SURFACED = "surfaced",
	SUBMERGING = "submerging",
	SUBMERGED = "submerged",
	SURFACING = "surfacing";

const SUBMERGE_STATE = [
	"submerge1",
	"submerge2",
	"submerge3",
	"submerge4",
	"submerge5"
];
	
var TURTLE_STATE = SURFACED,
	TURTLE_SPRITE = undefined;

var RIVER1_INTERVAL = 320;
var riverSpawn1 = new IntervalClock({
	intervalTime: RIVER1_INTERVAL,
	intervalLength: RIVER1_INTERVAL,
	
	cooldownTime: RIVER1_INTERVAL * 2.25,
	
	intervalFunc: function(count)
	{
		createLogGroup4(MEDIUM, 4);
	}
});

var riverSpawn2 = new IntervalClock({
	intervalTime: RIVER2_INTERVAL,
	intervalLength: RIVER2_INTERVAL * 5,
	
	cooldownTime: RIVER2_INTERVAL * 1.75,
	
	intervalFunc: function(count)
	{
		createTurtleGroup2(count == 1 ? BLUE_TURTLE : GREEN_TURTLE, LANE_2);
	}
});

var RIVER3_INTERVAL = 275;
var riverSpawn3 = new IntervalClock({
	intervalTime: RIVER3_INTERVAL,
	intervalLength: RIVER3_INTERVAL,
	
	cooldownTime: RIVER3_INTERVAL * 2.25,
	
	intervalFunc: function(count)
	{
		createLogGroup3(LARGE, 3);
	}
});

var RIVER4_INTERVAL = 300;
var riverSpawn4 = new IntervalClock({
	intervalTime: RIVER4_INTERVAL,
	intervalLength: RIVER4_INTERVAL,
	
	cooldownTime: RIVER4_INTERVAL * 2.25,
	
	intervalFunc: function(count)
	{
		createLogGroup3(SHORT, 5);
	}
});

var riverSpawn5 = new IntervalClock({	
	intervalTime: RIVER5_INTERVAL,
	intervalLength: RIVER5_INTERVAL * 5,
	
	cooldownTime: RIVER5_INTERVAL * 1.25,
	
	intervalFunc: function(count)
	{
		createTurtleGroup3(count == 5 ? BLUE_TURTLE : GREEN_TURTLE, LANE_5);
	}
});

var ROAD1_INTERVAL = 115;

var roadSpawn1 = new IntervalClock({	
	intervalTime: ROAD1_INTERVAL,
	intervalLength: ROAD1_INTERVAL * 5,
	
	cooldownTime: ROAD1_INTERVAL * 0.75,
	
	intervalFunc: function()
	{
		Game.entity.addNew("Vehicle", LANE_1);
	}
});

var ROAD2_INTERVAL = 125;

var roadSpawn2 = new IntervalClock({
	intervalTime: ROAD2_INTERVAL,
	intervalLength: ROAD2_INTERVAL * 5,
	
	cooldownTime: ROAD2_INTERVAL * 1,
	
	intervalFunc: function()
	{
		Game.entity.addNew("Vehicle", LANE_2);
	}
});

var ROAD3_INTERVAL = 115;

var roadSpawn3 = new IntervalClock({
	startDelay: ROAD1_INTERVAL * 2.5,
	
	intervalTime: ROAD3_INTERVAL,
	intervalLength: ROAD3_INTERVAL * 5,
	
	cooldownTime: ROAD3_INTERVAL * 1.75,
	
	intervalFunc: function()
	{
		Game.entity.addNew("Vehicle", LANE_3);
	}
});

var ROAD4_INTERVAL = 125;

var roadSpawn4 = new IntervalClock({
	startDelay: ROAD2_INTERVAL * 2.5,
	
	intervalTime: ROAD4_INTERVAL,
	intervalLength: ROAD4_INTERVAL * 5,
	
	cooldownTime: ROAD4_INTERVAL * 1.5,
	
	intervalFunc: function()
	{
		Game.entity.addNew("Vehicle", LANE_4);
	}
});

var ROAD5_INTERVAL = 145;

var roadSpawn5 = new IntervalClock({
	intervalTime: ROAD5_INTERVAL,
	intervalLength: ROAD5_INTERVAL * 5,
	
	cooldownTime: ROAD5_INTERVAL * 1.25,
	
	intervalFunc: function()
	{
		Game.entity.addNew("Vehicle", LANE_5);
	}
});

Game.ui.define("Score", {
	color: "white",
	text: "Score: 0",
	textAlign: "left",
	
	fontFamily: "Courier New",
	fontSize: "2.25em",
	fontWeight: "bold"
});

Game.ui.define("Time", {
	color: "white",
	
	text: "Time",
	textAlign: "right",
	
	fontFamily: "Courier New",
	fontSize: "2.25em",
	fontWeight: "bold"
});

Game.ui.define("TimeBar", {
	fill: "rgb(0, 255, 0)"
});

Game.scene.define("gameplay", {	
	turtleSubmergeInterval: 30, // Controls how long before the turtle submerges again after surfacing
	turtleSubmergeTime: 30, // Controls how long the turtle remains submerged
	turtleSubmergeSpeed: 30, // Controls how long the submerge/surface animation takes
	
	flyRespawnDT: 0,
	timeRemaining: 0,
	
	ticks: 0,
	
	debug: false,
	
	scoreUI: undefined,
	timeBar: undefined,
	
	enter: function(lastScene)
	{
		riverSpawn1.start();
		riverSpawn2.start();
		riverSpawn3.start();
		riverSpawn4.start();
		riverSpawn5.start();
		
		roadSpawn1.start();
		roadSpawn2.start();
		roadSpawn3.start();
		roadSpawn4.start();
		roadSpawn5.start();
		
		if(lastScene != "pauseScreen")
		{			
			let interfaceY = HEIGHT - TILESIZE, boxWidth = TILESIZE * 2.5;
			
			this.scoreUI = Game.ui.addNew("Score", {
				id: "scoreCounter",
				
				x: 0,
				y: interfaceY,
				
				w: boxWidth,
				h: TILESIZE
			});
			
			Game.ui.addNew("Time", {
				x: WIDTH - TILESIZE * 1.75,
				y: interfaceY,
				
				w: TILESIZE * 1.75,
				h: TILESIZE				
			});
			
			let startX = WIDTH - TILESIZE * 5, startW = TILESIZE * 3.25
			
			this.timeBar = Game.ui.addNew("TimeBar", {
				x: startX,
				y: interfaceY + TILESIZE / 4,
				
				w: startW,
				h: TILESIZE / 2,
				
				startX: startX,
				startW: startW 
			});
			
			Game.setCounter("player1_lives", 3);
			Game.setCounter("player1_score", 0);
			
			let startY = RIVER_START_Y, size = SAFE_ZONE_SIZE, halfSize = size / 2, 
	padding = TILESIZE * 0.75;
	
			let spacing = (WIDTH - padding * 2 - halfSize) / (SAFE_ZONES - 1) - (size / 8);
			
			let x = padding + halfSize
			
			for(var i = 0; i < SAFE_ZONES; i++)
			{
				Game.entity.addNew("SafeZone", x - halfSize, startY - size, size, size);
				
				x += spacing;
			}
			
			this.timeRemaining = TIME_LIMIT;
			
			// Fast forward game loop to populate screen with entities
			let frames = Math.floor((Math.random() * 150) + 300), ms = frames / Game.loop.getFPS() * 1000;
			// Subtract fast forward time from the fly respawn timer so that a fly doesn't spawn immediately
			this.flyRespawnDT -= ms;
			this.timeRemaining += ms;
			Game.loop.fastForward(frames);
						
			PLAYER1 = Game.addNew("Frogger", 7, 13);
			PLAYER1.respawn(); // Respawn Frogger to initiate jump in animation
		}
	},
	
	keypress: function(keys, key)
	{		
		if(PLAYER1 && P1_DIRECTION_VALUE[key])
		{
			PLAYER1.jump(P1_DIRECTION_VALUE[key]);
		}
		else if(PLAYER2 && P2_DIRECTION_VALUE[key])
		{
			PLAYER2.jump(P2_DIRECTION_VALUE[key]);
		}
		else if(key == "h")
		{
			Game.entity.toggleHitboxes();
		}
		else if(key == "g")
		{
			this.debug = !this.debug;
		}
		else if(key == "p")
		{
			Game.scene.changeTo("pauseScreen");
		}
	},
	
	updateTimeLimit: function(dt)
	{
		if(this.timeRemaining > 0)
		{
			this.timeRemaining -= dt * 1000;
		}
		else
		{
			PLAYER1.kill("Time Limit");
			
			this.timeRemaining = TIME_LIMIT;
		}
	},
	
	updateFlySpawn: function(dt)
	{
		if(Game.entity.count("Fly") === 0)
		{			
			if(this.flyRespawnDT >= FLY_LIFESPAN)
			{
				let safezones = Game.entity.byName("SafeZone").filter((sz) => !sz.isOccupied());
								
				if(safezones.length > 0)
				{
					Game.addNew("Fly", safezones[Math.floor(Math.random() * safezones.length)], FLY_LIFESPAN);
				}
				
				this.flyRespawnDT = 0;
			}
			else
				this.flyRespawnDT += dt * 1000;
		}		
	},
	
	updateUI: function()
	{
		if(this.scoreUI)
			this.scoreUI.setText("Score: " + Game.getCounter("player1_score"));
		
		if(this.timeBar)
		{
			let percentRemaining = this.timeRemaining / TIME_LIMIT;
			
			let newW = this.timeBar.startW * percentRemaining;
			
			this.timeBar.setW(newW);
			this.timeBar.setX(this.timeBar.startX + (this.timeBar.startW - newW));
			
			let red = 255 * (1 - percentRemaining), green = 255 * percentRemaining;
			
			this.timeBar.setFill("rgb(" + red +"," + green + ", 0");
		}
	},
	
	update: function(dt)
	{
		// Spawn turtles and logs at intervals
		riverSpawn1.update();
		riverSpawn2.update();
		riverSpawn3.update();
		riverSpawn4.update();
		riverSpawn5.update();
		
		this.updateSubmergeCycle();
		
		// Spawn vehicles at intervals
		roadSpawn1.update();
		roadSpawn2.update();
		roadSpawn3.update();
		roadSpawn4.update();
		roadSpawn5.update();
		
		Game.entity.update(dt);
		
		this.updateFlySpawn(dt);
		
		if(Game.getCounter("player1_lives") > 0)
		{
			this.updateTimeLimit(dt);
			
			this.updateUI();
		}
		
		// Clear the hashList to reset list of previously tested collision interactions for next frame
		Game.map.clearHashList();
	},
	
	/*
		Globally updates the state of any BLUE_TURTLE variant to sync submerge and surface animations
	*/
	updateSubmergeCycle: function()
	{
		let currentState = TURTLE_STATE, submergeFrame;
		
		switch(TURTLE_STATE)
		{
			case SURFACED: // While SURFACED, wait until the submerge interval time has been met before SUBMERGING
				if(this.ticks >= this.turtleSubmergeInterval) 
					TURTLE_STATE = SUBMERGING;
			break;
			
			case SUBMERGING:
				// ticks / submergeSpeed = % animation completion
				// % animation complete * # of animation frames = current animation frame
				// Round frame number to prevent decimals
				
				submergeFrame = Math.floor(this.ticks / this.turtleSubmergeSpeed * 5);
				
				if(submergeFrame)
					// subtract 1 from animation frame for 0 index
					TURTLE_SPRITE = SUBMERGE_STATE[submergeFrame - 1]; 
								
				// Change state to SUBMERGED once animation is complete
				if(this.ticks >= this.turtleSubmergeSpeed)
					TURTLE_STATE = SUBMERGED;
			break;
			
			case SUBMERGED:
				// Once submerge time has been met, change state to SURFACING
				if(this.ticks >= this.turtleSubmergeTime)
					TURTLE_STATE = SURFACING;
			break;
			
			case SURFACING:
				// Inverse of SUBMERGING animation process
				submergeFrame = 5 - Math.floor(this.ticks / this.turtleSubmergeSpeed * 5);
				
				if(submergeFrame == 0)
					// Set sprite to undefined to force default Turtle sprite
					TURTLE_SPRITE = undefined;
				else
				{
					TURTLE_SPRITE = SUBMERGE_STATE[submergeFrame - 1];
				}
				
				// Once animation is complete, change state to SURFACED
				if(this.ticks >= this.turtleSubmergeSpeed)
					TURTLE_STATE = SURFACED;
			break;
			
			default:
				TURTLE_STATE = SURFACED;
		}
		
		// Only reset tick count when state changes to allow animations to run to completion
		if(currentState != TURTLE_STATE)
			this.ticks = 0;
		else
			this.ticks++;
	},
	
	draw: function(ctx)
	{
		drawBackground(ctx);
		drawRoad(ctx);
		drawRiver(ctx);
		drawRiverBank(ctx);
		
		/*
			Vehicles need to appear on top of Frogger
			River entities need to appear below Frogger
		*/
		Game.entity.draw(ctx);
		
		// Draw the debug lines for spatial hashing
		if(this.debug)
		{
			Game.map.draw(ctx);
		}
	},
	
	exit: function()
	{
		riverSpawn1.stop();
		riverSpawn2.stop();
		riverSpawn3.stop();
		riverSpawn4.stop();
		riverSpawn5.stop();
		
		roadSpawn1.stop();
		roadSpawn2.stop();
		roadSpawn3.stop();
		roadSpawn4.stop();
		roadSpawn5.stop();
	}
});

Game.scene.define("pauseScreen", {
	keypress: function(keys, key)
	{
		if(key == "p")
			Game.scene.changeTo("gameplay");
	},
	
	draw: function(ctx)
	{
		Game.scene.execute("gameplay", "draw", ctx);
	}
});