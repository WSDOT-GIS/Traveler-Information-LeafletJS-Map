/*global Worker, L*/
(function (L) {
	"use strict";
	var worker, map, layer;

	map = L.map('map').setView([47.41322033015946, -120.80566406246835], 7).locate({setView: true, maxZoom: 16});

	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
		maxZoom: 18
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