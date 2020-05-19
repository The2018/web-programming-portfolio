var Renderer = function(){
	Renderer.prototype.drawCircle = function(ctx, x, y){
		ctx.beginPath();
		ctx.arc(x, y, 5, 0, Math.PI*2);
		ctx.fillStyle = "white";
		ctx.fill();
	}

	Renderer.prototype.getCursorPosition = function(canvas, event){
		var rect = canvas.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;
		return [x,y];
	}

	Renderer.prototype.renderBoard = function(game, callback){
		var canvas = document.getElementById('gamecanvas');
		var ctx = canvas.getContext && canvas.getContext('2d');
		var render = this;

		var coordinates = game.board.coordinates;
		for (var i = 0; i < 24; i++){
			this.drawCircle(ctx, coordinates[i][0], coordinates[i][1]);
		}

		var fuelcanvas = document.getElementById("fuelcanvas");
		var fuelctx = fuelcanvas.getContext && fuelcanvas.getContext('2d');

		var img = new Image();
		img.src = "./img/fuel.png";
		img.onload = function(){
			fuelctx.drawImage(img,0,0,240,25,0,0,240,25);
			fuelctx.drawImage(img,0,30,240,25,0,40,240,25);
		}
		var arr = new Array();
		canvas.addEventListener('click', function(e){
			arr = render.getCursorPosition(canvas, e);
			callback(arr[0],arr[1]);
		})
	}

	Renderer.prototype.renderHome = function(cor_x, cor_y, currentPlayerID){
		var canvas = document.getElementById('gamecanvas');
		var ctx = canvas.getContext && canvas.getContext('2d');

		var color = ["orange", "cyan"];
		ctx.beginPath();
		ctx.arc(cor_x, cor_y, 20, 0, Math.PI*2);
		ctx.strokeStyle = color[currentPlayerID];
		ctx.lineWidth = 5;
		ctx.stroke();
	}

	Renderer.prototype.renderTravel = function(cor_x, cor_y, currentPlayerID){
		var canvas = document.getElementById('gamecanvas');
		var ctx = canvas.getContext && canvas.getContext('2d');

		var color = ["orange", "cyan"];
		ctx.beginPath();
		var player = game.players[currentPlayerID];
		var enemy = game.players[1-currentPlayerID];

		var length = player.stars.length;

		ctx.moveTo(player.stars[length-2][0], player.stars[length-2][1]);
		ctx.lineTo(player.stars[length-1][0], player.stars[length-1][1]);
		ctx.strokeStyle = color[currentPlayerID];
		ctx.lineWidth = 5;
		ctx.stroke();

		var fuelcanvas = document.getElementById("fuelcanvas");
		var fuelctx = fuelcanvas.getContext && fuelcanvas.getContext('2d');

		var img = new Image();
		img.src = "./img/fuel.png";
		img.onload = function(){
			if (currentPlayerID == 0){
				fuelctx.clearRect(0,0,240,25);
				fuelctx.drawImage(img,0,0,player.fuel*20,25,0,0,player.fuel*20,25);
			}
			else{
				fuelctx.clearRect(0,30,240,35);
				fuelctx.drawImage(img,0,30,player.fuel*20,25,0,40,player.fuel*20,25);
			}
		}


		// var fuel_tbs = document.getElementsByClassName("fuel");
		// var fuel_tb = fuel_tbs[currentPlayerID];
		// var tr = fuel_tb.rows[0];

		// if (player.fuel >= 0){
		// 	for (var i = player.fuel; i < 12; i++){
		// 		tr.cells[i].innerHTML = " ";
		// 	}
		// } else{
		// 	for (var i = 0; i < 12; i++){
		// 		tr.cells[i].innerHTML = " ";
		// 	}
		// }
	}

	Renderer.prototype.gameOver = function(winner){
		var canvas = document.getElementById('gamecanvas');
		var ctx = canvas.getContext && canvas.getContext('2d');
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		ctx.font = "bold 3em bangers";
		if (winner)
			ctx.fillText("Game over. Winner: "+winner,canvas.width/2,canvas.height/2);
		else
			ctx.fillText("Game over. Draw",canvas.width/2,canvas.height/2);
	}

	Renderer.prototype.displayTurn = function(name, currentPlayerID){
		var turnElem = document.getElementById("stateManager");

		var color = ["orange", "cyan"];
		turnElem.setAttribute("style","color:"+color[currentPlayerID]);

		turnElem.innerHTML = "Turn: " + name;
	}

	Renderer.prototype.reset = function(){
		var canvas = document.getElementById('gamecanvas');
		var ctx = canvas.getContext && canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		var fuel_tbs = document.getElementsByClassName("fuel");
		var fuel_tb = fuel_tbs[0];
		var tr = fuel_tb.rows[0];
		var tr_2 = fuel_tbs[1].rows[0];

		for (var i = 0; i < 12; i++){
			tr.cells[i].innerHTML = "X";
			tr_2.cells[i].innerHTML = "X";
		}
	}
}