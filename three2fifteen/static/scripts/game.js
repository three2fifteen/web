loader.addModule('Game',
'request', 'config', 'auth', 'utils',
(request, config, auth, utils) => {
	let _currentPlay = {};
	const BOARD_WIDTH = 15;

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
			game.ongoing = game.date_started && !game.date_finished;
			game.open = !game.date_finished && game.count_players < game.number_players;
		},
		setPlayerScores: (game, content) => {
			let maxScore = 0, winner = null;
			for (let user_id in game.players) {
				let player = game.players[user_id];
				if (!content.scores[player.id_user]) {
					player.score = 0;
				}
				else {
					player.score = content.scores[player.id_user].score;
					if (player.score > maxScore) {
						maxScore = player.score;
						winner = player.id_user;
					}
				}
			}

			if (game.date_finished) {
				game.winner = game.players[winner];
				game.current_is_winner = game.players[winner].is_current;
			}
		},
		setPlayerNames: (game) => {
			let ids = new Set();
			const _addPlayersGame = (game) => {
				for (let user_id in game.players) {
					let player = game.players[user_id];
					ids.add(player.id_user);
				}
			};

			const _setNames = (game, names) => {
				for (let user_id in game.players) {
					game.players[user_id].name = names[user_id];
				}
			};
			if (game.players) {
				_addPlayersGame(game);
			}
			else {
				for (let g of game) {
					_addPlayersGame(g);
				}
			}
			return new Promise((resolve, reject) => {
				request.get(
					utils.format(
						config.api_host + config.api_get_player_names,
						[[...ids].join()]
					),
					auth.getHeader(),
					(statusCode, body) => {
						body = JSON.parse(body);
						if (game.players) {
							_setNames(game, body);
						}
						else {
							for (let g of game) {
								_setNames(g, body);
							}
						}
						resolve();
					}
				);
			});
		},
		setBoardContent: (board, content) => {
			for (let token of content) {
				const index = token.y * BOARD_WIDTH + token.x;
				board[index].token = token;
			}
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
