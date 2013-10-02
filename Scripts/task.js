/*global onmessage, postMessage, setInterval*/
(function () {
	"use strict";

	var roadwayLocationPropNameRe = /^(\w+)RoadwayLocation$/, dateRe = /\/Date\((\d+)(-\d+)?\)\//, urlRe = /(?:(https?:\/\/)?www.wsdot.wa.gov)\S+/;

	function formatDate(/**{Date}*/ date) {
		return [
					[date.getMonth() + 1, date.getDate(), date.getFullYear()].join("-"),
					[date.getHours(), date.getMinutes()].join(":")
		].join(" ");
	}

	function toDate(value) {
		var match, output = value;
		if (typeof value === "string") {
			match = value.match(dateRe);
			if (match) {
				if (match.length >= 3) {
					output = new Date(Number(match[1]) + Number(match[2]));
				} else {
					output = new Date(Number(match[1]));
				}
				output = formatDate(output);
			}
		}
		return output;
	}

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
					this.properties[propName] = toDate(alert[propName]);
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