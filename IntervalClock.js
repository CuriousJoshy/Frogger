var PREP = -1,
	WARMUP = 0,
	INTERVAL = 1,
	COOLDOWN = 2;

var IntervalClock = function(options)
{
	this.startDelay = options.startDelay || 0; // How long before interval begins. Only triggered once
	this.warmupTime = options.warmupTime || 0; // How long before starting the current interval
	this.intervalTime = options.intervalTime || 0; // How often to perform the interval task
	this.intervalLength = options.intervalLength || 0; // How long the interval task lasts
	this.cooldownTime = options.cooldownTime || 0; // How long before beginning the next interval
	
	this.state = "paused";
	this.intervalPhase = this.startDelay > 0 ? PREP : WARMUP;
	this.intervalCount = 0;
	
	this.startFunc = options.startFunc;
	this.updateFunc = options.updateFunc;
	this.intervalFunc = options.intervalFunc;
		
	this.tick = 0;
};

IntervalClock.prototype = {
	start: function()
	{
		if(this.state != "running" && this.startFunc)
			this.startFunc();
		
		this.state = "running";
	},
	
	update: function()
	{
		if(this.state == "running")
		{
			let currentPhase = this.intervalPhase;
			
			switch(currentPhase)
			{
				case PREP:
					if(this.tick >= this.startDelay)
						this.intervalPhase++;
				break;
				
				case WARMUP:
					if(this.tick >= this.warmupTime)
						this.intervalPhase++;
				break;
				
				case INTERVAL:				
					if(this.tick >= this.intervalLength)
					{
						this.intervalCount = 0;
						this.intervalPhase++;
					}
					else if(this.tick % this.intervalTime === 0 && this.intervalFunc)
						this.intervalFunc(++this.intervalCount);
				break;
				
				case COOLDOWN:
					if(this.tick >= this.cooldownTime)
						this.intervalPhase = 0;
				break;
			}
			
			if(this.updateFunc)
				this.updateFunc(this.intervalPhase, this.tick);
			
			if(currentPhase != this.intervalPhase)				
				this.tick = 0;
			else
				this.tick++;
		}
	},
	
	stop: function()
	{
		this.state = "paused";
	},
	
	reset: function()
	{
		this.stop();
		
		this.tick = 0;
		this.intervalCount = 0;
		this.intervalPhase = this.startDelay > 0 ? PREP : WARMUP;
	}
};