var P1_DIRECTION_VALUE = {
	w: "up",
	a: "left",
	s: "down",
	d: "right"
};

var P2_DIRECTION_VALUE = {
	arrowup: "up",
	arrowleft: "left",
	arrowdown: "down",
	arrowright: "right"
};

var DIRECTION_TO_ANGLE = {
	up: 0,
	down: 180,
	
	left: 270,
	right: 90
};

Game.entity.define("Frogger_Base", {
	sheet: "Frogger",
	
	collidable: false,
	
	init: function(sprite, centerX, centerY)
	{
		this.scaleToTilesize();
		
		this.setPos(centerX - this.w / 2, centerY - this.h / 2);
		
		this.setRotation(DIRECTION_TO_ANGLE["down"]);
		
		this.sprite = sprite;
	},
	
	scaleToTilesize: function()
	{
		this.setSize(TILESIZE * 0.8, TILESIZE * 0.8);
	}
});

Game.entity.extend("Frogger_Base", "Frogger", {
	zIndex: -1,
	
	state: "alive",
	
	direction: "up",
	
	jumping: false,
	jumpSpeed: 0,
	
	id: "",
	
	respawnTileX: null,
	respawnTileY: null,
	respawnDelay: 200,
	respawnDt: 0,
	
	collidable: true,
	
	maxProgress: 0,
		
	init: function(tileX, tileY)
	{		
		this.scaleToTilesize();
		
		if(typeof tileX != "undefined" && typeof tileY != "undefined")
		{
			this.respawnTileX = tileX;
			this.respawnTileY = tileY;
			
			this.setTilePos(tileX, tileY);
		}
		
		let frogCount = Game.entity.byName("Frogger").length;
		
		if(frogCount > 0)
		{
			this.setId("player2");			
		}
		else
		{
			this.setId("player1");			
		}
		
		this.jumpSpeed = HEIGHT * 4 / 9;		
	},
	
	setX: function(x)
	{
		this.x = x;
		this.destX = x;
		
		return this;
	},
	
	setY: function(y)
	{
		this.y = y;
		this.destY = y;
		
		return this;
	},
	
	setPos: function(x, y)
	{
		this.x = x;
		this.y = y;
		
		this.destX = x;
		this.destY = y;
		
		return this;
	},
	
	halt: function()
	{
		this.destX = this.x;
		this.destY = this.y;
		
		return this;
	},
	
	setTilePos: function(tileX, tileY)
	{		
		return this.setPos((tileX * TILESIZE) + (0.1 * TILESIZE), (tileY * TILESIZE) + (0.1 * TILESIZE));
	},
	
	move: function(dt)
	{
		if(this.jumping)
		{
			let speed = this.jumpSpeed * dt, dist;
			
			if(this.x < this.destX)
			{
				dist = this.destX - this.x;
				
				this.x += Math.min(speed, dist);
			}
			else if(this.x > this.destX)
			{
				dist =  this.x - this.destX;
				
				this.x -= Math.min(speed, dist);
			}
			
			if(this.y < this.destY)
			{
				this.y += Math.min(speed, this.destY - this.y);
			}
			else if(this.y > this.destY)
			{
				this.y -= Math.min(speed, this.y - this.destY);
			}
		}
		
		this.jumping = this.x != this.destX || this.y != this.destY;
	},
	
	jump: function(direction)
	{
		if(this.state != "alive" || this.jumping)
			return;
		
		if(direction)
		{		
			switch(direction)
			{
				case "up":
					this.destY = this.y - TILESIZE;
				break;
				
				case "down":
					if(this.y + this.h <= TILESIZE * (1/(TILESIZE_RATIO) - 2))
						this.destY = this.y + TILESIZE;
				break;
				
				case "left":
					this.destX = Math.max(this.x - TILESIZE, !this.riding ? TILESIZE * 0.1 : -Infinity);
				break;
				
				case "right":
					this.destX = Math.min(this.x + TILESIZE, !this.riding ? WIDTH - TILESIZE * 0.9 : Infinity);
				break;
			}
			
			this.direction = direction;
			this.jumping = true;
			
			this.play(this.id + "_jump");
		}
	},
	
	faceCurrentDirection: function()
	{
		this.setRotation(DIRECTION_TO_ANGLE[this.direction]);
	},
	
	isJumping: function()
	{
		return this.jumping;
	},
	
	// Frogger starts 13 tiles away from the safe zone and gains 10 points per tile traveled towards the safe zone
	// 
	trackProgress: function()
	{		
		let progress = Math.floor(13 - (this.y - TILESIZE * 0.1) / TILESIZE);
		
		this.progress = progress;
		
		if(progress > this.maxProgress)
		{
			this.maxProgress = progress;
			this.score(10);
		}
	},
	
	detectCollisions: function(dt)
	{
		let collisions = this.findOverlapping(), e;
		
		this.riding = false;
		
		for(var i = 0, l = collisions.length; i < l; i++)
		{
			e = collisions[i];
			
			if(e.hazardous)
			{
				this.kill(e.name + " Hazard");
			}
			else if(!this.jumping)
			{
				if(e.rideable && !this.riding)
				{
					this.setX(this.x + e.moveSpeed * dt);
					
					this.riding = true;
				}
				else if(e.isA("SafeZone"))
				{
					if(!e.isOccupied())
						e.occupy(this);
					else
						this.kill("Occupied Safe Zone");
				}
			}
		}
	},
	
	detectDrowning: function()
	{
		if(this.state == "alive")
		{
			let riverY1 = RIVER_START_Y, riverY2 = riverY1 + TILESIZE * LANES;
			
			if(!this.riding && !this.jumping && this.y >= riverY1 && (this.y + this.h) <= riverY2)
			{
				this.kill("Drowning");
			}
		}
	},
	
	// Kill Frogger if it misses the lily pads on the river bank
	detectRiverBank: function()
	{
		if(this.state == "alive" && !this.jumping && this.y < RIVER_START_Y)
		{
			this.kill("River Bank");
		}
	},
	
	detectOutOfBounds: function()
	{
		if(this.state == "alive")
		{
			if(this.x < TILESIZE * 0.1 || this.x > WIDTH - TILESIZE * 0.9)
				this.kill("Out of Bounds");
		}
	},
	
	handleDeath: function(dt)
	{		
		switch(this.state)
		{
			case "dying-start":
				this.play(this.id + "_death");
				this.state = "dying";
			break;
			
			case "dying":
				if(!this.animation || this.animation.isComplete())
				{
					this.state = "resurrecting";
				}
			break;
			
			case "resurrecting":
				this.respawnDt = Math.min(this.respawnDt + (dt * 1000), this.respawnDelay);
				
				if(this.respawnDt >= this.respawnDelay)
				{
					this.respawnDt = 0;
					
					if(Game.getCounter(this.id + "_lives") > 0)
					{						
						this.respawn();
					}
					else
					{
						this.remove();
						
						//Game.scene.enter("gameover");
					}
				}
			break;
		}
	},
	
	score: function(points)
	{
		Game.increaseCounter(this.id + "_score", points);
	},
	
	respawn: function()
	{
		this.state = "alive";
		
		this.progress = 0;
		this.maxProgress = 0;
		
		// Move frogger 1 tile behind the actual respawn point before having it jump into position		
		this.setTilePos(this.respawnTileX, this.respawnTileY + 1);
		this.jump("up");
	},
	
	// Stop all movement, take a life, and start death cycle
	kill: function(cause)
	{
		if(cause)
			console.log("Killed by: " + cause);
		
		this.state = "dying-start";
		
		this.halt();
		
		Game.decreaseCounter(this.id + "_lives");
	},
	
	update: function(dt)
	{
		this.move(dt);
		this.faceCurrentDirection();
		
		this.trackProgress();
		
		this.detectCollisions(dt);
		this.detectDrowning();
		this.detectOutOfBounds();
		this.detectRiverBank();
		
		this.handleDeath(dt);
		
		if(this.state == "alive" && !this.jumping)
		{
			this.stop();
			
			this.sprite = this.id;
		}
		
		this.collidable = (this.state == "alive");		
	},
	
	getBoundingRect: function()
	{
		let boundingRect;
		
		if(!this.jumping)
		{
			boundingRect = {
				x: this.x + this.w * 0.1,
				y: this.y + this.h * 0.1,
				w: this.w * 0.8,
				h: this.h * 0.8
			};
		}
		else if(this.direction == "left" || this.direction == "right")
		{
			boundingRect = {
				x: this.x,
				y: this.y + this.h * 0.1,
				w: this.w,
				h: this.h * 0.8
			};
		}
		
		return boundingRect || {
			x: this.x + this.w * 0.1,
			y: this.y,
			w: this.w * 0.8,
			h: this.h
		};
	}
});