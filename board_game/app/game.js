const NO_GAME = 0;
const IN_GAME = 1;
const WIN_STATE = 2;
const DRAW_STATE = 3;
const PAUSE_STATE = 4;
const RESTART_STATE = 5;

function Game() {
	this.state = 0;
	this.players = [];

	Game.prototype.init = function(roomPlayers){
		var player = require("./player");
		this.players[0] = new player.Player(1, roomPlayers[0].username);
		this.players[1] = new player.Player(2, roomPlayers[1].username);
		this.currentPlayerID = 0;
	},

	Game.prototype.turnManager = function() {
		this.nextPlayer = function(){
			this.currentPlayerID = 1 - this.currentPlayerID;
		}
	},

	Game.prototype.startGame = function(){
		var board = require("./board");
		this.board = new board.Board(24);

		this.state = IN_GAME;
		this.currentPlayerID = 0;
	},

	Game.prototype.update = function(clientData){
		if (this.state != IN_GAME)
			return;

		var x = clientData.x;
		var y = clientData.y;

		var cor_x = 0;
		var cor_y = 0;


		for (var i = 0; i < this.board.coordinates.length; i++){
			if ((x < this.board.coordinates[i][0] + 10) && (x > this.board.coordinates[i][0] - 10) &&
			(y < this.board.coordinates[i][1] + 10) && (y > this.board.coordinates[i][1] - 10)){
				cor_x = this.board.coordinates[i][0];
				cor_y = this.board.coordinates[i][1];
				break;
			}
		}

		console.log(this.board.player_stars, this.board.notInArray(this.board.player_stars, [cor_x, cor_y]));
		if (cor_x && cor_y && (this.board.notInArray(this.board.player_stars, [cor_x, cor_y])))
		{
			var currentPlayerID = this.currentPlayerID;
			var curPlayer = this.players[currentPlayerID];
			console.log(currentPlayerID+" from game.js");

			clientData["currentPlayerID"] = 1-this.currentPlayerID;

			// if (curPlayer.home.length == 0){
			// 	curPlayer.setHome(cor_x, cor_y);
			// 	this.board.mark_explored(cor_x, cor_y);
			// 	this.turnManager.nextPlayer();
			// }
			// if (curPlayer.fuel <= 0){
			// 	this.turnManager.nextPlayer();

			// 	if (this.players[this.turnManager.currentPlayerID].fuel <= 0)
			// 		this.gameOver();
			// } 
			// else{
			// 	curPlayer.travel(cor_x, cor_y);
			// 	this.board.mark_explored(cor_x, cor_y);

			// 	if (this.players[1-currentPlayerID].fuel > 0){
			// 		this.renderer.displayTurn(this.players[1-this.turnManager.currentPlayerID].name);
			// 		this.turnManager.nextPlayer();
			// 	}
			// 	else{
			// 		this.renderer.displayTurn(this.players[this.turnManager.currentPlayerID].name);
			// 	}
			// }
		}
		else{
			clientData["currentPlayerID"] = this.currentPlayerID;
		}
		clientData["state"] = this.state;
		clientData["x"] = cor_x;
		clientData["y"] = cor_y;
		console.log("Hello"+this.board.player_stars+this.board.notInArray(this.board.player_stars, [cor_x, cor_y]));

		return clientData;
	},

	Game.prototype.gameOver = function(){
		var score1 = this.players[0].stars.length;
		var score2 = this.players[1].stars.length;
		if (score1 == score2)
			this.renderer.gameOver();
		else if (score1 < score2)
			this.renderer.gameOver(this.players[1].name);
		else
			this.renderer.gameOver(this.players[0].name);
	}

}

exports.game = Game;