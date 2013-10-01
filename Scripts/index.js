/*global L*/
(function (L) {
	"use strict";
	var worker, map, layer;

	map = L.map('map').setView([47.41322033015946, -120.80566406246835], 7);

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
				layer = L.geoJson(geoJson).addTo(map);
			}
		}, false);

		worker.postMessage("It doesn't really matter what this message is.");
	}

	// TODO start up web worker when map has loaded.
	setupWebWorker();
}(L));