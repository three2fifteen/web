loader.addModule('Game',
'request', 'config', 'auth', 'utils',
(request, config, auth, utils) => {
	let _currentPlay = {};

	const _play = (gameId, dryRun) => {
		const endpoint = dryRun && config.api_turn_check || config.api_turn;
		return new Promise((resolve, reject) => {
			request.put(
				utils.format(config.api_host + endpoint, [gameId]),
				JSON.stringify({'play': Object.values(_currentPlay)}),
				auth.getHeader(),
				(statusCode, body) => {
					body = JSON.parse(body);
					if (statusCode != 200) {
						reject(body.message);
					}

					resolve(body.score);
				}
			);
		});
	};

	return {
		analyseGame: (game) => {
			game.current_players_count = game.game_players.length;
			game.ongoing = game.date_started && !game.date_finished;
			game.open = !game.date_finished && game.current_players_count < game.number_players;
		},
		placeToken: (gameId, tokenId, x, y, value) => {
			_currentPlay[tokenId] = {'value': value, 'x': x, 'y': y};
			return _play(gameId, true);
		},
		removeToken: (gameId, tokenId) => {
			delete _currentPlay[tokenId];
			return Object.keys(_currentPlay).length && _play(gameId, true);
		},
		play: (gameId) => {
			return _play(gameId, false);
		}
	};
});
