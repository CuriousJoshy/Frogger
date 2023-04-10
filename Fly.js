var FLY_SHRINK_PERCENTAGE = 0.1;

Game.entity.define("Fly", {
	sheet: "Frogger",
	
	sprite: "fly",
		
	safezone: undefined,
	
	init: function(safezone, lifespan)
	{
		let sitpoint = safezone.getSitPoint();
		
		this.setSize(0, 0);
		
		this.setPos(sitpoint.x - this.w / 2, sitpoint.y - this.h / 2);
		
		safezone.setFly(this);
		
		this.safezone = safezone;
		
		this.lifespan = lifespan;
	},
	
	eatenBy: function(frogger)
	{
		Game.increaseCounter(frogger.id + "_score", 200);
		
		this.safezone.removeFly();
		
		this.remove();
	},
	
	detectCollisions: function()
	{
		let collisions = this.findOverlapping(), e;
		
		for(var i = 0, l = collisions.length; i < l; i++)
		{
			e = collisions[i];
			
			if(e.isA("Frogger"))
			{
				this.eatenBy(e);
				
				break;
			}
		}
	},
	
	updateLifespan: function(dt)
	{
		this.lifespan -= 1000 * dt;
				
		let lifespan_dt = FLY_LIFESPAN * FLY_SHRINK_PERCENTAGE
		
		if(this.lifespan <= 0)
		{	
			this.safezone.removeFly();
			this.remove();
		}
		else if(this.lifespan >= FLY_LIFESPAN - lifespan_dt)
		{			
			// Cause fly to grow over time
			let ratio = (FLY_LIFESPAN - this.lifespan) / lifespan_dt, 
			sitpoint = this.safezone.getSitPoint();
						
			this.setSize(TILESIZE * ratio, TILESIZE * ratio);
			this.setPos(sitpoint.x - this.w / 2, sitpoint.y - this.h / 2);
		}
		else if(this.lifespan <= lifespan_dt) 
		{
			// Cause fly to shrink over time
			let ratio = this.lifespan / (FLY_LIFESPAN * FLY_SHRINK_PERCENTAGE), 
			sitpoint = this.safezone.getSitPoint();
			
			this.setSize(TILESIZE * ratio, TILESIZE * ratio);
			this.setPos(sitpoint.x - this.w / 2, sitpoint.y - this.h / 2);
		}
	},
	
	update: function(dt)
	{
		this.detectCollisions();
		this.updateLifespan(dt);
	},
	
	// Fly should only be collected if Frogger reaches the safezone, hence using the exact same hitbox as the safezone
	getBoundingRect: function()
	{
		return this.safezone.getBoundingRect();
	}
});