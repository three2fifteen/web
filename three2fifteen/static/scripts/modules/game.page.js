loader.executeModule('gamePageModule',
'config', 'app', 'B', 'utils', 'Game', 'Socket',
(config, app, B, utils, Game, Socket) => {
	const gameId = B.$id('current_game_id').dataset.value;

	const getLiNode = (node) => {
		while (node && node.nodeName != 'LI') {
			node = node.parentNode;
		}
		return node;
	};

	let _hoveredCell = null;
	const _tokenOverHand = (e) => {
		e.preventDefault();
	}

	const _postMove = (valid, message, enableConfirm) => {
		let cpNode = B.$id('confirm-play'),
			alertNode = B.$id('alert-container');
		alertNode.innerHTML = message;
		if (message) {
			B.removeClass(alertNode, 'hidden');
		}
		else {
			B.addClass(alertNode, 'hidden');
		}

		if (valid) {
			B.addClass(alertNode, 'alert-success');
			B.removeClass(alertNode, 'alert-danger');
		}
		else {
			B.removeClass(alertNode, 'alert-success');
			B.addClass(alertNode, 'alert-danger');
		}

		if (enableConfirm) {
			cpNode.removeAttribute('disabled');
		}
		else {
			cpNode.setAttribute('disabled', 'disabled');
		}
	};

	const _tokenOverBoard = (e) => {
		B.removeClass(_hoveredCell, 'hovered');
		_hoveredCell = e.target;
		B.addClass(_hoveredCell, 'hovered');
		e.preventDefault();
	}

	const _refresh = () => {
		app.getModuleData(
			module,
			module.dataUrls.slice(),
			_render,
			new Set(['game_content', 'game', 'player_hand'])
		);
	};

	const _resultMove = (move, dryRun) => {
		move.then((score) => {
			_postMove(true, score, dryRun);
			if (!dryRun) {
				// fetch data back
				_refresh();
				Socket.message({'type': 'play'});
			}
		}).catch((message) => {
			_postMove(false, message, false);
		});
	};

	const _dropToken = (e, callback) => {
		e.preventDefault();
		const li = getLiNode(e.target);
		const token = B.$id(e.dataTransfer.getData('token-id'));
		// Prevent from dropping more than one token in the same space
		if (li.children.length) {
			return;
		}
		li.appendChild(token);
		const move = callback(token, li);
		_resultMove(move, true);
		B.removeClass(_hoveredCell, 'hovered');
		_hoveredCell = e.target;
	};

	const _dropTokenHand = (e) => {
		e.preventDefault();
		const token = B.$id(e.dataTransfer.getData('token-id'));
		B.$id('player-hand').appendChild(token);
		const move = Game.removeToken(
			gameId,
			token.id
		);
		if (move) {
			_resultMove(move, true);
		}
		else {
			_postMove(true, '', false);
		}
		B.removeClass(_hoveredCell, 'hovered');
	};

	const _dropTokenBoard = (e) => {
		_dropToken(e, (token, li) => {
			return Game.placeToken(
				gameId,
				token.id,
				parseInt(li.dataset.x),
				parseInt(li.dataset.y),
				parseInt(token.dataset.value)
			);
		});
	};

	const _prepareGame = (module) => {
		// Analyse data
		Game.analyseGame(module.data.game);
		Game.findWinner(module.data.game);
		module.data.game.size_bag = module.data.game_content.size_bag;
		Game.setBoardContent(
			module.data.board,
			module.data.game_content.tokens
		);
		module.data.player_hand.forEach((token, index) => {
			module.data.player_hand[index] = {'value': token, 'index': index};
		});
	};

	const _render = () => {
		let template;
		let gameOngoing = !module.data.game.date_finished;

		if (module.data.game.date_finished) {
			template = 'game_finished';
		}
		else {
			template = 'game_ongoing';
		}

		Game.setPlayerNames(module.data.game).then((names) => {
			_prepareGame(module);

			B.$id('game-section').innerHTML = B.Template.compile(
				template,
				module.data
			);

			if (!module.data.game.date_finished) {
				_setEvents();
			}
		});
	};

	const _setEvents = () => {
		// Set events
		document.querySelectorAll('#player-hand .token').forEach((token) => {
			token.addEventListener('dragstart', (e) => {
				e.dataTransfer.setData('token-id', token.id);
			});
		});
		B.$id('player-hand').addEventListener('dragover', _tokenOverHand);
		B.$id('player-hand').addEventListener('drop', _dropTokenHand);
		document.querySelectorAll('#board li').forEach((place) => {
			place.addEventListener('dragover', _tokenOverBoard, false);
			place.addEventListener('drop', _dropTokenBoard, false);
		});
		B.$id('confirm-play').addEventListener('click', (e) => {
			e.preventDefault();
			e.preventDefault();
			const play = Game.play(gameId);
			_resultMove(play, false);
		});
	};

	let module = {
		'dataUrls': [
			{'url': config.api_get_board, 'name': 'board'},
			{'url': utils.format(config.api_get_game_content, [gameId]), 'name': 'game_content'},
			{'url': utils.format(config.api_get_game, [gameId]), 'name': 'game'},
			{'url': utils.format(config.api_get_hand, [gameId]), 'name': 'player_hand'}
		],
		'action': () => {
			B.Template.init({
				game_ongoing: {html: B.$id('game-ongoing').innerHTML},
				game_open: {html: B.$id('game-open').innerHTML},
				game_finished: {html: B.$id('game-finished').innerHTML},
				player_token: {html: B.$id('player-token').innerHTML},
				board_token: {html: B.$id('board-token').innerHTML},
				board_cell: {html: B.$id('board-cell').innerHTML},
				player_score: {html: B.$id('template-player-score').innerHTML},
				game_creator: {html: B.$id('template-game-creator').innerHTML},
				player_turn: {html: B.$id('template-player-turn').innerHTML},
				winner_token: {html: B.$id('winner-token').innerHTML}
			});

			const gameOpen = module.data.game.players.length < module.data.game.number_players;
			if (gameOpen) {
				B.$id('game-section').innerHTML = B.Template.compile(
					'game_open',
					module.data
				);
				return;
			}

			Socket.join(
				{'player-played': _refresh},
				gameId
			);
			// Render page
			_render();
		}
	};
	app.addModule(module);
});
