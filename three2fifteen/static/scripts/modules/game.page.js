loader.executeModule('gamePageModule',
'config', 'app', 'B', 'utils', 'Game',
(config, app, B, utils, Game) => {
	let module = {
		'dataUrls': [
			{'url': utils.format(config.api_get_game, [B.$id('current_game_id').dataset.value]), 'name': 'game'}
		],
		'action': () => {
		}
	};
	app.addModule(module);
});
