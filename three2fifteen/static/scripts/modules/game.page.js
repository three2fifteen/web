loader.executeModule('gamePageModule',
'config', 'app', 'B', 'utils', 'Game',
(config, app, B, utils, Game) => {
	const gameId = B.$id('current_game_id').dataset.value;

	const getLiNode = (node) => {
		while (node && node.nodeName != 'LI') {
			node = node.parentNode;
		}
		return node;
	};

	const _tokenOverHand = (e) => {
		e.preventDefault();
	}

	const _tokenOverBoard = (e) => {
		e.preventDefault();
	}

	const _invalidPlay = (message) => {
		B.$id('confirm-play').setAttribute('disabled', 'disabled');
		B.$id('play-result').innerHTML = message;
	};

	const _resultMove = (move, dryRun) => {
		move.then((score) => {
			let message;
			if (dryRun) {
				message = 'This play would give you ';
				B.$id('confirm-play').removeAttribute('disabled');
			}
			else {
				message = 'You scored ';
			}
			B.$id('play-result').innerHTML = message + score + ' points';
		}).catch(_invalidPlay);
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
			_invalidPlay('');
		}
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
				board_cell: {html: B.$id('board-cell').innerHTML}
			});

			// Analyse data
			Game.analyseGame(module.data.game);
			Game.setBoardContent(
				module.data.board,
				module.data.game_content.tokens
			);
			module.data.player_hand.forEach((token, index) => {
				module.data.player_hand[index] = {'value': token, 'index': index};
			});

			// Render page
			let template;
			if (module.data.game.open) {
				template = 'game_open';
			}
			else if (module.data.game.date_finished) {
				template = 'game_finished';
			}
			else {
				template = 'game_ongoing';
			}
			B.$id('game-section').innerHTML = B.Template.compile(
				template,
				module.data
			);

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
		}
	};
	app.addModule(module);
});
