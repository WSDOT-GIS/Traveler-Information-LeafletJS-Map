(function () {
	"use strict";

	function sendRequest() {
		var webRequest = new XMLHttpRequest();
		webRequest.onload = function () {
			var data = this.response ? JSON.parse(this.response) : this.response;
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