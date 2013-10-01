/*global Worker, L*/
(function (L) {
	"use strict";
	var worker, map, osmLayer, mapQuestOsmLayer, mapQuestOALayer, openCycleMapLayer, ocmTransportLayer, ocmLandscapeLayer, ocmOutdoorsLayer, layer;

	osmLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
		maxZoom: 18
	});

	mapQuestOsmLayer = L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', {
		subdomains: ["otile1", "otile2", "otile3", "otile4"],
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' + 
			'<p>Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"></p>',
		maxZoom: 18
	});

	mapQuestOALayer = L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
		subdomains: ["otile1", "otile2", "otile3", "otile4"],
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' +
			'<p>Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"></p>',
		maxZoom: 18
	});

	mapQuestOALayer = L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
		subdomains: ["otile1", "otile2", "otile3", "otile4"],
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' +
			'<p>Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"></p>',
		maxZoom: 18
	});

	openCycleMapLayer = L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' +
			'<p>Tiles Courtesy of <a href="http://www.thunderforest.com/" target="_blank">Thunderforest</a></p>',
		maxZoom: 18
	});

	ocmTransportLayer = L.tileLayer('http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' +
			'<p>Tiles Courtesy of <a href="http://www.thunderforest.com/" target="_blank">Thunderforest</a></p>',
		maxZoom: 18
	});

	ocmLandscapeLayer = L.tileLayer('http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' +
			'<p>Tiles Courtesy of <a href="http://www.thunderforest.com/" target="_blank">Thunderforest</a></p>',
		maxZoom: 18
	});

	ocmOutdoorsLayer = L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' +
			'<p>Tiles Courtesy of <a href="http://www.thunderforest.com/" target="_blank">Thunderforest</a></p>',
		maxZoom: 18
	});

	map = L.map('map', {
		center: [47.41322033015946, -120.80566406246835],
		zoom: 7,
		layers: [osmLayer]
	}).locate({ setView: true, maxZoom: 16 });

	L.control.layers({
		OpenStreetMap: osmLayer, 
		"MapQuest OSM": mapQuestOsmLayer,
		"MapQest Open Aerial": mapQuestOALayer,
		"OpenCycleMap": openCycleMapLayer,
		"OpenCycleMap Transport": ocmTransportLayer,
		"OpenCycleMap Landscape": ocmLandscapeLayer,
		"OpenCycleMap Outdoors": ocmOutdoorsLayer
	}).addTo(map);


	function setupWebWorker() {
		worker = new Worker("Scripts/task.js");

		worker.addEventListener("message", function (oEvent) {
			var geoJson = oEvent.data;
			if (layer) {
				map.removeLayer(layer);
			}
			if (geoJson) {
				layer = L.geoJson(geoJson, {
					pointToLayer: function (feature, latLng) {
						var priority = feature.properties.Priority, color;

						color = priority === "Highest" ? "#FF0000"
							: priority === "High" ? "#550000"
							: priority === "Medium" ? "#FFFF00"
							: priority === "Low" ? "#00FF00"
							: priority === "Lowest" ? "#00CC00"
							: "#FFFFFF";
						return L.circleMarker(latLng, {
							radius: 8,
							fillColor: color,
							weight: 1,
							opacity: 1,
							fillOpacity: 0.8
						});
					},
					onEachFeature: function (feature, layer) {
						layer.bindPopup(feature.properties.HeadlineDescription);
					}
				}).addTo(map);
			}
		}, false);

		worker.postMessage("It doesn't really matter what this message is.");
	}

	setupWebWorker();
}(L));