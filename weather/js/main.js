window.onload = init;

function init(){
	var btn = document.getElementById("search");
	btn.addEventListener("click", search, false);
}


function search(){
	var searchCity = document.getElementById("searchCity");
	var city = searchCity.value;

	var searchLocation = document.getElementById("searchLocation");
	var loc = searchLocation.value.split(",");

	if (city){
		var url = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&callback=forecast&appid=cf9c92d100b847d59baeb5661fa5be5f";
		var head = document.getElementsByTagName("head")[0];

		var newScript = document.createElement("script");
		newScript.setAttribute("src", url);
		newScript.setAttribute("id", "searchForecast");
		head.appendChild(newScript);

		var url2 = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&callback=weather&appid=cf9c92d100b847d59baeb5661fa5be5f";

		var newScript2 = document.createElement("script");
		newScript2.setAttribute("src", url2);
		newScript2.setAttribute("id", "searchWeather");
		head.appendChild(newScript2);

		searchMap();
		// var url3 = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&callback=searchMap&appid=c178f3442616620894cea11152a37935";

		// var newScript3 = document.createElement("script");
		// newScript3.setAttribute("src", url3);
		// newScript3.setAttribute("id", "searchMap");
		// head.appendChild(newScript3);

	} else if (loc.length!=0){
		console.log(loc);
		loc[0] = loc[0].trim();
		loc[1] = loc[1].trim();
		console.log(loc);

		var url2 = "https://api.openweathermap.org/data/2.5/weather?lat="+loc[0]+"&lon="+loc[1]+"&callback=weather&appid=c178f3442616620894cea11152a37935";

		var newScript2 = document.createElement("script");
		newScript2.setAttribute("src", url2);
		newScript2.setAttribute("id", "searchWeather");
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(newScript2);

		var url = "https://api.openweathermap.org/data/2.5/forecast?lat="+loc[0]+"&lon="+loc[1]+"&callback=forecast&appid=c178f3442616620894cea11152a37935";

		var newScript = document.createElement("script");
		newScript.setAttribute("src", url);
		newScript.setAttribute("id", "searchForecast");
		head.appendChild(newScript);
	} else{
		alert("Invalid input");
	}
}