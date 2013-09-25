var worker;

worker = new Worker("Scripts/task.js");

worker.addEventListener("message", function (oEvent) {
	if (console) {
		console.log(this, arguments);
	}
}, false);

worker.postMessage("It doesn't really matter what this message is.");