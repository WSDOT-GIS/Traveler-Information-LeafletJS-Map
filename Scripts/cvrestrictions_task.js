﻿/*global onmessage, postMessage, setInterval*/
(function () {
	"use strict";

	importScripts("task_common.js");

	/** Sends a request for alerts from the WSDOT Traveler Information API.
	 * @returns {XMLHttpRequest}
	 */
	function sendRequest() {
		var webRequest = new XMLHttpRequest();
		webRequest.onload = function () {
			var data = typeof this.response === "string" ? JSON.parse(this.response, function (k, v) {
				var output;
				if (v && v.hasOwnProperty("StateRouteID")) {
					output = new wsdot.Feature(v);
				} else {
					output = v;
				}
				return output;
			}) : this.response;

			data = new wsdot.FeatureCollection(data);
			postMessage(data);
		};
		webRequest.open("GET", "../proxy.ashx?type=CVRestrictions", true);
		webRequest.send();
		return webRequest;
	}

	// Setup the task's "onmessage" event.
	onmessage = function (event) {
		var intervalId;
		sendRequest();
		intervalId = setInterval(sendRequest, 86400000);
	};
}());