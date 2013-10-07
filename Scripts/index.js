/*global Worker, require, requirejs*/
/*jslint browser:true, regexp:true*/

requirejs.config({
	baseUrl: "Scripts",
	paths: {
		leaflet: "//cdn.leafletjs.com/leaflet-0.6.4/leaflet"
	}
});

require(["leaflet", "alertUtils"], function (L, alertUtils) {
	"use strict";
	var worker, map, osmLayer, mapQuestOsmLayer, mapQuestOALayer, openCycleMapLayer, ocmTransportLayer, ocmLandscapeLayer, ocmOutdoorsLayer, osmAttrib, mqAttrib, ocmAttrib, layerList;

	// Define attribution strings that are common to multiple basemap layers.
	osmAttrib = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
	mqAttrib = osmAttrib + '<p>Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"></p>';
	ocmAttrib = osmAttrib + '<p>Tiles Courtesy of <a href="http://www.thunderforest.com/" target="_blank">Thunderforest</a></p>';

	osmLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: osmAttrib,
		maxZoom: 18
	});

	mapQuestOsmLayer = L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', {
		subdomains: ["otile1", "otile2", "otile3", "otile4"],
		attribution: mqAttrib,
		maxZoom: 18
	});

	mapQuestOALayer = L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
		subdomains: ["otile1", "otile2", "otile3", "otile4"],
		attribution: mqAttrib,
		maxZoom: 18
	});

	mapQuestOALayer = L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
		subdomains: ["otile1", "otile2", "otile3", "otile4"],
		attribution: mqAttrib,
		maxZoom: 18
	});

	openCycleMapLayer = L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
		attribution: ocmAttrib,
		maxZoom: 18
	});

	ocmTransportLayer = L.tileLayer('http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png', {
		attribution: ocmAttrib,
		maxZoom: 18
	});

	ocmLandscapeLayer = L.tileLayer('http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png', {
		attribution: ocmAttrib,
		maxZoom: 18
	});

	ocmOutdoorsLayer = L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {
		attribution: ocmAttrib,
		maxZoom: 18
	});


	map = L.map('map', {
		center: [47.41322033015946, -120.80566406246835],
		zoom: 7,
		layers: [osmLayer]
	}).locate({ setView: true, maxZoom: 16 });

	layerList = L.control.layers({
		OpenStreetMap: osmLayer,
		"MapQuest OSM": mapQuestOsmLayer,
		"MapQest Open Aerial": mapQuestOALayer,
		"OpenCycleMap": openCycleMapLayer,
		"OpenCycleMap Transport": ocmTransportLayer,
		"OpenCycleMap Landscape": ocmLandscapeLayer,
		"OpenCycleMap Outdoors": ocmOutdoorsLayer
	}).addTo(map);






	function setupAlertsWorker() {
		var layer, signIcons;
		worker = new Worker("Scripts/alerts_task.js");
		signIcons = new alertUtils.SignIcons();


		function pointToLayer(feature, latLng) {
			var icon;
			icon = signIcons.GetIcon(feature);
			return L.marker(latLng, { icon: icon });
		}

		function onEachFeature(feature, layer) {
			layer.bindPopup(alertUtils.createAlertContent(feature));
		}

		function createGeoJsonLayer(geoJson) {
			return L.geoJson(geoJson, {
				pointToLayer: pointToLayer,
				onEachFeature: onEachFeature
			});
		}

		worker.addEventListener("message", function (oEvent) {
			var geoJson = oEvent.data;

			if (geoJson) {
				if (!layer) {
					layer = createGeoJsonLayer(geoJson).addTo(map);
					layerList.addOverlay(layer, "Alerts");
				}
				else {
					layer.clearLayers();
					layer.addLayer(createGeoJsonLayer(geoJson));
				}

			}
		}, false);

		worker.postMessage("It doesn't really matter what this message is.");
	}

	function setupTrafficFlowWorker() {
		worker = new Worker("Scripts/trafficflow_task.js");

		function pointToLayer(feature, latLng) {
			var icon;
			icon = signIcons.GetIcon(feature);
			return L.marker(latLng, { icon: icon });
		}

		function onEachFeature(feature, layer) {
			layer.bindPopup(alertUtils.createAlertContent(feature));
		}

		function createGeoJsonLayer(geoJson) {
			return L.geoJson(geoJson, {
				pointToLayer: pointToLayer,
				onEachFeature: onEachFeature
			});
		}

		worker.addEventListener("message", function (oEvent) {
			var geoJson = oEvent.data;

			if (geoJson) {
				console.log("traffic flow", geoJson);
				////if (!layer) {
				////	layer = createGeoJsonLayer(geoJson).addTo(map);
				////	layerList.addOverlay(layer, "Alerts");
				////}
				////else {
				////	layer.clearLayers();
				////	layer.addLayer(createGeoJsonLayer(geoJson));
				////}

			}
		}, false);

		worker.postMessage("It doesn't really matter what this message is.");
	}

	setupAlertsWorker();
	setupTrafficFlowWorker();
});