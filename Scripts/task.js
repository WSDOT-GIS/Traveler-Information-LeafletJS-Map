/*global onmessage, postMessage*/
(function () {
	"use strict";

	var roadwayLocationPropNameRe = /^(\w+)RoadwayLocation$/;

	function toPosition(roadwayLocation) {
		return [roadwayLocation.Longitude, roadwayLocation.Latitude, null, roadwayLocation.Milepost];
	}

	function createGeometry(alert) {
		var output;
		if (alert.StartRoadwayLocation && alert.EndRoadwayLocation) {
			output = {
				type: "MultiPoint",
				coordinates: [toPosition(alert.StartRoadwayLocation), toPosition(alert.EndRoadwayLocation)]
			};
		} else if (alert.StartRoadwayLocation) {
			output = {
				type: "Point",
				coordinates: toPosition(alert.StartRoadwayLocation)
			};
		} else if (alert.EndRoadwayLocation) {
			output = {
				type: "Point",
				coordinates: toPosition(alert.EndRoadwayLocation)
			};
		} else {
			output = null;
		}

		return output;
	}

	function Feature(alert) {
		var match, rl, propName, rlPropName;
		this.type = "Feature";
		this.properties = {};
		this.geometry = createGeometry(alert);

		for (propName in alert) {
			if (alert.hasOwnProperty(propName)) {
				// Check for a ___RoadwayLocation property...
				match = propName.match(roadwayLocationPropNameRe);
				if (match) {
					rl = alert[propName];
					for (rlPropName in rl) {
						if (rl.hasOwnProperty(rlPropName)) {
							if (rlPropName !== "Longitude" && rlPropName !== "Latitude" && rlPropName !== "MilePost") {
								this.properties[match[1] + "_" + rlPropName] = rl[rlPropName];
							}
						}

					}
				} else {
					this.properties[propName] = alert[propName];
				}
			}
		}
	}

	function FeatureCollection(features) {
		this.type = "FeatureCollection";
		this.features = features;
	}

	function sendRequest() {
		var webRequest = new XMLHttpRequest();
		webRequest.onload = function () {
			var data = typeof this.response === "string" ? JSON.parse(this.response, function (k, v) {
				var output;
				if (v && v.hasOwnProperty("AlertID")) {
					output = new Feature(v);
				} else {
					output = v;
				}
				return output;
			}) : this.response;

			data = new FeatureCollection(data);
			postMessage(data);
		};
		webRequest.open("GET", "../GetAlerts.ashx", true);
		webRequest.send();
	}

	onmessage = function (event) {
		var intervalId;
		sendRequest();
		intervalId = setInterval(sendRequest, 60000);
	};
}());