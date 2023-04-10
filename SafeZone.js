Game.entity.define("SafeZone", {	
	sheet: "Frogger",
	
	zIndex: 2,
	
	sprite: "lily_pad",
	
	occupyingEntity: undefined,
	
	hazardous: false,
	
	fly: undefined,
			
	init: function(x, y, w, h)
	{
		this.setPos(x + w * 0.1, y + h * 0.2);
		this.setSize(w * 0.8, h * 0.8);
	},
	
	occupy: function(frogger)
	{
		let sitPoint = this.getSitPoint();
		
		this.occupyingEntity = Game.addNew("Frogger_Base", frogger.id, sitPoint.x, sitPoint.y);
		
		frogger.score(50);
		frogger.respawn();
	},
	
	unoccupy: function()
	{
		this.occupyingEntity = undefined;
	},
	
	isOccupied: function()
	{
		return typeof this.occupyingEntity != "undefined";
	},
	
	setFly: function(fly)
	{
		this.fly = fly;
	},
	
	removeFly: function()
	{
		this.fly = undefined;
	},
	
	getFly: function()
	{
		return this.fly;
	},
	
	hasFly: function()
	{
		return !!this.fly;
	},
	
	getSitPoint: function()
	{
		return {
			x: this.x + this.w / 2,
			y: this.y + this.h * 0.45
		}
	},
	
	getBoundingRect: function()
	{
		let partialW = this.w * 0.75, partialH = this.h * 0.75;
		
		return {
			x: this.x + partialW / 2,
			y: this.y + partialH / 2,
			w: this.w - partialW,
			h: this.h - partialH
		};
	}
});