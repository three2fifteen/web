loader.executeModule('gamePageModule',
'config', 'app', 'B', 'utils', 'Game', 'Socket',
(config, app, B, utils, Game, Socket) => {
	const gameId = B.$id('current_game_id').dataset.value;
	let playButton, skipTurn, playerHand, bin;
	let _moveSource, _targetedAction;
	let _hoveredCell = null;

	const getLiNode = (node) => {
		while (node && node.nodeName != 'LI') {
			node = node.parentNode;
		}
		return node;
	};

	const _postMove = (valid, message, enableConfirm, _targetedAction) => {
		let alertNode = B.$id('alert-container');
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
			_enableAction(_targetedAction);
		}
		else {
			_disableAction(_targetedAction);
		}
	};

	const _tokenOverHand = (e) => {
		e.preventDefault();
	}

	const _tokenOverBoard = (e) => {
		B.removeClass(_hoveredCell, 'hovered');
		_hoveredCell = e.target;
		B.addClass(_hoveredCell, 'hovered');
		e.preventDefault();
	}

	const _tokenOverBin = (e) => {
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

	const _disableAction = (button) => {
		button.setAttribute('disabled', 'disabled');
		B.addClass(button, 'hidden');
	};

	const _enableAction = (button) => {
		button.removeAttribute('disabled');
		B.removeClass(button, 'hidden');
	};

	const _resultMove = (move, dryRun) => {
		if (!move) {
			return;
		}
		move.then((score) => {
			_postMove(true, score, dryRun, _targetedAction);
			if (!dryRun) {
				// fetch data back
				_refresh();
				Socket.message({'type': 'play'});
				_targetedAction = null;
				_moveSource = null;
			}
		}).catch((message) => {
			_postMove(false, message, false, _targetedAction);
		});
	};

	const _dropToken = (e, destination) => {
		e.preventDefault();
		const token = B.$id(e.dataTransfer.getData('token-id'));
		destination = destination || e.target;
		let move;
		// Prevent from dropping more than one token in the same space
		if (destination != playerHand && destination.children.length) {
			return;
		}

		destination.appendChild(token);
		if (!(_moveSource == destination && [bin, playerHand].indexOf(destination) != -1)) {
			if (_moveSource == bin) {
				_disableAction(skipTurnButton);
			}
			if (B.hasClass(destination, 'cell')) {
				move = Game.placeToken(
					gameId,
					token.id,
					parseInt(destination.dataset.x),
					parseInt(destination.dataset.y),
					parseInt(token.dataset.value)
				);
			}
			else if (destination == bin) {
				if (B.hasClass(_moveSource, 'cell')) {
					Game.removeToken(gameId, token.id).catch((message) => {
						_disableAction(playButton);
					});
				}
				move = Game.skip(gameId, parseInt(token.dataset.value), true);
			}
			else if (destination == playerHand) {
				move = Game.removeToken(gameId, token.id);
			}

			if (destination == bin) {
				_targetedAction = skipTurnButton;
			}
			else {
				_targetedAction = playButton;
			}
		}
		_resultMove(move, true);

		B.removeClass(_hoveredCell, 'hovered');
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
				playButton = B.$id('confirm-play');
				skipTurnButton = B.$id('skip-turn');
				playerHand = B.$id('player-hand');
				bin = B.$id('token-bin');
				_setEvents();
			}
		});
	};

	const _setEvents = () => {
		// Set events
		document.querySelectorAll('#player-hand .token').forEach((token) => {
			token.addEventListener('dragstart', (e) => {
				e.dataTransfer.setData('token-id', token.id);
				_moveSource = token.parentNode;
			});
		});
		playerHand.addEventListener('dragover', _tokenOverHand);
		playerHand.addEventListener('drop', (e) => {_dropToken(e, playerHand);});
		bin.addEventListener('dragover', _tokenOverBin);
		bin.addEventListener('drop', (e) => {_dropToken(e, bin);});
		document.querySelectorAll('#board li').forEach((place) => {
			place.addEventListener('dragover', _tokenOverBoard);
			place.addEventListener('drop', _dropToken);
		});
		playButton.addEventListener('click', (e) => {
			e.preventDefault();
			const play = Game.play(gameId, false);
			_resultMove(play, false);
		});
		skipTurnButton.addEventListener('click', (e) => {
			e.preventDefault();
			let discarded_tokens = bin.children;
			if (!discarded_tokens || !B.hasClass(discarded_tokens[0], 'token')) {
				return;
			}
			const skip = Game.skip(
				gameId, parseInt(discarded_tokens[0].dataset.value)
			);
			_resultMove(skip, false);
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
