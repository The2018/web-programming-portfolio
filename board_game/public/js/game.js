const NO_GAME = 0;
const IN_GAME = 1;
const WIN_STATE = 2;
const DRAW_STATE = 3;
const PAUSE_STATE = 4;
const RESTART_STATE = 5;

var game = {
	state: 0,
	players: [],

	turnManager: {
		currentPlayerID: 0,
		nextPlayer: function(){
			this.currentPlayerID = 1 - this.currentPlayerID;
		}
	},

	init: function(players, board){
		this.board = board;

		this.state = IN_GAME;
		this.renderer = new Renderer();

		this.players[0] = new Player(1,players[0].username);
		this.players[1] = new Player(2, players[1].username);

		this.renderer.renderBoard(this, clientConnectionManager.requestUpdateGameState);

		this.renderer.displayTurn(game.players[0].name, game.players[0].id-1);

	},

	restartGame: function(){
		this.board.player_stars = [];
		this.players[0].reset();
		this.players[1].reset();
		this.currentPlayerID = 0;

		this.renderer.reset();
		this.renderer.renderBoard(this, clientConnectionManager.requestUpdateGameState);

		this.renderer.displayTurn(game.players[0].name, game.players[0].id-1);
	},

	pauseGame: function(){
		(this.state == IN_GAME) ? this.state = PAUSE_STATE : this.state = IN_GAME;
	},

	quitGame: function(){
		this.state = NO_GAME;
		this.players = [];
		this.board.coordinates = [];
		var stateManager = document.getElementById("stateManager");
		stateManager.innerHTML = "";

		this.renderer.reset();
	},

	notInArray: function(arr1,arr2){
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
	},



	update: function(x, y){
		if (game.state != IN_GAME)
			return;

		var cor_x = x;
		var cor_y = y;

		for (var i = 0; i < game.board.coordinates.length; i++){
			if ((x < game.board.coordinates[i][0] + 10) && (x > game.board.coordinates[i][0] - 10) &&
			(y < game.board.coordinates[i][1] + 10) && (y > game.board.coordinates[i][1] - 10)){
				cor_x = game.board.coordinates[i][0];
				cor_y = game.board.coordinates[i][1];
				// if (turn)
				// 	clientConnectionManager.requestUpdateGameState(x,y);
				break;
			}
		}

		console.log(game.board);
		if (cor_x && cor_y && (game.notInArray(game.board.player_stars, [cor_x, cor_y])))
		{
			var currentPlayerID = game.turnManager.currentPlayerID;
			var curPlayer = game.players[currentPlayerID];
			console.log(game.board.player_stars);

			if (curPlayer.home.length == 0){
				curPlayer.setHome(cor_x, cor_y);
				game.board.player_stars.push([cor_x, cor_y]);

				game.renderer.renderHome(cor_x, cor_y, game.turnManager.currentPlayerID);
				game.renderer.displayTurn(game.players[1-game.turnManager.currentPlayerID].name, 1-game.turnManager.currentPlayerID);
				game.turnManager.nextPlayer();
			}
			else if (curPlayer.fuel <= 0){
				game.turnManager.nextPlayer();
				game.renderer.displayTurn(game.players[1-game.turnManager.currentPlayerID].name, 1-game.turnManager.currentPlayerID);

				if (game.players[game.turnManager.currentPlayerID].fuel <= 0)
					game.gameOver();
			} 
			else{
				curPlayer.travel(cor_x, cor_y);
				game.renderer.renderTravel(cor_x, cor_y, game.turnManager.currentPlayerID);
				game.board.player_stars.push([cor_x, cor_y]);

				if (game.players[1-currentPlayerID].fuel > 0){
					game.renderer.displayTurn(game.players[1-game.turnManager.currentPlayerID].name, 1-game.turnManager.currentPlayerID);
					game.turnManager.nextPlayer();
				}
				else{
					game.renderer.displayTurn(game.players[game.turnManager.currentPlayerID].name, game.turnManager.currentPlayerID);
				}
			}
		}
	},

	changeGameState: function(x,y,state,currentPlayerID){
		this.state = state;

		this.update(x,y);

		this.currentPlayerID = currentPlayerID;
	},

	gameOver: function(){
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