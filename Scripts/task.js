onmessage = function (event) {
	var message = { message: "This is the message" };
	self.postMessage(message);
};