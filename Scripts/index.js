/*global Worker, require, requirejs*/
/*jslint browser:true, regexp:true, white:true*/


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

// Check to make sure the browser supports WebWorkers. If it doesn't, inform the user that they need to upgrade.
if (!window.Worker) {
	document.body.innerHTML = "<p>This page uses <a href='http://caniuse.com/#feat=webworkers'>WebWorkers</a>, which your browser does not appear to support. Please upgrade to <a href='http://caniuse.com/#feat=webworkers'>one that does</a>.</p>";
} else {
	require(["leaflet", "alertUtils", "markercluster"], function (L, alertUtils) {
		"use strict";
		var map, osmLayer, mapQuestOsmLayer, mapQuestOALayer, openCycleMapLayer, ocmTransportLayer, ocmLandscapeLayer,
			ocmOutdoorsLayer, osmAttrib, mqAttrib, ocmAttrib, layerList, signIcons;

		// Define attribution strings that are common to multiple basemap layers.
		osmAttrib = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
		mqAttrib = osmAttrib + '<p>Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"></p>';
		ocmAttrib = osmAttrib + '<p>Tiles Courtesy of <a href="http://www.thunderforest.com/" target="_blank">Thunderforest</a></p>';

		// Create the basemap layers.
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

		// Create the map. If geolocation is supported, it will be zoomed to the user's current location.
		map = L.map('map', {
			center: [47.41322033015946, -120.80566406246835],
			zoom: 7,
			layers: [osmLayer]
		}).locate({ setView: true, maxZoom: 16 });

		// Create the layer list control and add it to the map.
		layerList = L.control.layers({
			OpenStreetMap: osmLayer,
			"MapQuest OSM": mapQuestOsmLayer,
			"MapQest Open Aerial": mapQuestOALayer,
			"OpenCycleMap": openCycleMapLayer,
			"OpenCycleMap Transport": ocmTransportLayer,
			"OpenCycleMap Landscape": ocmLandscapeLayer,
			"OpenCycleMap Outdoors": ocmOutdoorsLayer
		}).addTo(map);

		signIcons = new alertUtils.SignIcons();

		function setupCameraWorker() {
			var layer, worker, cameraIcon;
			worker = new Worker("Scripts/tasks/traffic_task.min.js");

			/** Creates the popup content for a camera feature.
			 * @returns Element
			*/
			function createCameraPopup(feature) {
				var output, header, descElement, ownerText, ownerElement;
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

				// The img element will not be added until the popup is opened.
				// This is to avoid loading all camera images at once.

				return output;

			}


			/** Adds the camera image element to a camera popup.
			 * @param popupEvent
			 * @param popupEvent.popup
			 * @param {HTMLElement} popupEvent.popup._content
			 * @param popupEvent.target
			 * @param popupEvent.target.feature GeoJSON feature that was clicked.
			 * @param popupEvent.target.feature.properties The properties of the feature that was clicked.
			 */
			function addImgElement(popupEvent) {
				/*jslint nomen:true*/
				var div, img, props;
				// Get the popup content DOM element.
				div = popupEvent.popup._content;
				// Get the properties of the clicked feature.
				props = popupEvent.target.feature.properties;
				// Add the image element if an image URL is defined.
				if (props.ImageURL && div) {
					// Create the image element and add it to the popup's DOM element.
					img = document.createElement("img");
					img.src = props.ImageURL;
					img.width = props.ImageWidth || null;
					img.height = props.ImageHeight || null;
					img.alt = props.Description || props.Title || "Camera Image";
					div.appendChild(img);
				}
				/*jslint nomen:false*/
			}

			/** Creates a marker for a point feature.
			 * @param {Object} feature
			 * @param {Number[]} latLng
			 * @returns {L.Marker}
			 */
			function pointToLayer(feature, latLng) {
				return L.marker(latLng, {
					icon: cameraIcon,
					title: feature.properties.Title
				}).addOneTimeEventListener("popupopen", addImgElement);

			}


			/** Adds a popup to the feature.
			 */
			function onEachFeature(feature, layer) {
				layer.bindPopup(createCameraPopup(feature));

			}

			/** Creates a GeoJSON layer.
			 * @param {Object} geoJSON
			 * @returns {L.GeoJson}
			*/
			function createGeoJsonLayer(geoJson) {
				return L.geoJson(geoJson, {
					pointToLayer: pointToLayer,
					onEachFeature: onEachFeature
				});
			}

			// Create the camera that will be used for the markers.
			cameraIcon = L.icon({
				iconUrl: "images/icons/camera.png",
				iconSize: [30, 22]
			});

			// Add the event listener that occurs each time the worker sends a message to the UI thread.
			worker.addEventListener("message", function (oEvent) {
				var geoJson = oEvent.data;

				if (geoJson) {
					if (!layer) {
						layer = new L.MarkerClusterGroup();
						layer.addLayer(createGeoJsonLayer(geoJson));
						// Add this layer to the layer list.
						layerList.addOverlay(layer, "Cameras");
					}
					else {
						layer.clearLayers();
						layer.addLayer(createGeoJsonLayer(geoJson));
					}

				}
			}, false);

			// Start the worker.  Presently, the content of text passed to the worker here does not matter.
			worker.postMessage({
				action: "start",
				type: "HighwayCameras",
				ticks: 86400000
			});

			return worker;
		}

		/** Creates generic popup content for a feature
		 * @param {object} A GeoJSON feature.
		 * @returns {HTMLTableElement}
		 */
		function performDefaultPopupContentCreation(feature) {
			var table, row, cell, pName, v, nonZeroMeasureRe = /\w+(?:MaxAxle)|(?:In(?:(?:Inches)|(?:Pounds)))/i;

			if (feature && feature.properties) {
				table = document.createElement("table");
				for (pName in feature.properties) {
					if (feature.properties.hasOwnProperty(pName)) {

						v = feature.properties[pName];

						if (v !== null && v !== "" && pName !== "Longitude" && pName !== "Latitude" && !(nonZeroMeasureRe.test(pName) && !v)) {

							row = table.insertRow();
							cell = document.createElement("th");
							cell.innerText = pName;
							row.appendChild(cell);

							cell = row.insertCell(1);
							cell.innerText = String(feature.properties[pName]);
						}
					}

				}
			}

			return table;
		}

		/** Creates a marker for a feature at the specified location.
		 * @param {object} feature - A GeoJSON Feature object.
		 * @param {L.LatLng} latLng
		 * @returns {L.Marker}
		 */
		function performDefaultMarkerCreation(feature, latLng) {
			return L.marker(latLng);
		}

		/** Binds a generic popup to a layer.
		 * @param {object} feature - a GeoJSON feature
		 * @param {L.Layer} layer
		 */
		function performDefaultPerFeatureTasks(feature, layer) {
			layer.bindPopup(performDefaultPopupContentCreation(feature));
		}


		/** Creates a WebWorker that retrieves WSDOT Traveler API info at specified intervals.
		 * @param {string} layerName - The name that will be given to the layer when it is added to the layer list control.
		 * @param {string} apiType - Indicates which API endpoint will be queried.
		 * @param {number} ticks - The refresh rate in milliseconds.
		 * @param {Object} [layerOptions] - options to be passed to the L.GeoJson constructor.
		 * @param {string} [taskUrl="Scripts/tasks/traffic_task.min.js"] - The location of the task JavaScript file.
		 * @returns {Worker}
		 */
		function createWorker(layerName, apiType, ticks, layerOptions, taskUrl) {
			var layer, worker, defaultLayerOptions;
			worker = new Worker(taskUrl || "Scripts/tasks/traffic_task.min.js");

			defaultLayerOptions = {
				pointToLayer: performDefaultMarkerCreation,
				onEachFeature: performDefaultPerFeatureTasks
			};

			worker.addEventListener("message", function (oEvent) {
				var geoJson = oEvent.data;

				if (geoJson) {
					if (!layer) {
						layer = L.geoJson(geoJson, layerOptions || defaultLayerOptions);
						layerList.addOverlay(layer, layerName);
					}
					else {
						layer.clearLayers();
						layer.addLayer(L.geoJson(geoJson, layerOptions || defaultLayerOptions));
					}

				}
			}, false);

			worker.addEventListener("error", function (/*{Error}*/ e) {
				if (window.console && window.console.error) {
					window.console.error("task error", e);
				}
			});

			worker.postMessage({
				action: "start",
				type: apiType,
				ticks: ticks
			});

			return worker;
		}

		// Setup the WebWorkers...


		// traffic flow...

		function valueToColor(value) {
			return !value || value === "Unknown" ? "white"
				: value === 1 || value === "WideOpen" ? "#0f0"
				: value === 2 || value === "Moderate" ? "yellow"
				: value === 3 || value === "Heavy" ? "red"
				: value === 4 || value === "StopAndGo" ? "black"
				: "gray";
		}


		setupCameraWorker();

		// Setup alerts worker.
		createWorker("Alerts", "HighwayAlerts", 60000, {
			pointToLayer: function (feature, latLng) {
				var icon;
				icon = signIcons.GetIcon(feature);
				return L.marker(latLng, { icon: icon });
			},

			onEachFeature: function (feature, layer) {
				layer.bindPopup(alertUtils.createAlertContent(feature));
			}
		});
		createWorker("Traffic Flow", "TrafficFlow", 60000, {
			pointToLayer: function(feature, latLng) {
				return L.circleMarker(latLng, {
					radius: 5,
					fillOpacity: 1,
					color: "black",
					fillColor: valueToColor(feature.properties.FlowReadingValue)
				});
			},
			onEachFeature: performDefaultPerFeatureTasks
		});
		createWorker("Travel Times", "TravelTimes", 60000, {
			pointToLayer: function (feature, latLng) {
				var additionalClass = feature.properties.CurrentTime < feature.properties.AverageTime ? "below-average"
					: feature.properties.CurrentTime > feature.properties.AverageTime ? "above-average"
					: null;
				var className = "travel-times-icon";
				if (additionalClass) {
					className = [className, additionalClass].join(" ");
				}
				return L.marker(latLng, {
					icon: L.divIcon({
						className: className,
						html: "<div>" + String(feature.properties.CurrentTime) + "&rsquo;</div>"
					})
				});
			},
			onEachFeature: performDefaultPerFeatureTasks
		});
		createWorker("Border Crossings", "BorderCrossings", 86400000, {
			pointToLayer: function (feature, latLng) {
				var className = "border-crossings-icon";
				return L.marker(latLng, {
					icon: L.divIcon({
						className: className,
						html: "<div>" + String(feature.properties.WaitTime) + "&rsquo;</div>"
					})
				});
			},
			onEachFeature: performDefaultPerFeatureTasks
		});
		createWorker("CV Restrictions", "CVRestrictions", 86400000);
		createWorker("Pass Conditions", "MountainPassConditions", 3600000);
	});
}