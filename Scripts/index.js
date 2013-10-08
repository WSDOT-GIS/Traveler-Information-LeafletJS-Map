/*global Worker, require, requirejs*/
/*jslint browser:true, regexp:true*/

requirejs.config({
	baseUrl: "Scripts",
	paths: {
		leaflet: "//cdn.leafletjs.com/leaflet-0.6.4/leaflet",
		markercluster: "Leaflet.markercluster/dist/leaflet.markercluster"
	},
	// This shim property makes sure that leaflet is loaded before markercluster.
	shim: {
		'markercluster': ['leaflet']
	}
});

require(["leaflet", "alertUtils", "markercluster"], function (L, alertUtils) {
	"use strict";
	var map, osmLayer, mapQuestOsmLayer, mapQuestOALayer, openCycleMapLayer, ocmTransportLayer, ocmLandscapeLayer, ocmOutdoorsLayer, osmAttrib, mqAttrib, ocmAttrib, layerList;

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
		var worker, layer, signIcons;
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

		worker.postMessage("begin");
	}

	function setupTrafficFlowWorker() {
		var layer, worker;
		worker = new Worker("Scripts/trafficflow_task.js");

		function valueToColor(value) {
			return !value ? "white"
				: value === 1 ? "#0f0"
				: value === 2 ? "yellow"
				: value === 3 ? "red"
				: value === 4 ? "black"
				: "gray";
		}

		function pointToLayer(feature, latLng) {
			return L.circleMarker(latLng, {
				radius: 5,
				fillOpacity: 1,
				color: "black",
				fillColor: valueToColor(feature.properties.FlowReadingValue)
			});
		}

		////function onEachFeature(feature, layer) {
		////	layer.bindPopup(alertUtils.createAlertContent(feature));
		////}

		function createGeoJsonLayer(geoJson) {
			return L.geoJson(geoJson, {
				pointToLayer: pointToLayer
				////onEachFeature: onEachFeature
			});
		}

		worker.addEventListener("message", function (oEvent) {
			var geoJson = oEvent.data;

			if (geoJson) {
				if (!layer) {
					layer = createGeoJsonLayer(geoJson);
					layerList.addOverlay(layer, "Traffic Flow");
				}
				else {
					layer.clearLayers();
					layer.addLayer(createGeoJsonLayer(geoJson));
				}

			}
		}, false);

		worker.postMessage("begin");
	}

	function setupCameraWorker() {
		var layer, worker, cameraIcon;
		worker = new Worker("Scripts/cameras_task.js");

		/** Creates the popup content for a camera feature.
		 * @returns Element
		*/
		function createCameraPopup(feature) {
			var output, header, descElement, ownerText, ownerElement, imgElement;
			output = document.createElement("div");
			header = document.createElement("p");
			header.textContent = feature.properties.Title;
			output.appendChild(header);
			if (feature.properties.Description) {
				descElement = document.createElement("p");
				descElement.innerText = feature.properties.Description;
				output.appendChild(descElement);
			}
			if (feature.properties.CameraOwner) {
				ownerText = ["Courtesy of ", feature.properties.CameraOwner].join("");
				if (feature.properties.OwnerURL) {
					ownerElement = document.createElement("a");
					ownerElement.href = feature.properties.OwnerURL;
				} else {
					ownerElement = document.createElement("p");
				}
				ownerElement.innerText = ownerText;
				output.appendChild(ownerElement);
			}
			////////imgElement = document.createElement("img");
			////////imgElement.src = feature.properties.ImageURL;
			////////imgElement.alt = feature.properties.Description || feature.properties.Title || "Camera Image";
			
			////imgElement = document.createElement("a");
			////imgElement.href = feature.properties.ImageURL;
			////imgElement.classList.add("convert-to-image");
			////imgElement.innerText = "Image link";

			////output.appendChild(imgElement);

			return output;

		}


		function convertToImage(popupEvent) {
			var div, img, props;
			div = popupEvent.popup._content;
			props = popupEvent.target.feature.properties, img;
			if (props.ImageURL) {
				img = document.createElement("img");
				img.src = props.ImageURL;
				img.width = props.ImageWidth || null;
				img.height = props.ImageHeight || null;
				img.alt = props.Description || props.Title || "Camera Image";
				div.appendChild(img);
			}
		}

		function pointToLayer(feature, latLng) {
			return L.marker(latLng, {
				icon: cameraIcon,
				title: feature.properties.Title
			}).addOneTimeEventListener("popupopen", convertToImage);
			
		}


		function onEachFeature(feature, layer) {
			layer.bindPopup(createCameraPopup(feature));
			
		}

		function createGeoJsonLayer(geoJson) {
			return L.geoJson(geoJson, {
				pointToLayer: pointToLayer,
				onEachFeature: onEachFeature
			});
		}

		cameraIcon = L.icon({
			iconUrl: "images/icons/camera.png",
			iconSize: [30, 22]
		});

		worker.addEventListener("message", function (oEvent) {
			var geoJson = oEvent.data;

			if (geoJson) {
				if (!layer) {
					layer = new L.MarkerClusterGroup();
					layer.addLayer(createGeoJsonLayer(geoJson));
					layerList.addOverlay(layer, "Cameras");
				}
				else {
					layer.clearLayers();
					layer.addLayer(createGeoJsonLayer(geoJson));
				}

			}
		}, false);

		worker.postMessage("begin");
	}


	setupAlertsWorker();
	setupTrafficFlowWorker();
	setupCameraWorker();
});