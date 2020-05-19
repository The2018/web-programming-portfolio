var port = 8888;

var httplibrary = require("http");
var urllibrary = require("url");
var pathlibrary = require("path");
var fslibrary = require("fs");
var appRoomBrowser = require("./appRoomBrowser");

var sessions = {};

var socketRouter, httpserver;

function start(){

	httpserver = httplibrary.createServer(function(request, response){
		httpRequestHandler(request,response);
	})

	httpserver.listen(port);
	console.log("server listening on port: "+port);

	appRoomBrowser.init();

	var socketlibrary = require("socket.io");
	socketRouter = socketlibrary.listen(httpserver);

	socketRouter.sockets.on('connection',function(socket){socketRequestHandler(socket);});
}

var extensions =	{
						".html": "text/html",
						".css": "text/css",
						".js": "application/javascript",
						".png": "image/png",
						".gif": "image/gif",
						".jpg": "image/jpeg",
						".eot":"font/opentype",
						".ttf":"font/opentype",
						".woff":"font/opentype",
						".svg":"image/svg+xml"
					};

function httpRequestHandler(request,response){

	var requestedURL = urllibrary.parse(request.url,true);
	var path = requestedURL.pathname;

	var filename = pathlibrary.basename(path) || "index.html";
	var ext = pathlibrary.extname(filename);
	var dir = pathlibrary.dirname(path);

	var localPath = 'final_project/';

	if (extensions[ext]){
		localPath += (dir ? (dir + "/" + filename):filename);

		fslibrary.exists(localPath, function(exists){
			if (exists){
				getFile(localPath,extensions[ext],response);
			}
			else{
				response.writeHead(404);
				response.end();
			}
		})
		
	}
}

function getFile(localPath,mimeType,response){
	fslibrary.readFile(localPath, function(err, contents){
		if (!err){
			response.writeHead(200, {
				"Content-Type": mimeType,
				"Content-Length": contents.length
			});
			response.end(contents);
		}
		else{
			response.writeHead(500);
			response.end();
		}
	});
}

function alreadyLoggedIn(sessions,username){
	for (var session_id in sessions){
		if (sessions.hasOwnProperty(session_id)){
			user = sessions[session_id];
			if (user.username == username)
				return true;
		}
	}
	return false;
}

function socketRequestHandler(socket){
	var sessionID = socket.id;
	console.log("client connected with socket id: "+sessionID);

	if(!sessions.hasOwnProperty(sessionID)){
		sessions[sessionID] = -1;
		socketRouter.to(sessionID).emit('resp_session_id_assigned',sessionID);
	}
	socket.on('req_login', function (clientData)
	{			
		console.log("Login requested for user: "+clientData.username);
		var newuser = appRoomBrowser.getUser(clientData);
		
		if (!alreadyLoggedIn(sessions, newuser.username)){
			console.log(newuser+" display");
			sessions[sessionID] = newuser;
			socketRouter.to(sessionID).emit('resp_login', newuser, appRoomBrowser.getRooms());	//resp_login - to a specific client	
		}
		else {
			socketRouter.to(sessionID).emit('resp_login', null, null, "User with this name is already logged in.");
		}		
	});	
	
	socket.on('req_new_room', function ()
	{
		console.log(sessions[sessionID].username +" new room ");
		var newRoom=appRoomBrowser.addRoom(sessions[sessionID].username );  //creates default room and adds to rooms hashtable, returns new room to the user		
		if (newRoom) {
			socket.join(newRoom.alias);
			socketRouter.sockets.emit('resp_browser_update',  appRoomBrowser.getRooms());	//resp_browser_update - to all clients
			socketRouter.to(sessionID).emit('resp_new_room', newRoom, null);	//resp_new_room - to a specific client 		
			
			
		}
		else {
			socketRouter.to(sessionID).emit('resp_new_room', null, 'User can create only one room' );	//resp_new_room - to a specific client 
		}
	});		
	
	socket.on('req_join_room', function (roomAlias)
	{
		var username = sessions[sessionID].username;
		var room=appRoomBrowser.joinRoom(roomAlias,username);
		if(room)
		{
			console.log(username +" joined room "+roomAlias);
			appRoomBrowser.users[username].assignedRoomAlias=roomAlias;
			socket.join(room.alias);		
			socketRouter.sockets.in(room.alias).emit('resp_room_update',room);
			socketRouter.to(sessionID).emit('resp_joined_room', room);	//resp_joined_room - to a specific client
			socket.emit('resp_browser_update',  appRoomBrowser.getRooms());	//resp_browser_update - to all clients			
		}
	});
	
	socket.on('req_leave_room', function (roomAlias)
	{
		var room=appRoomBrowser.rooms[roomAlias];
		var username = sessions[sessionID].username;
		var user = appRoomBrowser.users[username];
		
					
		console.log(sessions[sessionID].username +" left room ");
		if(room && room.players) // simplifying - room is deleted and needs to be recreated
		{
			for(var i = 0; i < room.players.length; i++) //when all disconnected, room will be cleared automaticlly				
					room.players[i].roomAlias="";
				
				
				
			appRoomBrowser.removeRoom(roomAlias);
			socketRouter.sockets.in(room.alias).emit('resp_room_deleted', appRoomBrowser.getRooms());							
			
		}
			
	});
	
	//USER DISCONNECTED
	socket.on('disconnect', function ()
	{
		var user=sessions[sessionID];
		
		if(user && user.username && appRoomBrowser.users[user.username] )
		{
			var roomAlias=user.assignedRoomAlias;
			//find if he was a part of a room
			if (roomAlias)
			{
				var room=appRoomBrowser.rooms[roomAlias];
				if (room) {
					for(var i = 0; i < room.players.length; i++) //when all disconnected, room will be cleared automaticlly
					{					
						room.players[i].roomAlias="";
					}	
				}
				appRoomBrowser.removeRoom(roomAlias);
							
				socketRouter.sockets.in(roomAlias).emit('resp_room_deleted',appRoomBrowser.getRooms());
				
			}
			appRoomBrowser.users[user.username].sessionID="";
		}
		delete sessions[sessionID];	
		console.log("DISCONNECTED USER username="+user.username+" session="+sessionID);
	});
	
	socket.on('req_start_game', function (roomAlias )
	{
		console.log("Game started in room " + roomAlias);
		var room=appRoomBrowser.startGameInRoom(roomAlias);
		socketRouter.sockets.in(roomAlias).emit('resp_start_game',room);				
	});

	socket.on('req_game_update', function (roomAlias, clientData )
	{
				console.log("req_game_update");

		var updatedData=appRoomBrowser.updateGameInRoom(roomAlias, clientData);

		socketRouter.sockets.in(roomAlias).emit('resp_updated_game',updatedData);				
	});	

	socket.on('req_restart_game', function (roomAlias )
	{
		var room=appRoomBrowser.rooms[roomAlias];
		room.game.startGame(roomAlias);
		
		var username = sessions[sessionID].username;
		appRoomBrowser.leaveGame (username);
		socketRouter.sockets.in(roomAlias).emit('resp_restart_game',room);				
	});

	socket.on('req_back_room_browser', function (roomAlias)  //destroyng the room
	{
		var room=appRoomBrowser.rooms[roomAlias];
		appRoomBrowser.removeRoom(roomAlias);
		socketRouter.sockets.in(room.alias).emit('resp_bacto_browser',appRoomBrowser.getRooms());
		for(var i = 0; i < room.players.length; i++) //when all disconnected, room will be cleared automaticlly
		{
			socketRouter.sockets.socket(room.players[i].sessionID).disconnect();
			room.players[i].roomAlias="";
		}
		
		socketRouter.sockets.emit('resp_browser_update',  appRoomBrowser.getRooms());	
	});	
}

exports.start = start;