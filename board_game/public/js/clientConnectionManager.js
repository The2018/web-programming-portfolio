var clientConnectionManager = 
{
	socket:null,

	init:function(){
		this.socket = io.connect();

		appClient.enterGame();
		
		this.socket.on("resp_session_id_assigned", function(sessionID){
			appClient.clientState = STATE_CONNECTED;
			console.log("my client id is: "+sessionID);
		});

		this.socket.on ('resp_login', function(user,rooms,error)   //returns user object+rooms
			{ 	
				console.log(user, rooms, error);												
				if(!error)
				{
					console.log (user.username);
					appClient.me = user;  //here can write to cookie, to remember on next time connect
					appClient.clientState = STATE_ROOM_BROWSER;
					appClient.hideLoginPane();
					appClient.displayRooms(rooms);	
				}
				else
				{
					appClient.displayLoginError(error);
				}
			}
		);	

		this.socket.on('resp_new_room', function(newRoom, error) 
			{ 													
				if(!error)
				{
					console.log("Inside resp_new_room: created new room for "+appClient.me.username);	
					appClient.room = newRoom;
					appClient.displayRoom(newRoom);	
					appClient.clientState = STATE_IN_ROOM;	
				}
				else {
					alert(error);
				}
			}
		);	
		
		this.socket.on('resp_browser_update', function(rooms) 
			{ 
				console.log("Received notification abour new rooms");	
				if(appClient.clientState === STATE_ROOM_BROWSER)
				{
					console.log("resp_browser_update");		
					appClient.displayRooms(rooms);	
				}				
			}
		);	
		
		this.socket.on('resp_left_room', function(rooms) 
			{ 													
				
				if(appClient.clientState === STATE_IN_ROOM)
				{
					console.log("resp_left_room"+appClient.me.username);
					appClient.clientState = STATE_ROOM_BROWSER;
					appClient.room  = null;
					appClient.displayRooms(rooms);	
				}				
			}
		);	
		
		this.socket.on('resp_joined_room', function(joinedRoom)
			{
				console.log("resp_joined_room"+appClient.me.username);
				appClient.room = joinedRoom;
				appClient.displayRoom(joinedRoom);	
				appClient.clientState = STATE_IN_ROOM;	
			}
		);	
		
		this.socket.on('resp_room_update', function(updatedRoom)
			{
				
				if(appClient.clientState === STATE_IN_ROOM)
				{
					console.log("resp Room update"+appClient.me.username);
					appClient.room = updatedRoom;					
					appClient.displayRoom(updatedRoom);						
				}
			}
		);	
		
		this.socket.on('resp_room_deleted', function(rooms)
			{
				
				console.log("Client state is: "+appClient.clientState);
				
				console.log("room deleted");
				appClient.clientState = STATE_ROOM_BROWSER;
				appClient.room = null;
				appClient.displayRooms(rooms);
				appClient.hideGameHTML();					
			}
		);	
		
		this.socket.on('resp_start_game', function(gameroom)  
			{	
				if(appClient.clientState === STATE_IN_ROOM)
				{	
					appClient.room = gameroom;
					appClient.displayGame();
					console.log("gameroom="+JSON.stringify(gameroom));
					console.log("players="+JSON.stringify(gameroom.players));
					appClient.setupGame (gameroom.players,gameroom.game.board); 					
					appClient.hideRoomBrowser();					
					appClient.clientState = STATE_IN_GAME;
				}
			}
		);	

		this.socket.on('resp_updated_game', function(updatedData)   
			{ 
				console.log("resp_updated_game",updatedData);
				if(appClient.clientState === STATE_IN_GAME)
				{					
					appClient.game.changeGameState(updatedData["x"], updatedData["y"], updatedData["state"], updatedData["currentPlayerID"]);
				}
			}
		);
				
		this.socket.on('resp_restart_game', function()   //
			{ 
				if(appClient.clientState === STATE_IN_GAME)
				{	
					appClient.game.restartGame();
				}
			}
		);	

		this.socket.on('resp_bacto_browser', function(rooms) 
			{	
				if(appClient.clientState === STATE_IN_GAME)
				{	
					appClient.clientState = STATE_ROOM_BROWSER;
					
					appClient.room = null;
					appClient.game = null;
					appClient.hideGameHTML();
					appClient.displayRooms(rooms);
				}
								
			}
		);		
	},	

	requestLogin: function ()  //ends up in roomBrowser panel on success, or the same login screen with errors
	{
		var userName = document.getElementById("username").value;
		if (!userName)
			alert ("Enter your name to login");
		var userData = {"username":userName};
		
		console.log(userData);
		this.socket.emit('req_login',userData);
		
	},	
	
	requestNewRoom: function()
	{
		this.socket.emit('req_new_room');		
	},
		
	requestRoomBrowser: function()
	{
		this.socket.emit('req_room_browser'); 		
	},
	
	requestJoinRoom: function()
	{
		var roomAlias = appClient.getSelectedRoomAlias();
		if(roomAlias) //quitely ignore mindless pressing
		{
			this.socket.emit('req_join_room',roomAlias);
		}										
	},
	
	requestLeaveRoom: function()
	{
		this.socket.emit('req_leave_room',appClient.room.alias);
		appClient.clientState = STATE_ROOM_BROWSER;
	},
	
	requestStartGame: function ()
	{
		console.log("start game");
		if(appClient.room && appClient.room.status === "full" && appClient.room.players[0].username === appClient.me.username)
		{
			this.socket.emit('req_start_game',appClient.room.alias);
		}
	},	
	
	requestUpdateGameState: function(x,y)
	{
		console.log("appClient.game.state ="+appClient.game.state );
		if(appClient.game.state !== 1)
			return;

		if(appClient.game.players[appClient.game.turnManager.currentPlayerID].name === appClient.me.username){
			console.log(x,y);
			clientConnectionManager.socket.emit('req_game_update', appClient.room.alias,{"x":x,"y":y});
		
		}
	},
	
	requestRestartGame: function()
	{
		this.socket.emit('req_restart_game',appClient.room.alias);
	},
	
	requestBacktoRoomBrowser: function()
	{
		this.socket.emit('req_back_room_browser', appClient.room.alias); 		
	}
}