/*global onmessage, postMessage, setInterval, importScripts, wsdot*/
(function () {
	"use strict";

	importScripts("../wsdot/traffic/main.js");

	/** Sends a request for alerts from the WSDOT Traveler Information API.
	 * @returns {XMLHttpRequest}
	 */
	function sendRequest() {
		var webRequest = new XMLHttpRequest();
		webRequest.onload = function () {
			var data = typeof this.response === "string" ? JSON.parse(this.response, WsdotTraffic.parseAsGeoJson) : this.response;

			postMessage(data);
		};
		webRequest.open("GET", "../../proxy.ashx?type=TravelTimes", true);
		webRequest.send();
		return webRequest;
	}

	// Setup the task's "onmessage" event.
	onmessage = function (/*event*/) {
		var intervalId;
		sendRequest();
		intervalId = setInterval(sendRequest, 86400000);
	};
}());