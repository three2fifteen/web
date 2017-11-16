loader.executeModule('homeModule',
'config', 'app',
(config, app) => {
	app.addModule({
		'dataUrls': [
			{'url': config.api_get_games, 'name': 'games'}
		],
		'action': () => {
			console.log("home");
		}
	});
});
