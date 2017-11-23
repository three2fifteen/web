loader.executeModule('gameCreateModule',
'auth', 'request', 'config', 'B', 'utils', 'app',
(auth, request, config, B, utils, app) => {
	app.addModule({
		'action': () => {
			let form = B.$id('game-creation-form');
			form.addEventListener('submit', (e) => {
				B.$id("form-message").innerHTML = "";
				e.preventDefault();
				request.post(
					config.api_host + config.api_create_game,
					JSON.stringify({
						'number_players': form.nbPlayers.value
					}),
					auth.getHeader(),
					(statusCode, body) => {
						utils.apiResponseHandler(statusCode, body, '/');
					}
				);
			});
		}
	});
});
