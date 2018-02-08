loader.addModule('Socket', 'config', (config) => {
	var socket = null;
	let module = {};

	module.join = (onMessageHooks, gameId) => {
		socket = new WebSocket(
			"ws://" + location.hostname + ":" + location.port + "/websocket/"
		);
		socket.onopen = function() {
			socket.send(JSON.stringify({'type': 'join', 'game_id': gameId}));
		}

		socket.onmessage = function(message) {
			var data = JSON.parse(message.data);
			if (!data.type || !onMessageHooks[data.type]) {
				console.log(
					"Socket message received with unknown or no type " + data
				);
				return;
			}

			onMessageHooks[data.type](data);
		}
	};

	return module;
});
