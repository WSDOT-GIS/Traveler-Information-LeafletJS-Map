(function () {
	"use strict";

	onmessage = function (event) {
		var message = new Date();
		self.postMessage(message);
	};
}());