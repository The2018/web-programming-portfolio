function Board(nStars)
{
	this.coordinates = new Array();
	for (var i = 0; i < nStars; i++){
		var x = Math.random() * 800;
		var y = Math.random() * 450;
		this.coordinates[i] = [x,y];
	}

	this.player_stars = [];

	this.mark_explored = function(x,y){
		this.player_stars.push([x,y]);
	}

	Board.prototype.reset = function(){
		this.player_stars = [];
	}

	Board.prototype.notInArray = function(arr1, arr2){
		var ans = [];
		console.log(arr1, arr2);
		for (var i = 0; i < arr1.length; i++){
			if ((arr2[0] != arr1[i][0]) && (arr2[1] != arr1[i][1]))
				ans[i] = false;
			else
				ans[i] = true;
		}
		console.log(ans);
		for (var i = 0; i < ans.length; i++){
			if (ans[i])
				return false;
		}
		return true;
	}
}