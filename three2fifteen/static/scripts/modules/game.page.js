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

	const _tokenOverBoard = (e) => {
		e.preventDefault();
	}

	const _dropTokenBoard = (e) => {
		e.preventDefault();
		const li = getLiNode(e.target);
		const token = B.$id(e.dataTransfer.getData('token-id'));
		// Prevent from dropping more than one token in the same space
		if (li.children.length) {
			return;
		}
		li.appendChild(token);
		Game.placeToken(
			gameId,
			token.id,
			parseInt(li.dataset.x),
			parseInt(li.dataset.y),
			parseInt(token.dataset.value)
		).then((score) => {
			B.$id('play-result').innerHTML = 'This play would give you ' + score + ' points';
		}).catch((error) => {
			B.$id('play-result').innerHTML = error;
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
				board_cell: {html: B.$id('board-cell').innerHTML}
			});

			// Analyse data
			Game.analyseGame(module.data.game);
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
			document.querySelectorAll('#board li').forEach((place) => {
				place.addEventListener('dragover', _tokenOverBoard, false);
				place.addEventListener('drop', _dropTokenBoard, false);
			});
		}
	};
	app.addModule(module);
});
