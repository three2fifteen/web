loader.addModule('Game',
'request', 'config', 'auth', 'utils',
(request, config, auth, utils) => {
	let _currentPlay = {};
	const BOARD_WIDTH = 15;

	const _play = (gameId, skip, dryRun, data=null) => {
		// [0][0] is play not dry run
		// [0][1] is play dry run
		// [1][0] is skip play not dry run
		// [1][1] is skip play dry run
		const endpoint = [
			[config.api_turn, config.api_turn_check],
			[config.api_skip_turn, config.api_skip_turn_check],
		][0|skip][0|dryRun];
		return new Promise((resolve, reject) => {
			request.put(
				utils.format(config.api_host + endpoint, [gameId]),
				JSON.stringify(data || {'play': Object.values(_currentPlay)}),
				auth.getHeader(),
				(statusCode, body) => {
					body = JSON.parse(body);
					if (statusCode != 200) {
						reject(body.message);
					}

					if (!dryRun) {
						_currentPlay = {};
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
		findWinner: (game) => {
			let maxPoints = 0, winner = null;
			for (let user_id in game.players) {
				let player = game.players[user_id];
				if (player.points > maxPoints) {
					maxPoints = player.points;
					winner = player.id_user;
				}
			}

			if (winner != null) {
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
			return _play(gameId, false, true);
		},
		removeToken: (gameId, tokenId) => {
			delete _currentPlay[tokenId];
			return Object.keys(_currentPlay).length && _play(gameId, false, true);
		},
		play: (gameId, dryRun) => {
			return _play(gameId, false, dryRun);
		},
		skip: (gameId, tokenToDiscard, dryRun) => {
			return _play(
				gameId,
				true,
				dryRun,
				{'token_to_discard': tokenToDiscard}
			);
		}
	};
});
