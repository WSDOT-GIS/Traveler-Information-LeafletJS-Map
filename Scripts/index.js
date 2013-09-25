(function () {
	"use strict";
	var worker, intervalId, timeElement;

	worker = new Worker("Scripts/task.js");

	timeElement = document.getElementById("time");

	worker.addEventListener("message", function (oEvent) {
		timeElement.textContent = oEvent.data.toTimeString();
	}, false);

	intervalId = setInterval(function () {
		worker.postMessage("It doesn't really matter what this message is.");
	}, 1000);
}());