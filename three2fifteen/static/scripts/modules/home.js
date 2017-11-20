loader.executeModule('homeModule',
'app', 'B',
(app, B) => {
	let module = {
		'dataUrls': [
			{'url': config.api_get_games, 'name': 'games'}
		],
		'action': () => {
			B.Template.init({
				game: {html: B.$id('game-instance').innerHTML},
				game_player: {html: B.$id('game-player').innerHTML}
			});
			module.data.games.forEach((game) => {
				game.current_players_count = game.game_players.length;
				const gameHTML = B.Template.compile('game', {game: game});
				B.$id('list-games').innerHTML += gameHTML;
			});
		}
	};
	app.addModule(module);
});
