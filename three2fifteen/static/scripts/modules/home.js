loader.executeModule('homeModule',
'config', 'app',
(config, app) => {
	let module = {
		'dataUrls': [
			{'url': config.api_get_games, 'name': 'games'}
		],
		'action': () => {
			console.log("home");
		}
	};
	app.addModule(module);
});
