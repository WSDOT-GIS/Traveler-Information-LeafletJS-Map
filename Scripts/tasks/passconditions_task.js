/*global postMessage, setInterval, importScripts, WsdotTraffic*/
(function () {
	"use strict";

	importScripts("../WsdotTraffic.min.js");

	/** Sends a request for alerts from the WSDOT Traveler Information API.
	 * @returns {XMLHttpRequest}
	 */
	function sendRequest() {
		var webRequest = new XMLHttpRequest();
		webRequest.onload = function () {
			var data = typeof this.response === "string" ? JSON.parse(this.response, WsdotTraffic.parseAsGeoJson) : this.response;

			postMessage(data);
		};
		webRequest.open("GET", "../../proxy.ashx?type=MountainPassConditions", true);
		webRequest.send();
		return webRequest;
	}

	addEventListener("message", function (/*event*/) {
		var intervalId;
		sendRequest();
		intervalId = setInterval(sendRequest, 3600000);
	});
}());