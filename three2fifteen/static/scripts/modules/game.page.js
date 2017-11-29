loader.executeModule('gamePageModule',
'config', 'app', 'B', 'utils', 'Game',
(config, app, B, utils, Game) => {
	const gameId = B.$id('current_game_id').dataset.value;
	let module = {
		'dataUrls': [
			{'url': utils.format(config.api_get_game, [gameId]), 'name': 'game'}
		],
		'action': () => {
			B.Template.init({
				game_ongoing: {html: B.$id('game-ongoing').innerHTML},
				game_open: {html: B.$id('game-open').innerHTML},
				game_finished: {html: B.$id('game-finished').innerHTML}
			});

			Game.analyseGame(module.data.game);
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
		}
	};
	app.addModule(module);
});
