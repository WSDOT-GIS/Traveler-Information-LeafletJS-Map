/*global onmessage, postMessage, setInterval, importScripts, wsdot */
(function () {
	"use strict";

	importScripts("task_common.js");

	function parseTravelTimes(k, v) {
		var output;
		if (v && v.hasOwnProperty("TravelTimeID")) {
			output = new wsdot.Feature(v);
		} else {
			output = v;
		}
		return output;
	}

	/** Sends a request for alerts from the WSDOT Traveler Information API.
	 * @returns {XMLHttpRequest}
	 */
	function sendRequest() {
		var webRequest = new XMLHttpRequest();
		webRequest.onload = function () {
			var data = typeof this.response === "string" ? JSON.parse(this.response, parseTravelTimes) : this.response;

			data = new wsdot.FeatureCollection(data);
			postMessage(data);
		};
		webRequest.open("GET", "../proxy.ashx?type=TravelTimes", true);
		webRequest.send();
		return webRequest;
	}

	// Setup the task's "onmessage" event.
	onmessage = function (/*event*/) {
		var intervalId;
		sendRequest();
		intervalId = setInterval(sendRequest, 90000);
	};
}());