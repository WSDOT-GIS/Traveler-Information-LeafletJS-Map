(function () {
	"use strict";


	onmessage = function (event) {
		var intervalId;

		intervalId = setInterval(function () {
			postMessage(new Date());
		}, 1000);
	};
}());