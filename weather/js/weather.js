function weather(data){
	if (!document.getElementById(data.name)){
		var totalWindow = document.createElement("div");
		totalWindow.setAttribute("id",data.name);

		var updateWindow = document.getElementById("update");

		var weatherWindow = document.createElement("div");

		var title = document.createElement("h1");
		title.innerHTML = "Weather";

		var city = document.createElement("h2");
		city.innerHTML = data.name;

		var div = document.createElement("div");
		div.setAttribute("style","width:20%;margin:0px;float:left");

		var weather = document.createElement("img");
		// weather.innerHTML = data.weather[0].main;
		weather.setAttribute("src","http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png");
		weather.setAttribute("style", "text-align:left");

		var temp = document.createElement("h3");
		temp.innerHTML = (data.main.temp-273.15).toFixed(1)+"\xB0C";

		var div2 = document.createElement("div");
		div2.setAttribute("style","width:40%;padding-left:40px;margin:0px;float:left;font-size:25px");
		var output = "";

		output += ("weather: "+data.weather[0].description+"&emsp;");
		output += ("pressure: "+data.main.pressure+"<br>");
		output += ("humidity: "+data.main.humidity+"&emsp;&emsp;");
		output += ("wind speed: "+data.wind.speed+"<br>");
		div2.innerHTML = output;

		weatherWindow.appendChild(document.createElement("hr"));
		weatherWindow.appendChild(title);
		weatherWindow.appendChild(city);			
		div.appendChild(weather);
		div.appendChild(temp);
		weatherWindow.appendChild(div);
		weatherWindow.appendChild(div2);

		totalWindow.appendChild(weatherWindow);
		updateWindow.appendChild(totalWindow);
	}else{
		alert("The weather of "+data.name+" is already displayed");
	}
}