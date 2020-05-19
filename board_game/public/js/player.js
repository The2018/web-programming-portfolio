var Player = function(playerID, playerName)
{
	this.id = playerID;
	this.name = playerName;
	this.stars = new Array();
	this.fuel = 12;
	this.event = [0,0,0,0,0,0];
	this.home = new Array();

	this.setHome = function(x,y){
		this.home.push([x,y]);
		this.stars.push([x,y]);
	}

	this.travel = function(x,y){
		var old_star = this.stars[this.stars.length-1];
		var new_star = [x,y];
		this.stars.push([x,y]);
		var distance = Math.sqrt(Math.pow((new_star[0] - old_star[0]),2)+
								Math.pow((new_star[1] - old_star[1]),2));
		this.fuel -= Math.ceil(distance/96);
	}

	this.reset = function(){
		this.stars = [];
		this.fuel = 12;
		this.home = [];
	}
}