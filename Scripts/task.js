/*global onmessage, postMessage, setInterval*/
(function () {
	"use strict";

	var roadwayLocationPropNameRe = /^(\w+)RoadwayLocation$/, dateRe = /\/Date\((\d+)(-\d+)?\)\//;

	/** Formats a date object into a string.
	 * @returns {String} Returns date formatted as month-date-year hour:minute.
	 */
	function formatDate(/**{Date}*/ date) {
		return [
					[date.getMonth() + 1, date.getDate(), date.getFullYear()].join("-"),
					[date.getHours(), date.getMinutes()].join(":")
		].join(" ");
	}

	/** Converts a .NET formatted date string into a Date if possible. 
	 * If not possible or if input is not a string, the input is returned.
	 */
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

	/** Converts a roadway location into a GeoJSON position. 
	 * @returns {Array} An array: [x, y, null, milepost]
	 */
	function toPosition(/**{Object}*/roadwayLocation) {
		return [roadwayLocation.Longitude, roadwayLocation.Latitude, null, roadwayLocation.Milepost];
	}

	/** Creates a GeoJSON geometry object from an alert.
	 * @returns {Object}
	 */
	function createGeometry(/**{Object}*/ alert) {
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

	/** Creates a GeoJSON feature
	 * @constructor
	 */
	function Feature(/**{Object}*/ alert) {
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

	/** Creates a GeoJSON feature collection.
	 * @constructor
	 */
	function FeatureCollection(features) {
		this.type = "FeatureCollection";
		this.features = features;
	}

	/** Sends a request for alerts from the WSDOT Traveler Information API.
	 * @returns {XMLHttpRequest}
	 */
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
		return webRequest;
	}

	// Setup the task's "onmessage" event.
	onmessage = function (event) {
		var intervalId;
		sendRequest();
		intervalId = setInterval(sendRequest, 60000);
	};
}());