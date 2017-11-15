loader.addModule('page', 'config', (config) => {
	return {
		'dataUrls': [
			{'url': config.api_get_games, 'name': 'games'}
		],
		'action': () => {
			console.log("home");
		}
	};
});
