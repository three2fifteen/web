loader.executeModule('gameJoinModule',
'config', 'app', 'B', 'request', 'auth', 'utils',
(config, app, B, request, auth, utils) => {
	const handleResponse = (statusCode, body) => {
		if (statusCode == 200) {
			utils.goToUrl('/');
		}
		else {
			B.$id('error').innerHTML = JSON.parse(body).message;
		}
	};

	let module = {
		'action': () => {
			let url = config.api_host + config.api_join_game;
			const game_public_id = B.$id('game_public_id').dataset.value;
			url = utils.format(url, [game_public_id]);
			request.put(url, null, auth.getHeader(), handleResponse);
		}
	};
	app.addModule(module);
});
