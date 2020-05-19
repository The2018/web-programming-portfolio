const STATE_DISCONNECTED = "disconnected";
const STATE_CONNECTED = "connected";
const STATE_ROOM_BROWSER = "roombrowser";
const STATE_IN_ROOM = "inroom";
const STATE_IN_GAME = "ingame";
 
var appClient = 
{
	state:STATE_DISCONNECTED,
	me: null,
	room: null,
	game:null,

	enterGame: function(){
		var canvas = document.getElementById("entry");
		var ctx = canvas.getContext && canvas.getContext('2d');

		// var image = new Image();
		// image.src = 'img/background.jpg';

		// image.onload = function(){
		// ctx.drawImage(image, 0, 0, 600, 400);
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		ctx.font = "bold 3em bangers";
		ctx.fillText("Surveyors of the Galaxy",300,150);

		ctx.font = "bold 2em bangers";
		ctx.fillText("click to start",300,280);
	// }

		document.addEventListener("click",function(){
			var div = document.getElementById("canvas-container");
			
			if (div.innerHTML !== ""){
				var login = document.getElementById("login");
				var html = 	"<section>"+
					"<h2>Login</h2>"+
					"<form>"+
					"<p class='logintext' style='font-size: 13px; color:white;'>Username</p>"+
					"<input id='username' type='text'>"+
					"<p class='emailtext' style='font-size: 13px; color:white;'>Email</p>"+
					"<input id='email' type='email'>"+
					"<div class='clearfix'></div>"+
					"<div class='button'><span onclick='clientConnectionManager.requestLogin()''>Sign in</span></div>"+
					"<div class='clearfix'></div>"+
					"<p id='loginerror' class='error' style='color:white'>&nbsp;</p>"+
					"</form>"+
					"</section>";
				login.innerHTML += html;
			}
			div.innerHTML = "";
		});
	},
	
	displayRooms: function (rooms)
	{
		var browserElem = document.getElementById ("roomBrowser");
		
		var html='<h2>Room Browser</h2>';
		html+= '<div class="clear"></div>';
		console.log(rooms);
		for(var alias in rooms){
				var currentRoom = rooms [alias];
				if(currentRoom)
				{
					if(currentRoom.status === "open")
						html+= '<p class="room"><input type="radio" id="rooms" name="rooms" value="'+alias + '" /><strong>' + currentRoom.title + '</strong>: '+ currentRoom.players.length + ' players. '+currentRoom.status + '</p>';
					else  //cannot join -  do not display radio button	
						html+= '<p class="room"><strong>' + currentRoom.title + '</strong>: '+ currentRoom.players.length + ' players. '+currentRoom.status + '</p>';
				}					
		}
		
		html+=	'<div id="buttons">'+
					'<span class="button" onclick="clientConnectionManager.requestNewRoom()" title="Start new room"><span class="icon-user-plus">New</span></span> '+
					'<span class="button" onclick="clientConnectionManager.requestJoinRoom()" title="Join selected room"><span class="icon-plus">Join</span></span> '+
				'</div>';
		browserElem.innerHTML = html;
	},
	
	displayLoginError: function(msg)
	{
		var loginErrElem = document.getElementById ("loginerror");		
		loginErrElem.innerHTML = msg;
		document.getElementById("username").value = "";
	},
	
	hideLoginPane: function()
	{
		var loginElem = document.getElementById ("login");
		
		loginElem.innerHTML = "";
	},
	
	hideRoomBrowser: function()
	{
		var browserElem = document.getElementById ("roomBrowser");
		
		browserElem.innerHTML = "";
	},
	
	hideGameHTML: function ()
	{
		var gameElem = document.getElementById ("board");		
		gameElem.innerHTML = "";
	},
	
	displayRoom: function (newRoom)
	{
		this.room = newRoom;
		var browserElem = document.getElementById ("roomBrowser");
		
		var html='<h2>'+newRoom.title +'</h2>';
		html +='<div class="clear"></div>';
		
		html +='<div class="room">Room status: <em>'+newRoom.status +'</em> <br>Total players: '+newRoom.players.length+'</div>';
		
		html+='<div id="buttons">'+						
				'<span class="button" onclick="clientConnectionManager.requestStartGame()" title="Start game"><span class="icon">S</span></span>'+ 
				'<span class="button" onclick="clientConnectionManager.requestLeaveRoom()" title="Leave room"><span class="icon">N</span></span>'+
			'</div>';
		browserElem.innerHTML = html;
	},

	displayGame: function()
	{
		var sidebar = document.getElementById("fuelbar");

		var html = "<section>"+
		"<canvas id='fuelcanvas' width='400' height='200'></canvas>"+
		"</section>";

		sidebar.innerHTML += html;

		var bottombar = document.getElementById("bottombar");

		var html2 = 	"<section>"+
		"<span class='button'><span class='icon' onclick='clientConnectionManager.requestRestartGame()'>R</span></span> "+
		"<span class='button'><span class='icon' onclick='game.pauseGame()'>P</span></span> "+
		"<span class='button'><span class='icon' onclick='clientConnectionManager.requestBacktoRoomBrowser()'>N</span></span>"+
		"<div class='clearfix'> "+
	"</section>";

		bottombar.innerHTML = html2;

		var canvas = document.getElementById("board");
		var html3 = 	"<section>"+
		"<div id='stateManager' class='display' style='color:white'></div>"+
		"<div id='canvas-container' class='stage'>"+
		"<canvas id='gamecanvas' width='800' height='450'></canvas>"+
		"</div>"+
	"</section>";

		canvas.innerHTML = html3;

	},
	
	getSelectedRoomAlias: function ()
	{
		var radioButtons = document.getElementsByName('rooms');
		if(!radioButtons)
			return null;
        for(var k=0;k<radioButtons.length;k++)
		{
			if(radioButtons[k].checked){
				return radioButtons[k].value;
			}
		}
		return null;
	},
	
	setupGame: function (roomplayers,roomboard)
	{
		this.game = game;
		this.game.init (roomplayers,roomboard);
	}
};