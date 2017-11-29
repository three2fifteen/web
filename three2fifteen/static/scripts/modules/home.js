loader.executeModule('homeModule',
'config', 'app', 'B', 'Game',
(config, app, B, Game) => {
	let module = {
		'dataUrls': [
			{'url': config.api_get_games, 'name': 'games'}
		],
		'action': () => {
			B.Template.init({
				game: {html: B.$id('game-instance').innerHTML},
				game_player: {html: B.$id('game-player').innerHTML},
				game_link: {html: B.$id('game-link').innerHTML},
				game_invite_link: {html: B.$id('game-invite-link').innerHTML}
			});
			module.data.games.forEach((game) => {
				Game.analyseGame(game);
				const gameHTML = B.Template.compile('game', {game: game});
				B.$id('list-games').innerHTML += gameHTML;
			});
		}
	};
	app.addModule(module);
});
