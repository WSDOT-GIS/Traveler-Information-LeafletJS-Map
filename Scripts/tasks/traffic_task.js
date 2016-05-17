/*global postMessage, setInterval, importScripts, WsdotTraffic*/
(function () {
	"use strict";

	var ticks, url, intervalId, handleWebRequestLoad;

	importScripts("../WsdotTraffic.js");

	/** Posts the data returned by the web request as a response message.
	 * @this {XMLHttpRequest}
	 */
	handleWebRequestLoad = function () {
		var data = typeof this.response === "string" ? JSON.parse(this.response, WsdotTraffic.parseAsGeoJson) : this.response;

		postMessage(data);
	};

	/** Sends a request for alerts from the WSDOT Traveler Information API.
	 * @returns {XMLHttpRequest}
	 */
	function sendRequest() {
		var webRequest = new XMLHttpRequest();
		webRequest.onload = handleWebRequestLoad;
		webRequest.open("GET", url, true);
		webRequest.send();
		return webRequest;
	}

	/** 
	 * @typedef RequestData
	 * @property {string} action - The action. E.g., "start".
	 * @property {number} ticks - The refresh interval in milliseconds. Only used for "start" action.
	 * @property {string} type - Indicates the API endpoint type. E.g., "MountainPassConditions"
	 */

	function startRequests(/** {RequestData} */ requestData) {
		url = "../../api/traffic/" + requestData.type;
		ticks = requestData.ticks;
		sendRequest();
		intervalId = setInterval(sendRequest, ticks);
	}

	/** Handles the message from the caller.
	 * @param {object} event
	 * @param {RequestData} event.data
	 */
	function handleMessage(event) {

		if (event && event.data) {
			if (event.data.action === "start") {
				startRequests(event.data);
			}
		}

	}

	// Setup event handler for when messages are sent from the caller.
	addEventListener("message", handleMessage);
}());