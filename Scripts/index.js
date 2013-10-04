/*global Worker, L*/
/*jslint browser:true, regexp:true*/
(function (L) {
	"use strict";
	var worker, map, osmLayer, mapQuestOsmLayer, mapQuestOALayer, openCycleMapLayer, ocmTransportLayer, ocmLandscapeLayer, ocmOutdoorsLayer, layer, categories, priorities, signIcons;

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

	categories = {
		"Construction": [
			"Construction",
			"Ferry",
			"Lane Closure",
			"Maintenance"
		],
		"AccidentAlert": [
			"Abandoned Vehicle",
			"Alarm",
			"AMBER Alert",
			"Bridge",
			"Brush fire",
			"Cable Barrier",
			"Chain Enforcement",
			"Collision",
			"Collision fatality",
			"Complaint",
			"Dead Animal",
			"Debris",
			"Debris blocking",
			"Disabled vehicle",
			"Hazardous material",
			"Fatality or Possible Fatality",
			"Fire",
			"Flammable Restriction",
			"HCB Motor Open",
			"ITS & IT",
			"Other",
			"Pass Report",
			"Pierce Co. Roads",
			"Pierce Co. Signs/Signals",
			"Rocks",
			"Signals",
			"Signs",
			"Special Event",
			"",
			"Administrative",
			"Boat Traffic",
			"Bridge Lift",
			"Heavy Traffic",
			"In Service",
			"Lakewood",
			"MBT",
			"MIL",
			"ODOT",
			"Out of Service",
			"P-1 Sand / Plowing / Deicing",
			"Pedestrian",
			"Power Lines",
			"Road Report",
			"Sand / Plowing / Deicing",
			"Shift Change",
			"Toll",
			"Utilities"
		],
		"RoadClosure": [
			"Avalanche Control",
			"Bomb",
			"Bridge Closed",
			"Closure",
			"Emergency closure",
			"Pass Closure",
			"Rollover",
			"Multi-vehicle collision",
			"Chemical Spill",
			"Vehicle fire",
			"Medical emergency",
			"Major incident",
			"Semi Truck Involved",
			"Incident",
			"Two or more lanes closed",
			"Rock Slide",
			"Snow slide",
			"Hazmat",
			"HCB Closed Maint",
			"HCB Closed Marine",
			"HCB Closed Police",
			"HCB Closed Winds",
			"Slide",
			"Slides",
			"Water over Roadway",
			"Rocks - Closure",
			"Trees",
			"Hood Canal Bridge"
		],
		"Weather": [
			"Traction Advisory",
			"Weather",
			"Weather event"
		]
	};

	function createSignIcon(url, folder) {
		var shadowUrl;
		if (!url) {
			throw new TypeError("url is undefined.");
		}
		if (!folder) {
			folder = "images/icons/alert/";
		}
		shadowUrl = folder + "shadow.png";
		return L.icon({
			iconUrl: folder + url,
			shadowUrl: shadowUrl,
			iconSize: [25, 25],
			iconAnchor: [13, 25],
			shadowAnchor: [0, 5],
			shadowSize: [25,9]
		});
	}

	function createClosureIcon() {
		return L.icon({
			iconUrl: "images/icons/alert/RoadClosure.png",
			////iconAnchor: [13, 25],
			iconSize: [25, 25]
		});
	}

	priorities = {
		Unknown: 5,
		Lowest: 4,
		Low: 3,
		Medium: 2,
		High: 1,
		Highest: 1
	};

	function SignIcons() {
		var types, i, l, p, type;
		types = ["AccidentAlert", "Construction", "Weather"];

		for (i = 0, l = types.length; i < l; i += 1) {
			type = types[i];
			// Create new property for the current type.
			this[type] = {};
			for (p in priorities) {
				if (priorities.hasOwnProperty(p)) {
					this[type][p] = createSignIcon([type, priorities[p], ".png"].join(""));
				}
			}
		}

		this.RoadClosure = createClosureIcon();
	}

	SignIcons.prototype.GetIcon = function (feature) {
		var category, icon, categoryName, categoryList, i, l;
		if (!(feature && feature.properties)) {
			throw new TypeError("The feature either is not defined or has no properties.");
		}
		// Get the appropriate category for the feature's EventCategory property...
		for (categoryName in categories) {
			if (categories.hasOwnProperty(categoryName)) {
				categoryList = categories[categoryName];
				for (i = 0, l = categoryList.length; i < l; i += 1) {
					if (feature.properties.EventCategory === categoryList[i]) {
						category = categoryName;
						// Break out of category list loop once match has been found.
						break;
					}
				}
				// Break out of for in loop if category has been determined.
				if (category) {
					break;
				}
			}
		}

		// Default to AccidentAlert if no appropriate category exists.
		if (!category) {
			category = "AccidentAlert";
		}

		if (category === "RoadClosure") {
			icon = this.RoadClosure;
		} else {
			icon = this[category][feature.properties.Priority];
		}

		return icon;
	};

	signIcons = new SignIcons();



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

	/** Splits Pascal case names into words separated by spaces.
	 * @returns {string}
	 */
	function formatName(/**{string}*/ key) {
		var re = /[A-Z][a-z]+/g, match, output;

		if (key) {
			match = key.match(re);
			output = match.join(" ");
		}

		return output;
	}

	/** Detects URLs in text and surrounds them with <a> tags.
	 * @returns {string}
	 */
	function replaceUrlsWithLinks(/**{string}*/ text) {
		var urlRe, output;
		if (typeof text === "string") {
			urlRe = /(?:(https?:\/\/)?www.wsdot.wa.gov)\S+/ig;
			output = text.replace(urlRe, function (match, p1 /*, offset, string*/) {
				var a;
				if (p1) {
					a = match;
				} else {
					a = "http://" + match;
				}
				a = ["<a href='", a, "' target='wsdotproject'>link</a>"].join("");
				return a;
			});
		} else {
			output = text;
		}
		return output;
	}

	/** Formats the alert content into a div element for a popup.
	 * @returns {HTMLDivElement}
	 */
	function createAlertContent(feature) {
		var name, frag, table, row, cell, p;
		frag = document.createElement("div");
		table = document.createElement("table");
		for (name in feature.properties) {
			if (feature.properties.hasOwnProperty(name) && !/Description/i.test(name)) {
				if (feature.properties[name]) {
					row = document.createElement("tr");
					cell = document.createElement("th");
					cell.textContent = formatName(name);
					row.appendChild(cell);
					cell = document.createElement("td");
					cell.textContent = feature.properties[name];
					row.appendChild(cell);
					table.appendChild(row);
				}
			}
		}

		p = document.createElement("p");
		p.classList.add("headline-description");
		p.textContent = feature.properties.HeadlineDescription;
		frag.appendChild(p);

		if (feature.properties.ExtendedDescription) {
			p = document.createElement("p");
			p.classList.add("headline-description");
			p.innerHTML = replaceUrlsWithLinks(feature.properties.ExtendedDescription);
			frag.appendChild(p);
		}
		frag.appendChild(table);

		return frag;
		
	}


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
						var icon;
						icon = signIcons.GetIcon(feature);
						return L.marker(latLng, { icon: icon });
					},
					onEachFeature: function (feature, layer) {
						layer.bindPopup(createAlertContent(feature));
					}
				}).addTo(map);
			}
		}, false);

		worker.postMessage("It doesn't really matter what this message is.");
	}

	setupWebWorker();
}(L));